<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import BackgroundGraph from './components/BackgroundGraph.vue';
import InfoCard from './components/InfoCard.vue';
import SectionShell from './components/SectionShell.vue';
import SidebarNav from './components/SidebarNav.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import {
  about,
  githubProjects,
  navItems,
  privateProjects,
  posts,
  profile,
  projects as models
} from './content';
import type { Theme } from './content';

const themeKey = 'resume-theme';
const theme = ref<Theme>(
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
);

const currentYear = new Date().getFullYear();

const setTheme = (nextTheme: Theme) => {
  theme.value = nextTheme;
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;

  try {
    window.localStorage.setItem(themeKey, nextTheme);
  } catch {
    // Ignore storage failures and keep the in-memory theme value.
  }
};

const toggleTheme = () => {
  setTheme(theme.value === 'dark' ? 'light' : 'dark');
};

const heroPrimaryLinks = computed(() =>
  profile.primaryLinks.map((link) => ({
    ...link,
    isEmail: link.href.startsWith('mailto:'),
    rel: link.external ? 'noopener noreferrer' : undefined,
    target: link.external ? '_blank' : undefined
  }))
    .sort((left, right) => {
      const order = new Map([
        ['Hugging Face', 0],
        ['GitHub', 1],
        ['Email', 2]
      ]);

      return (order.get(left.label) ?? 99) - (order.get(right.label) ?? 99);
    })
);
const activeSectionId = ref(navItems[0]?.id ?? '');

const compactNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact'
});

const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const formatCompactNumber = (value: number) => compactNumber.format(value);
const formatShortDate = (value: string) => shortDate.format(new Date(value));

let sectionObserver: IntersectionObserver | null = null;
let interactiveEdgeCleanup: (() => void) | null = null;

onMounted(() => {
  const sections = navItems
    .map((item) => document.getElementById(item.id))
    .filter((section): section is HTMLElement => section instanceof HTMLElement);

  if (sections.length === 0) {
    return;
  }

  const visibleSections = new Map<string, number>();

  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const sectionId = entry.target.id;

        if (entry.isIntersecting) {
          visibleSections.set(sectionId, entry.intersectionRatio);
        } else {
          visibleSections.delete(sectionId);
        }
      }

      if (visibleSections.size === 0) {
        return;
      }

      const [nextActiveSection] = [...visibleSections.entries()].sort((left, right) => {
        if (right[1] !== left[1]) {
          return right[1] - left[1];
        }

        const leftIndex = navItems.findIndex((item) => item.id === left[0]);
        const rightIndex = navItems.findIndex((item) => item.id === right[0]);

        return leftIndex - rightIndex;
      })[0];

      activeSectionId.value = nextActiveSection;
    },
    {
      rootMargin: '-20% 0px -55% 0px',
      threshold: [0.2, 0.35, 0.5, 0.65]
    }
  );

  for (const section of sections) {
    sectionObserver.observe(section);
  }
});

