<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import BackgroundGraph from './components/BackgroundGraph.vue';
import InfoCard from './components/InfoCard.vue';
import SectionShell from './components/SectionShell.vue';
import SidebarNav from './components/SidebarNav.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import {
  about,
  education,
  experience,
  githubProjects,
  navItems,
  privateProjects,
  posts,
  profile,
  projects as models
  ,
  websiteWork
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
const modelsTotalMonthlyDownloads = computed(() =>
  models.groups.reduce((sum, group) => sum + group.totalMonthlyDownloads, 0)
);

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
                  <div
                    :class="[
                      'project-tabs',
                      { 'project-tabs--featured': group.id === 'cabal-research' }
                    ]"
                  >
                    <a
                      v-for="project in group.items"
                      :key="project.id"
                      :class="[
                        'project-slim-card',
                        'interactive-edge',
                        { 'project-slim-card--featured': group.id === 'cabal-research' }
                      ]"
                      :href="project.href"
                      target="_blank"
                      rel="noreferrer"
                      :title="project.repoPath"
                    >
                      <span
                        v-if="group.id === 'cabal-research'"
                        class="project-slim-card__kicker"
                      >
                        Latest release
                      </span>

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

                      <p
                        :class="[
                          'project-slim-card__description',
                          { 'project-slim-card__description--featured': group.id === 'cabal-research' }
                        ]"
                      >
                        {{ project.description }}
                      </p>
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

              <div
                v-if="modelsTotalMonthlyDownloads > 0"
                class="project-groups__summary"
                :title="`${modelsTotalMonthlyDownloads.toLocaleString('en-US')} combined monthly downloads`"
              >
                <span
                  class="project-groups__summary-line project-groups__summary-line--top"
                  aria-hidden="true"
                />
                <div class="project-groups__summary-copy">
                  <span class="project-groups__summary-value">
                    {{ formatCompactNumber(modelsTotalMonthlyDownloads) }}/month
                  </span>
                  <span class="project-groups__summary-label">combined</span>
                </div>
                <span
                  class="project-groups__summary-line project-groups__summary-line--bottom"
                  aria-hidden="true"
                />
              </div>
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
          id="website-work"
          title="Website Work"
        >
          <div class="website-work-grid">
            <a
              v-for="project in websiteWork"
              :key="project.title"
              class="showcase-card__link interactive-edge"
              :href="project.href"
              target="_blank"
              rel="noreferrer"
            >
              <div class="showcase-card">
                <div class="showcase-card__body">
                  <div class="showcase-card__header showcase-card__header--icon">
                    <div
                      v-if="project.imageSrc"
                      class="showcase-card__icon"
                    >
                      <img :src="project.imageSrc" :alt="project.imageAlt ?? project.title" />
                    </div>
                    <h3>{{ project.title }}</h3>
                  </div>

                  <p>
                    {{ project.descriptionBeforeLink }}
                    <a
                      :href="project.linkHref"
                      target="_blank"
                      rel="noreferrer"
                      @click.stop
                    >
                      {{ project.linkLabel }}
                    </a>
                    {{ project.descriptionAfterLink }}
                  </p>
                </div>
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

        <SectionShell
          id="experience"
          title="Experience"
        >
          <div v-if="experience.length" class="stack-grid">
            <InfoCard v-for="item in experience" :key="`${item.company}-${item.role}`">
              <div class="timeline-card">
                <div class="timeline-card__header">
                  <div>
                    <h3>{{ item.role }}</h3>
                    <p class="timeline-card__company">
                      <a
                        v-if="item.website"
                        :href="item.website"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {{ item.company }}
                      </a>
                      <template v-else>
                        {{ item.company }}
                      </template>
                    </p>
                  </div>

                  <div class="timeline-card__meta">
                    <span>{{ item.period }}</span>
                    <span v-if="item.location">{{ item.location }}</span>
                  </div>
                </div>

                <p class="card-copy">{{ item.summary }}</p>

                <ul v-if="item.achievements?.length" class="check-list">
                  <li v-for="achievement in item.achievements" :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>

                <div v-if="item.tech?.length" class="stack-copy">
                  <p class="card-label">Tech</p>
                  <p class="card-copy">{{ item.tech.join(' • ') }}</p>
                </div>
              </div>
            </InfoCard>
          </div>
          <InfoCard v-else>
            <div class="copy-block">
              <p>Placeholder</p>
            </div>
          </InfoCard>
        </SectionShell>

        <SectionShell
          id="education"
          title="Education"
        >
          <div v-if="education.length" class="education-grid">
            <InfoCard v-for="item in education" :key="`${item.institution}-${item.program}`">
              <div class="education-card">
                <div class="education-card__header">
                  <div>
                    <h3>{{ item.program }}</h3>
                  </div>

                  <div
                    v-if="item.period || item.location"
                    class="education-card__meta"
                  >
                    <span v-if="item.period">{{ item.period }}</span>
                    <span v-if="item.location">{{ item.location }}</span>
                  </div>
                </div>

                <p v-if="item.details" class="card-copy">{{ item.details }}</p>

                <ul v-if="item.extras?.length" class="check-list">
                  <li v-for="extra in item.extras" :key="extra">
                    {{ extra }}
                  </li>
                </ul>
              </div>
            </InfoCard>
          </div>
          <InfoCard v-else>
            <div class="copy-block">
              <p>Placeholder</p>
            </div>
          </InfoCard>
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
  position: relative;
}

.project-group {
  position: relative;
  display: grid;
  gap: 1rem;
  padding: 0.4rem 1.4rem;
}

