<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Theme } from '../content';

interface GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number;
}

interface SwarmNode {
  radius: number;
  depth: number;
  orbitPhase: number;
  orbitSpeed: number;
  floatPhase: number;
  floatSpeed: number;
  variance: number;
  anchorFlowDirection: 1 | -1;
}

interface CircleAnchor {
  centerX: number;
  centerY: number;
  radius: number;
}

const props = defineProps<{
  theme: Theme;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

const avatarSelector = '.hero__avatar-circle';

let animationFrameId = 0;
let resizeFrameId = 0;
let resizeObserver: ResizeObserver | null = null;
let mediaQuery: MediaQueryList | null = null;
let handleMotionChange: ((event: MediaQueryListEvent) => void) | null = null;
let isReducedMotion = false;
let nodes: GraphNode[] = [];
let swarmNodes: SwarmNode[] = [];
let avatarAnchor: CircleAnchor | null = null;
let anchorDirty = true;
let palette = {
  nearNode: 'rgba(229, 239, 235, 0.34)',
  farNode: 'rgba(90, 108, 114, 0.18)',
  backgroundTint: 'rgba(4, 8, 10, 0.1)'
};

const getScrollX = () => window.scrollX || window.pageXOffset || 0;
const getScrollY = () => window.scrollY || window.pageYOffset || 0;
const getSwarmCount = () => 69;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const markAnchorDirty = () => {
  anchorDirty = true;
};

const getAnchorPathPadding = (node: SwarmNode) => 10 + node.depth * 5;
const getAnchorPathMeander = (node: SwarmNode, time: number) =>
  Math.sin(time * node.floatSpeed * 0.75 + node.floatPhase * 1.2) * (8 + node.variance * 0.55);

const getNodeCount = (width: number) => {
  if (width < 640) {
    return 34;
  }

  if (width < 1024) {
    return 50;
  }

  return 72;
};

const getPalette = () => {
  const computedStyles = getComputedStyle(document.documentElement);
  const themeName = props.theme;

  if (themeName === 'light') {
    return {
      nearNode: computedStyles.getPropertyValue('--text-secondary').trim() || 'rgba(53, 80, 87, 0.28)',
      farNode: computedStyles.getPropertyValue('--text-muted').trim() || 'rgba(95, 120, 121, 0.16)',
      backgroundTint:
        computedStyles.getPropertyValue('--surface-muted').trim() || 'rgba(229, 236, 233, 0.1)'
    };
  }

  return {
    nearNode:
      computedStyles.getPropertyValue('--text-primary').trim() || 'rgba(230, 239, 235, 0.34)',
    farNode: computedStyles.getPropertyValue('--text-muted').trim() || 'rgba(111, 135, 133, 0.16)',
    backgroundTint:
      computedStyles.getPropertyValue('--surface-muted').trim() || 'rgba(15, 26, 33, 0.08)'
  };
};

const createNodes = (width: number, height: number) => {
  const count = getNodeCount(width);
  const speedScale = isReducedMotion ? 0.045 : 0.16;

  return Array.from({ length: count }, () => {
    const depth = Math.random();
    const velocityAngle = Math.random() * Math.PI * 2;
    const velocityMagnitude = speedScale * (0.35 + depth * 0.95);

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(velocityAngle) * velocityMagnitude,
      vy: Math.sin(velocityAngle) * velocityMagnitude,
      radius: 1 + depth * 1.9,
      depth
    };
  });
};

const createSwarmNodes = () =>
  Array.from({ length: getSwarmCount() }, () => {
    const depth = Math.random();

    return {
      radius: 1 + depth * 1.35,
      depth,
      orbitPhase: Math.random() * Math.PI * 2,
      orbitSpeed: (Math.random() * 0.000028 + 0.00001) * (Math.random() > 0.5 ? 1 : -1),
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: Math.random() * 0.00026 + 0.00011,
      variance: 5 + Math.random() * 11,
      anchorFlowDirection: Math.random() > 0.5 ? 1 : -1
    };
  });

const refreshAvatarAnchor = () => {
  const element = document.querySelector<HTMLElement>(avatarSelector);

  if (!element) {
    avatarAnchor = null;
    anchorDirty = false;
    return;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width < 12 || rect.height < 12) {
    avatarAnchor = null;
    anchorDirty = false;
    return;
  }

  avatarAnchor = {
    centerX: rect.left + getScrollX() + rect.width * 0.5,
    centerY: rect.top + getScrollY() + rect.height * 0.5,
    radius: Math.min(rect.width, rect.height) * 0.5
  };
  anchorDirty = false;
};