onMounted(() => {
  const interactiveElements = document.querySelectorAll<HTMLElement>(
    '.interactive-edge'
  );

  const proximityThreshold = 42;

  const updateElementProximity = (element: HTMLElement, clientX: number, clientY: number) => {
    const bounds = element.getBoundingClientRect();
    const clampedX = Math.min(Math.max(clientX, bounds.left), bounds.right);
    const clampedY = Math.min(Math.max(clientY, bounds.top), bounds.bottom);
    const deltaX = clientX - clampedX;
    const deltaY = clientY - clampedY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance <= proximityThreshold) {
      element.dataset.edgeActive = 'true';
      element.style.setProperty('--edge-x', `${clampedX - bounds.left}px`);
      element.style.setProperty('--edge-y', `${clampedY - bounds.top}px`);
      return;
    }

    delete element.dataset.edgeActive;
    element.style.removeProperty('--edge-x');
    element.style.removeProperty('--edge-y');
  };

  const resetElementProximity = (element: HTMLElement) => {
    delete element.dataset.edgeActive;
    element.style.removeProperty('--edge-x');
    element.style.removeProperty('--edge-y');
  };

  const handlePointerMove = (event: PointerEvent) => {
    for (const element of interactiveElements) {
      updateElementProximity(element, event.clientX, event.clientY);
    }
  };

  const handlePointerLeaveViewport = () => {
    for (const element of interactiveElements) {
      resetElementProximity(element);
    }
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('pointerleave', handlePointerLeaveViewport);

  const cleanups = Array.from(interactiveElements, (element) => {
    const resetPointerPosition = () => {
      delete element.dataset.edgeActive;
      element.style.removeProperty('--edge-x');
      element.style.removeProperty('--edge-y');
    };

    element.addEventListener('pointerleave', resetPointerPosition);

    return () => {
      element.removeEventListener('pointerleave', resetPointerPosition);
    };
  });

  interactiveEdgeCleanup = () => {
    window.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerleave', handlePointerLeaveViewport);

    for (const cleanup of cleanups) {
      cleanup();
    }
  };
});

onBeforeUnmount(() => {
  sectionObserver?.disconnect();
  interactiveEdgeCleanup?.();
});

</script>

<template>
  <div class="site-shell">
    <BackgroundGraph :theme="theme" />

    <SidebarNav
      :nav-items="navItems"
      :theme="theme"
      :active-section-id="activeSectionId"
      @toggle-theme="toggleTheme"
    />

    <main id="top" class="container site-main">
      <div class="mobile-tools">
        <ThemeToggle :theme="theme" @toggle="toggleTheme" />
      </div>

      <section class="hero panel">
          <div class="hero__copy">
            <h1>{{ profile.name }}</h1>
            <p class="hero__title">{{ profile.title }}</p>
            <p class="hero__intro">{{ profile.intro }}</p>

            <div class="hero__action-buttons">
              <a
                v-for="link in heroPrimaryLinks"
                :key="link.label"
                class="hero__action-link hero__action-link--button interactive-edge"
                :href="link.href"
                :target="link.target"
                :rel="link.rel"
              >
                <span class="hero__action-value">
                  {{ link.isEmail ? 'anzhc1@gmail.com' : link.label }}
                </span>
              </a>
            </div>
          </div>

          <div class="hero__avatar">
            <div class="hero__avatar-circle">
              <img :src="profile.avatarImage" :alt="profile.avatarAlt" />
            </div>
          </div>
        </section>

        <SectionShell id="about" title="About">
          <InfoCard>
            <div class="copy-block">
              <p v-for="paragraph in about.paragraphs" :key="paragraph">
                {{ paragraph }}
              </p>
            </div>
          </InfoCard>
        </SectionShell>

        <SectionShell
          id="models"
          title="Models"
        >
          <div class="project-section">
            <div class="project-groups">
            <section v-for="group in models.groups" :key="group.id" class="project-group">
              <div class="project-group__header">
                <h3>{{ group.title }}</h3>
              </div>

              <div class="project-group__panel">
                <div class="project-tabs">
                  <a
                    v-for="project in group.items"
                    :key="project.id"
                    class="project-slim-card interactive-edge"
                    :href="project.href"
                    target="_blank"
                    rel="noreferrer"
                    :title="project.repoPath"
                  >
                    <div class="project-slim-card__top">
                      <div class="project-slim-card__name">
                        <h4>{{ project.name }}</h4>
                      </div>

                      <div class="project-slim-card__stats">
                        <span class="project-slim-card__value">
                          {{ formatCompactNumber(project.monthlyDownloads) }}/month
                        </span>
                        <span class="project-slim-card__label">downloads</span>
                      </div>
                    </div>

                    <p class="project-slim-card__description">{{ project.description }}</p>
                  </a>
                </div>

                <div v-if="group.moreCount > 0" class="project-group__footer">
                  <a
                    class="project-group__more"
                    :href="group.moreHref"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ...{{ group.moreCount }} more
                  </a>
                </div>
              </div>
            </section>
            </div>

            <div class="project-section__footer">
              <span>HF static snapshot {{ formatShortDate(models.generatedAt) }}</span>
            </div>
          </div>
        </SectionShell>

        <SectionShell
          id="projects"
          title="Open Projects"
        >
          <div class="showcase-grid">
            <a
              v-for="project in githubProjects"
              :key="project.title"
              class="showcase-card__link interactive-edge"
              :href="project.href"
              target="_blank"
              rel="noreferrer"
            >
              <div class="showcase-card__body">
                <div class="showcase-card__header">
                  <h3>{{ project.title }}</h3>
                </div>

                <p>{{ project.description }}</p>
              </div>
            </a>
          </div>
        </SectionShell>

        <SectionShell
          id="private-projects"
          title="Private Projects"
        >
          <div class="showcase-grid">
            <InfoCard v-for="project in privateProjects" :key="project.title">
              <div class="showcase-card">
                <div class="showcase-card__body">
                  <div class="showcase-card__header">
                    <h3>{{ project.title }}</h3>
                  </div>

                  <p>{{ project.description }}</p>
                </div>
              </div>
            </InfoCard>
          </div>
        </SectionShell>

        <SectionShell
          id="posts"
          title="Posts"
        >
          <div class="posts-grid">
            <a
              v-for="post in posts"
              :key="post.title"
              class="post-card interactive-edge"
              :href="post.href"
              target="_blank"
              rel="noreferrer"
            >
              <div class="post-card__copy">
                <div class="showcase-card__header">
                  <h3>{{ post.title }}</h3>
                </div>

                <p>{{ post.description }}</p>
              </div>

              <div v-if="post.imageSrc" class="post-card__media">
                <img :src="post.imageSrc" :alt="post.imageAlt ?? post.title" />
              </div>
            </a>
          </div>
        </SectionShell>
    </main>

    <footer class="container site-footer">
      <p>{{ profile.name }}</p>
      <p>{{ currentYear }}</p>
    </footer>
  </div>
