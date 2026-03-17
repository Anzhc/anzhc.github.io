from __future__ import annotations

import math
import random
import re
import json
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "public" / "og-image-v6.png"
AVATAR_PATH = ROOT / "media" / "pfp.jpg"
PROJECTS_PATH = ROOT / "src" / "content" / "projects.ts"
FONTS_DIR = ROOT / "scripts" / "fonts"
FONT_SOURCES = {
    "Electrolize-Regular.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/electrolize/Electrolize-Regular.ttf",
    "Inter-Variable.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf",
}

WIDTH = 1200
HEIGHT = 630

# Match the dark theme in src/styles.css as closely as possible.
BG_TOP = (6, 9, 12)
BG_BOTTOM = (6, 9, 13)
TEXT_PRIMARY = (230, 239, 235, 255)
TEXT_SECONDARY = (168, 186, 182, 255)
TEXT_MUTED = (111, 135, 133, 255)
TEXT_ACCENT = (119, 180, 176, 255)

NODE_NEAR = (230, 239, 235)
NODE_FAR = (111, 135, 133)
BG_TINT = (15, 26, 33, 255)

NODE_COUNT = 72
MAX_LINKS_PER_NODE = 3
MAX_DISTANCE = max(90, min(190, int(min(WIDTH, HEIGHT) * 0.16)))
FRAMES_TO_SIMULATE = 42


class GraphNode:
    def __init__(self) -> None:
        depth = random.random()
        velocity_angle = random.random() * math.pi * 2
        velocity_magnitude = 0.16 * (0.35 + depth * 0.95)
        self.x = random.random() * WIDTH
        self.y = random.random() * HEIGHT
        self.vx = math.cos(velocity_angle) * velocity_magnitude
        self.vy = math.sin(velocity_angle) * velocity_magnitude
        self.radius = 1 + depth * 1.9
        self.depth = depth


def clamp(value: float, minimum: float, maximum: float) -> float:
    return min(maximum, max(minimum, value))


def mix_channel(a: int, b: int, ratio: float) -> int:
    return int(round(a * (1 - ratio) + b * ratio))


def rgba(color: tuple[int, int, int], alpha: float) -> tuple[int, int, int, int]:
    return color[0], color[1], color[2], int(round(alpha * 255))


def lerp_color(start: tuple[int, int, int], end: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    return (
        mix_channel(start[0], end[0], amount),
        mix_channel(start[1], end[1], amount),
        mix_channel(start[2], end[2], amount),
    )


def create_nodes() -> list[GraphNode]:
    return [GraphNode() for _ in range(NODE_COUNT)]


def ensure_fonts() -> None:
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    for filename, url in FONT_SOURCES.items():
        target = FONTS_DIR / filename
        if target.exists():
            continue
        urllib.request.urlretrieve(url, target)


def step_nodes(nodes: list[GraphNode]) -> None:
    for node in nodes:
        node.vx = clamp(node.vx + (random.random() - 0.5) * 0.004, -0.18, 0.18)
        node.vy = clamp(node.vy + (random.random() - 0.5) * 0.004, -0.18, 0.18)
        node.x += node.vx
        node.y += node.vy

        if node.x < -40:
            node.x = WIDTH + 40
        if node.x > WIDTH + 40:
            node.x = -40
        if node.y < -40:
            node.y = HEIGHT + 40
        if node.y > HEIGHT + 40:
            node.y = -40


def draw_background() -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT), BG_BOTTOM)
    draw = ImageDraw.Draw(image)

    for y in range(HEIGHT):
        ratio = y / max(HEIGHT - 1, 1)
        draw.line((0, y, WIDTH, y), fill=lerp_color(BG_TOP, BG_BOTTOM, ratio))

    tint = Image.new("RGBA", (WIDTH, HEIGHT), BG_TINT)
    tint.putalpha(int(round(0.42 * 255)))
    image.alpha_composite(tint)
    return image