.project-groups__summary {
  position: absolute;
  top: 0.4rem;
  bottom: 0.4rem;
  left: calc(100% + 0.18rem);
  width: clamp(6.6rem, 7vw, 8.1rem);
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  row-gap: 0.9rem;
  justify-items: center;
  pointer-events: none;
}

.project-groups__summary-copy {
  display: grid;
  gap: 0.2rem;
  align-self: center;
  justify-items: center;
  text-align: center;
  width: 100%;
  padding-inline: 0.25rem;
}

.project-groups__summary-value {
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.project-groups__summary-label {
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
}

.project-groups__summary-line {
  position: relative;
  --summary-bracket-color: color-mix(in srgb, var(--border-strong) 78%, transparent);
  width: 3.7rem;
  min-height: 3rem;
  justify-self: start;
  border-right: 1px solid var(--summary-bracket-color);
}

.project-groups__summary-line--top {
  border-top: 1px solid var(--summary-bracket-color);
  border-top-right-radius: 999px;
}

.project-groups__summary-line--top::before,
.project-groups__summary-line--top::after,
.project-groups__summary-line--bottom::before,
.project-groups__summary-line--bottom::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.project-groups__summary-line--top::before {
  top: -1px;
  left: 0;
  width: 2.6rem;
  height: 1px;
  background: linear-gradient(
    90deg,
    var(--bg) 0%,
    var(--bg) 34%,
    color-mix(in srgb, var(--bg) 72%, transparent) 68%,
    transparent 100%
  );
}

.project-groups__summary-line--top::after {
  right: -1px;
  bottom: 0;
  width: 1px;
  height: 1.2rem;
  background: linear-gradient(180deg, transparent 0%, var(--bg) 100%);
}

.project-groups__summary-line--bottom {
  border-bottom: 1px solid var(--summary-bracket-color);
  border-bottom-right-radius: 999px;
}

.project-groups__summary-line--bottom::before {
  bottom: -1px;
  left: 0;
  width: 2.6rem;
  height: 1px;
  background: linear-gradient(
    90deg,
    var(--bg) 0%,
    var(--bg) 34%,
    color-mix(in srgb, var(--bg) 72%, transparent) 68%,
    transparent 100%
  );
}

.project-groups__summary-line--bottom::after {
  right: -1px;
  width: 1px;
  top: 0;
  height: 1.2rem;
  background: linear-gradient(180deg, var(--bg) 0%, transparent 100%);
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

.project-tabs--featured {
  grid-template-columns: minmax(0, 1fr);
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

.website-work-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
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

.showcase-card__header--icon {
  justify-content: flex-start;
  align-items: center;
}

.showcase-card__icon {
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  overflow: hidden;
  background: color-mix(in srgb, var(--surface-raised) 78%, transparent);
}

.showcase-card__icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.showcase-card__header h3,
.showcase-card__body p {
  margin: 0;
}

.showcase-card__header h3 {
  font-size: 1.1rem;
  line-height: 1.2;
}

.showcase-card__body p {
  color: var(--text-secondary);
  line-height: 1.75;
}

.showcase-card__body p a {
  color: var(--accent-strong);
  text-decoration: underline;
  text-underline-offset: 0.18em;
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

.project-slim-card--featured {
  position: relative;
  min-height: 14rem;
  padding: 1.15rem 1.15rem 1.1rem;
  overflow: hidden;
  isolation: isolate;
  background: color-mix(in srgb, var(--surface-card) 94%, var(--surface-raised));
}

.project-slim-card--featured::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(
      180deg,
      var(--surface-card) 0%,
      color-mix(in srgb, var(--surface-card) 100%, transparent) 16%,
      color-mix(in srgb, var(--surface-card) 82%, transparent) 36%,
      color-mix(in srgb, var(--surface-card) 28%, transparent) 62%,
      transparent 80%
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, rgb(8 10 16) 62%, transparent) 0%,
      color-mix(in srgb, rgb(8 10 16) 52%, transparent) 52%,
      color-mix(in srgb, rgb(8 10 16) 42%, transparent) 100%
    ),
    url('../media/mugen.webp');
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

.project-slim-card--featured > * {
  position: relative;
  z-index: 1;
}

.project-slim-card__kicker {
  color: color-mix(in srgb, white 72%, var(--text-primary));
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
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

.project-slim-card--featured .project-slim-card__name h4,
.project-slim-card--featured .project-slim-card__value {
  text-shadow: 0 2px 16px color-mix(in srgb, black 45%, transparent);
}

.project-slim-card__description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.45;
}

.project-slim-card--featured .project-slim-card__description {
  max-width: 46rem;
  color: color-mix(in srgb, white 82%, var(--text-secondary));
  line-height: 1.6;
}

.project-slim-card__description--featured {
  align-self: end;
  padding: 0.95rem 1rem;
  border: 1px solid color-mix(in srgb, white 10%, transparent);
  border-radius: 0.35rem;
  background: color-mix(in srgb, var(--surface-card) 72%, transparent);
  backdrop-filter: blur(5px);
  box-shadow: 0 10px 24px color-mix(in srgb, black 24%, transparent);
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

.project-slim-card--featured .project-slim-card__label {
  color: color-mix(in srgb, white 55%, var(--text-muted));
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

.card-copy {
  white-space: pre-line;
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
.education-card__header,
.project-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.timeline-card__header h3,
.education-card__header h3,
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

.education-card__meta,
.stack-copy {
  display: grid;
  gap: 0.25rem;
}

.education-card__meta {
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

@media (max-width: 1320px) {
  .project-groups__summary {
    display: none;
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
  .education-card__header,
  .project-card__header,
  .site-footer {
    flex-direction: column;
  }

  .timeline-card__meta,
  .education-card__meta {
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