</template>

<style scoped>
.site-main {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 2.5rem;
  padding-top: 2.4rem;
  padding-bottom: 4rem;
}

.mobile-tools {
  display: none;
  justify-content: flex-end;
}

.panel,
.section-shell {
  animation: rise-in 680ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16rem;
  grid-template-areas:
    'copy avatar';
  align-items: center;
  gap: 1.5rem;
  padding: 1.35rem 0 0;
}

.hero__copy {
  grid-area: copy;
  display: grid;
  gap: 1rem;
}

.hero__avatar {
  grid-area: avatar;
  display: flex;
  justify-content: flex-end;
}

.hero__avatar-circle {
  width: min(16rem, 34vw);
  aspect-ratio: 1;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  background: color-mix(in srgb, var(--surface-raised) 88%, var(--bg));
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 9vw, 6.1rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  max-width: 10ch;
}

.hero__title {
  margin: 0;
  color: var(--accent-strong);
  font-size: clamp(1.05rem, 2.4vw, 1.35rem);
  font-weight: 700;
}

.hero__intro {
  margin: 0;
  max-width: 42rem;
  color: var(--text-secondary);
  font-size: 1.08rem;
  line-height: 1.8;
}

.hero__actions {
  display: grid;
  gap: 0.9rem;
}

.hero__action-link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.96rem;
}

.hero__action-link--button {
  align-items: center;
  min-height: 2.9rem;
  padding: 0.72rem 1rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.35rem;
  background: var(--surface-card);
  color: var(--text-primary);
}