def draw_link(layer: Image.Image, source: GraphNode, target: GraphNode, strength: float) -> None:
    gradient = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gradient_draw = ImageDraw.Draw(gradient)

    near_alpha = strength * 0.78
    far_alpha = strength * 0.24
    near = rgba(NODE_NEAR, near_alpha)
    far = rgba(NODE_FAR, far_alpha)

    segments = 18
    width = 0.82 + (strength / 0.46) * 0.52
    points = []
    for step in range(segments + 1):
      t = step / segments
      x = source.x + (target.x - source.x) * t
      y = source.y + (target.y - source.y) * t
      points.append((x, y))

    for index in range(len(points) - 1):
        t = index / max(len(points) - 2, 1)
        color = (
            mix_channel(near[0], far[0], t),
            mix_channel(near[1], far[1], t),
            mix_channel(near[2], far[2], t),
            mix_channel(near[3], far[3], t),
        )
        gradient_draw.line((points[index], points[index + 1]), fill=color, width=max(1, int(round(width))))

    layer.alpha_composite(gradient)


def draw_node(layer: Image.Image, node: GraphNode) -> None:
    draw = ImageDraw.Draw(layer)

    glow_radius = node.radius * 3.6
    glow_alpha = 0.08 + node.depth * 0.14
    core_alpha = 0.12 + node.depth * 0.28

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_bounds = (
        node.x - glow_radius,
        node.y - glow_radius,
        node.x + glow_radius,
        node.y + glow_radius,
    )
    glow_draw.ellipse(glow_bounds, fill=rgba((238, 244, 241), core_alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(2, glow_radius * 0.55)))
    glow.putalpha(glow.getchannel("A").point(lambda value: int(value * (0.24 + glow_alpha))))
    layer.alpha_composite(glow)

    node_color = NODE_NEAR if node.depth > 0.58 else NODE_FAR
    draw.ellipse(
        (
            node.x - node.radius,
            node.y - node.radius,
            node.x + node.radius,
            node.y + node.radius,
        ),
        fill=rgba(node_color, 0.34 if node.depth > 0.58 else 0.18),
    )


def render_graph(base: Image.Image) -> None:
    nodes = create_nodes()
    for _ in range(FRAMES_TO_SIMULATE):
        step_nodes(nodes)

    links_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))

    for index, source in enumerate(nodes):
        connected = 0
        for target_index in range(index + 1, len(nodes)):
            if connected >= MAX_LINKS_PER_NODE:
                break

            target = nodes[target_index]
            dx = target.x - source.x
            dy = target.y - source.y
            distance = math.hypot(dx, dy)

            if distance > MAX_DISTANCE:
                continue

            proximity = 1 - distance / MAX_DISTANCE
            link_strength = proximity * (0.18 + ((source.depth + target.depth) * 0.5) * 0.28)
            should_draw = proximity > 0.22 or random.random() < proximity * 0.28

            if not should_draw:
                continue

            draw_link(links_layer, source, target, link_strength)
            connected += 1

    nodes_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    for node in nodes:
        draw_node(nodes_layer, node)

    base.alpha_composite(links_layer)
    base.alpha_composite(nodes_layer)


def render_avatar(base: Image.Image) -> None:
    avatar = Image.open(AVATAR_PATH).convert("RGBA")
    avatar = ImageOps.fit(
        avatar,
        (430, 430),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.42),
    )

    mask = Image.new("L", (430, 430), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 429, 429), fill=255)

    cx, cy = 930, 314
    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse((cx - 252, cy - 252, cx + 252, cy + 252), fill=rgba((63, 138, 141), 0.18))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=36))
    base.alpha_composite(shadow)

    ring = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring)
    ring_draw.ellipse(
        (cx - 235, cy - 235, cx + 235, cy + 235),
        fill=(6, 15, 22, 236),
        outline=rgba((119, 180, 176), 0.72),
        width=4,
    )
    ring_draw.ellipse(
        (cx - 220, cy - 220, cx + 220, cy + 220),
        outline=rgba((35, 73, 82), 0.82),
        width=1,
    )
    base.alpha_composite(ring)

    avatar_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    avatar_layer.paste(avatar, (cx - 215, cy - 215), mask)
    base.alpha_composite(avatar_layer)