const getSwarmScreenPosition = (node: SwarmNode, time: number) => {
  if (!avatarAnchor) {
    return null;
  }

  const orbitalAngle =
    node.orbitPhase +
    time * node.orbitSpeed * Math.PI * 2 +
    node.anchorFlowDirection * Math.sin(time * node.floatSpeed + node.floatPhase) * 0.18;
  const targetRadius =
    avatarAnchor.radius + getAnchorPathPadding(node) + getAnchorPathMeander(node, time);

  return {
    x: avatarAnchor.centerX + Math.cos(orbitalAngle) * targetRadius - getScrollX(),
    y: avatarAnchor.centerY + Math.sin(orbitalAngle) * targetRadius - getScrollY()
  };
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;

  if (!canvas) {
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext('2d');

  if (!context) {
    return;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  nodes = createNodes(width, height);
  swarmNodes = createSwarmNodes();
  anchorDirty = true;
};

const scheduleResize = () => {
  cancelAnimationFrame(resizeFrameId);
  resizeFrameId = requestAnimationFrame(() => {
    resizeCanvas();
  });
};

const drawFrame = () => {
  const canvas = canvasRef.value;

  if (!canvas) {
    return;
  }

  const context = canvas.getContext('2d');

  if (!context) {
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const time = performance.now();
  const maxDistance = clamp(Math.min(width, height) * 0.16, 90, 190);
  const maxLinksPerNode = 3;

  if (anchorDirty) {
    refreshAvatarAnchor();
  }

  context.clearRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.42;
  context.fillStyle = palette.backgroundTint;
  context.fillRect(0, 0, width, height);
  context.restore();

  for (const node of nodes) {
    if (!isReducedMotion) {
      node.vx = clamp(node.vx + (Math.random() - 0.5) * 0.004, -0.18, 0.18);
      node.vy = clamp(node.vy + (Math.random() - 0.5) * 0.004, -0.18, 0.18);
    } else {
      node.vx = clamp(node.vx + (Math.random() - 0.5) * 0.0014, -0.06, 0.06);
      node.vy = clamp(node.vy + (Math.random() - 0.5) * 0.0014, -0.06, 0.06);
    }

    node.x += node.vx;
    node.y += node.vy;

    if (node.x < -40) node.x = width + 40;
    if (node.x > width + 40) node.x = -40;
    if (node.y < -40) node.y = height + 40;
    if (node.y > height + 40) node.y = -40;
  }

  for (let index = 0; index < nodes.length; index += 1) {
    const source = nodes[index];
    let connected = 0;

    for (let targetIndex = index + 1; targetIndex < nodes.length; targetIndex += 1) {
      if (connected >= maxLinksPerNode) {
        break;
      }

      const target = nodes[targetIndex];
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.hypot(dx, dy);

      if (distance > maxDistance) {
        continue;
      }

      const proximity = 1 - distance / maxDistance;
      const linkStrength = proximity * (0.18 + ((source.depth + target.depth) * 0.5) * 0.28);
      const shouldDraw = proximity > 0.22 || Math.random() < proximity * 0.28;

      if (!shouldDraw) {
        continue;
      }

      const gradient = context.createLinearGradient(source.x, source.y, target.x, target.y);
      gradient.addColorStop(
        0,
        props.theme === 'light'
          ? `rgba(53, 80, 87, ${linkStrength * 0.64})`
          : `rgba(232, 240, 236, ${linkStrength * 0.78})`
      );
      gradient.addColorStop(
        1,
        props.theme === 'light'
          ? `rgba(95, 120, 121, ${linkStrength * 0.28})`
          : `rgba(111, 135, 133, ${linkStrength * 0.24})`
      );

      context.beginPath();
      context.moveTo(source.x, source.y);
      context.lineTo(target.x, target.y);
      context.strokeStyle = gradient;
      context.lineWidth = 0.82 + proximity * 0.52;
      context.stroke();

      connected += 1;
    }
  }

  for (const node of nodes) {
    const gradient = context.createRadialGradient(
      node.x,
      node.y,
      0,
      node.x,
      node.y,
      node.radius * 3.6
    );
    const glowAlpha = 0.08 + node.depth * 0.14;
    const coreAlpha = 0.12 + node.depth * 0.28;

    gradient.addColorStop(
      0,
      props.theme === 'light'
        ? `rgba(53, 80, 87, ${coreAlpha})`
        : `rgba(238, 244, 241, ${coreAlpha})`
    );
    gradient.addColorStop(
      0.45,
      props.theme === 'light'
        ? `rgba(95, 120, 121, ${glowAlpha})`
        : `rgba(150, 168, 165, ${glowAlpha})`
    );
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.beginPath();
    context.arc(node.x, node.y, node.radius * 3.6, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();

    context.beginPath();
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    context.fillStyle = node.depth > 0.58 ? palette.nearNode : palette.farNode;
    context.fill();
  }

  const swarmPositions = swarmNodes
    .map((node) => {
      const position = getSwarmScreenPosition(node, time);

      if (!position) {
        return null;
      }

      if (
        position.x < -140 ||
        position.x > width + 140 ||
        position.y < -140 ||
        position.y > height + 140
      ) {
        return null;
      }

      return { node, x: position.x, y: position.y };
    })
    .filter((value): value is { node: SwarmNode; x: number; y: number } => value !== null);

  if (swarmPositions.length > 1) {
    for (let index = 0; index < swarmPositions.length; index += 1) {
      const source = swarmPositions[index];

      for (let targetIndex = index + 1; targetIndex < swarmPositions.length; targetIndex += 1) {
        const target = swarmPositions[targetIndex];
        const distance = Math.hypot(target.x - source.x, target.y - source.y);

        if (distance > 118) {
          continue;
        }

        const alpha = (1 - distance / 118) * 0.26;
        context.beginPath();
        context.moveTo(source.x, source.y);
        context.lineTo(target.x, target.y);
        context.strokeStyle =
          props.theme === 'light'
            ? `rgba(53, 80, 87, ${alpha})`
            : `rgba(232, 240, 236, ${alpha})`;
        context.lineWidth = 0.7;
        context.stroke();
      }
    }
  }

  for (const { node, x, y } of swarmPositions) {
    const glowRadius = node.radius * 4.8;
    const gradient = context.createRadialGradient(x, y, 0, x, y, glowRadius);
    const glowAlpha = 0.14 + node.depth * 0.18;
    const coreAlpha = 0.22 + node.depth * 0.26;

    gradient.addColorStop(
      0,
      props.theme === 'light'
        ? `rgba(53, 80, 87, ${coreAlpha})`
        : `rgba(238, 244, 241, ${coreAlpha})`
    );
    gradient.addColorStop(
      0.52,
      props.theme === 'light'
        ? `rgba(95, 120, 121, ${glowAlpha})`
        : `rgba(150, 168, 165, ${glowAlpha})`
    );
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.beginPath();
    context.arc(x, y, glowRadius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();

    context.beginPath();
    context.arc(x, y, node.radius, 0, Math.PI * 2);
    context.fillStyle =
      props.theme === 'light' ? 'rgba(53, 80, 87, 0.42)' : 'rgba(238, 244, 241, 0.58)';
    context.fill();
  }

  animationFrameId = requestAnimationFrame(drawFrame);
};

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  isReducedMotion = mediaQuery.matches;
  palette = getPalette();
  resizeCanvas();
  drawFrame();

  handleMotionChange = (event: MediaQueryListEvent) => {
    isReducedMotion = event.matches;
    resizeCanvas();
  };

  mediaQuery.addEventListener('change', handleMotionChange);

  resizeObserver = new ResizeObserver(() => {
    markAnchorDirty();
    scheduleResize();
  });

  resizeObserver.observe(document.body);
  window.addEventListener('resize', scheduleResize, { passive: true });
});

watch(
  () => props.theme,
  () => {
    palette = getPalette();
  }
);

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
  cancelAnimationFrame(resizeFrameId);
  resizeObserver?.disconnect();
  if (mediaQuery && handleMotionChange) {
    mediaQuery.removeEventListener('change', handleMotionChange);
  }
  window.removeEventListener('resize', scheduleResize);
});
</script>

<template>
  <canvas ref="canvasRef" class="background-graph" aria-hidden="true" />
</template>

<style scoped>
.background-graph {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  opacity: 0.55;
  z-index: 0;
}
</style>