.interactive-edge,
.project-group__more {
  position: relative;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.interactive-edge::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background:
    radial-gradient(
      8rem circle at var(--edge-x, 50%) var(--edge-y, 50%),
      color-mix(in srgb, var(--accent-strong) 78%, white) 0%,
      color-mix(in srgb, var(--accent) 44%, transparent) 28%,
      transparent 60%
    )
    border-box;
  opacity: 0;
  pointer-events: none;
  z-index: 3;
  transition: opacity 180ms ease;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.interactive-edge[data-edge-active='true']::after {
  opacity: 0.64;
}

.interactive-edge:hover,
.interactive-edge:focus-within,
.interactive-edge:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--bg) 65%, transparent);
}

.interactive-edge:hover,
.interactive-edge:focus-within,
.interactive-edge:focus-visible {
  border-color: var(--border-strong);
  background: color-mix(in srgb, var(--surface-card) 94%, var(--surface-raised));
}

.interactive-edge:hover::after,
.interactive-edge:focus-within::after,
.interactive-edge:focus-visible::after {
  opacity: 1;
}

.hero__action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero__action-label {
  color: var(--text-muted);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero__action-value {
  font-weight: 600;
}

.timeline-card,
.project-card,
.education-card,
.skill-card,
.highlights-block,
.copy-block {
  display: grid;
  gap: 1rem;
  padding: 1.35rem;
}

.card-label {
  margin: 0;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 800;
}

.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.skills-grid,
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.project-section {
  display: grid;
  gap: 0.95rem;
}

.project-groups {
  display: grid;
  gap: 1.35rem;
}

.project-group {
  position: relative;
  display: grid;
  gap: 1rem;
  padding: 0.4rem 1.4rem;
}

.project-group::before,
.project-group::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    color-mix(in srgb, var(--border-strong) 72%, transparent) 11%,
    color-mix(in srgb, var(--border-strong) 72%, transparent) 89%,
    transparent 100%
  );
}

.project-group::before {
  left: 0;
}

.project-group::after {
  right: 0;
}

.project-group__header {
  display: flex;
  gap: 1rem;
  align-items: baseline;
}

.project-group__header h3 {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1;
}

.project-group__more {
  color: inherit;
  text-decoration: none;
}

.project-group__panel {
  display: grid;
  gap: 0.9rem;
  align-content: start;
}

.project-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 0.85rem;
}

.project-group__footer {
  display: flex;
  justify-content: flex-end;
}

.project-group__more {
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.project-group__more:hover,
.project-group__more:focus-visible {
  color: var(--text-primary);
  transform: translateY(-1px);
}

.project-section__footer {
  display: flex;
  justify-content: flex-end;
  color: var(--text-muted);
  font-size: 0.76rem;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.posts-grid {
  display: grid;
  gap: 1rem;
}

.showcase-card {
  display: grid;
  height: 100%;
}

.showcase-card__link {
  position: relative;
  z-index: 1;
  display: grid;
  min-height: 100%;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--border-soft);
  border-radius: 0.35rem;
  background: var(--surface-card);
}

.showcase-card__link:focus-visible {
  outline: none;
}

.showcase-card__body {
  display: grid;
  gap: 0.85rem;
  min-height: 100%;
  padding: 1.2rem 1.25rem;
}

.post-card {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: stretch;
  min-height: 16rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--border-soft);
  border-radius: 0.35rem;
  background: var(--surface-card);
}

.post-card:focus-visible {
  outline: none;
}

.post-card__copy {
  display: grid;
  gap: 0.85rem;
  padding: 1.05rem 1.15rem;
}

.post-card__copy p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.75;
  white-space: pre-line;
}

.post-card__media {
  position: relative;
  display: flex;
  align-items: stretch;
  min-width: 0;
  border-left: 1px solid var(--border-soft);
  background: color-mix(in srgb, var(--surface-raised) 72%, transparent);
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  overflow: hidden;
}

.post-card__media img {
  width: auto;
  max-width: min(18rem, 28vw);
  height: 100%;
  object-fit: contain;
  display: block;
}