def get_personal_monthly_downloads() -> int:
    text = PROJECTS_PATH.read_text(encoding="utf-8")
    match = re.search(r"export const projects: ProjectsContent = (\{.*\});\s*$", text, re.S)
    if not match:
        raise RuntimeError("Could not parse projects snapshot")

    projects = json.loads(match.group(1))
    personal_group = next((group for group in projects["groups"] if group["id"] == "anzhc"), None)
    if not personal_group:
        raise RuntimeError("Could not find Personal Hugging Face group")

    return sum(int(item["monthlyDownloads"]) for item in personal_group["items"])


def get_snapshot_time_label() -> str:
    text = PROJECTS_PATH.read_text(encoding="utf-8")
    match = re.search(r"export const projects: ProjectsContent = (\{.*\});\s*$", text, re.S)
    if not match:
        raise RuntimeError("Could not parse projects snapshot")

    projects = json.loads(match.group(1))
    generated_at = projects["generatedAt"]
    timestamp = generated_at.replace("Z", "+00:00")
    try:
        from datetime import datetime

        parsed = datetime.fromisoformat(timestamp)
        return parsed.strftime("HF snapshot %b %d, %Y")
    except Exception:
        return "HF snapshot"


def format_compact_number(value: int) -> str:
    if value < 1000:
        return str(value)

    thresholds = (
        (1_000_000_000, "B"),
        (1_000_000, "M"),
        (1_000, "K"),
    )
    for threshold, suffix in thresholds:
        if value >= threshold:
            compact = value / threshold
            rounded = round(compact, 1)
            if rounded >= 100 or rounded.is_integer():
                return f"{int(round(rounded))}{suffix}"
            return f"{rounded:.1f}{suffix}"

    return str(value)


def render_text(base: Image.Image) -> None:
    draw = ImageDraw.Draw(base)
    title_font = ImageFont.truetype(str(FONTS_DIR / "Electrolize-Regular.ttf"), 110)
    description_font = ImageFont.truetype(str(FONTS_DIR / "Inter-Variable.ttf"), 34)
    stats_font = ImageFont.truetype(str(FONTS_DIR / "Inter-Variable.ttf"), 29)
    snapshot_font = ImageFont.truetype(str(FONTS_DIR / "Inter-Variable.ttf"), 20)

    left = 86
    top = 128
    text_column_width = 520
    draw.text((left, top), "Anzhc", font=title_font, fill=TEXT_PRIMARY)

    text = "AI enthusiast, creating many Diffusion, Vision and other models."
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textlength(candidate, font=description_font) <= text_column_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)

    for index, line in enumerate(lines):
        draw.text((left, top + 140 + index * 46), line, font=description_font, fill=TEXT_SECONDARY)

    monthly_downloads = get_personal_monthly_downloads()
    stats_line = f"Huggingface downloads: {format_compact_number(monthly_downloads)}/month"
    stats_y = top + 310
    draw.text((left, stats_y), stats_line, font=stats_font, fill=TEXT_ACCENT)

    snapshot_line = get_snapshot_time_label()
    stats_width = draw.textlength(stats_line, font=stats_font)
    snapshot_width = draw.textlength(snapshot_line, font=snapshot_font)
    snapshot_x = left + stats_width - snapshot_width
    draw.text((snapshot_x, stats_y + 42), snapshot_line, font=snapshot_font, fill=TEXT_MUTED)


def main() -> None:
    ensure_fonts()
    image = draw_background()
    render_graph(image)
    render_text(image)
    render_avatar(image)
    OUTPUT_PATH.parent.mkdir(exist_ok=True)
    image.save(OUTPUT_PATH)
    print(OUTPUT_PATH)


if __name__ == "__main__":
    main()