.showcase-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: baseline;
}

.showcase-card__header h3,
.showcase-card p {
  margin: 0;
}

.showcase-card__header h3 {
  font-size: 1.1rem;
  line-height: 1.2;
}

.showcase-card p {
  color: var(--text-secondary);
  line-height: 1.75;
}

.project-slim-card {
  display: grid;
  gap: 0.8rem;
  align-content: start;
  min-height: 8.4rem;
  padding: 0.9rem 1rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--border-soft);
  border-radius: 0.35rem;
  background: color-mix(in srgb, var(--surface-card) 88%, transparent);
}

.project-slim-card__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 1rem;
}

.project-slim-card__name {
  min-width: 0;
}

.project-slim-card__name h4 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.15;
}

.project-slim-card__description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.45;
}

.project-slim-card__stats {
  display: grid;
  color: var(--text-primary);
  font-size: 1.05rem;
  font-weight: 800;
  gap: 0.22rem;
  text-align: right;
  white-space: nowrap;
}

.project-slim-card__value {
  line-height: 1;
}

.project-slim-card__label {
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
}

.stack-grid,
.education-grid {
  display: grid;
  gap: 1rem;
}

.copy-block p,
.card-copy {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
}

.check-list {
  display: grid;
  gap: 0.85rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.check-list li {
  position: relative;
  padding-left: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.check-list li::before {
  content: '';
  position: absolute;
  top: 0.72rem;
  left: 0;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 1px;
  background: var(--accent);
}

.timeline-card__header,
.project-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.timeline-card__header h3,
.project-card__header h3 {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.2;
}

.timeline-card__company,
.project-card__blurb {
  margin: 0.35rem 0 0;
  color: var(--text-primary);
  font-weight: 700;
}

.timeline-card__company a,
.project-card__links a {
  color: inherit;
  text-decoration: none;
}

.timeline-card__meta {
  display: grid;
  gap: 0.25rem;
  text-align: right;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.project-card__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  align-items: flex-start;
}

.project-card__links a {
  color: var(--text-secondary);
  font-weight: 700;
}

.site-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 2rem;
  color: var(--text-muted);
  font-size: 0.92rem;
}

.site-footer p {
  margin: 0;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1080px) {
  .mobile-tools {
    display: flex;
  }

  .hero {
    grid-template-columns: minmax(0, 1fr) 13rem;
  }
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
    grid-template-areas:
      'copy'
      'avatar';
  }

  .hero__avatar {
    justify-content: flex-start;
  }

  .two-column,
  .skills-grid,
  .project-grid {
    grid-template-columns: 1fr;
  }

  .timeline-card__header,
  .project-card__header,
  .site-footer {
    flex-direction: column;
  }

  .timeline-card__meta {
    text-align: left;
  }

  .project-slim-card {
    align-items: start;
  }

  .project-slim-card__top {
    grid-template-columns: 1fr;
  }

  .project-slim-card__stats {
    text-align: left;
  }

  .showcase-grid {
    grid-template-columns: 1fr;
  }

  .post-card {
    grid-template-columns: 1fr;
  }

  .post-card__media {
    justify-content: center;
    min-height: 12rem;
    border-top: 1px solid var(--border-soft);
    border-left: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: inherit;
  }

  .post-card__media img {
    width: 100%;
    max-width: none;
    height: auto;
  }

  .project-group {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .project-group__header {
    flex-direction: column;
  }

  .project-section__footer {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .site-main {
    gap: 2.2rem;
  }

  .hero h1 {
    max-width: 100%;
  }

  .hero__avatar-circle {
    width: min(12rem, 52vw);
  }

  .hero__actions,
  .project-card__links {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero__actions {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
  }

  .hero__action-buttons {
    width: 100%;
  }

  .hero__action-buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .site-footer {
    padding-bottom: 2.5rem;
  }
}
</style>
