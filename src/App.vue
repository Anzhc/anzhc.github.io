<script setup lang="ts">
import { computed, ref } from 'vue';
import InfoCard from './components/InfoCard.vue';
import SectionShell from './components/SectionShell.vue';
import SidebarNav from './components/SidebarNav.vue';
import TagList from './components/TagList.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import { about, education, experience, navItems, profile, projects } from './content';
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

const heroActions = computed(() =>
  profile.primaryLinks.map((link) => ({
    ...link,
    isEmail: link.href.startsWith('mailto:'),
    rel: link.external ? 'noopener noreferrer' : undefined,
    target: link.external ? '_blank' : undefined
  }))
);

const heroEmailLink = computed(() => heroActions.value.find((link) => link.isEmail));
const heroSocialLinks = computed(() => heroActions.value.filter((link) => !link.isEmail));

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

</script>

<template>
  <div class="site-shell">
    <SidebarNav
      :nav-items="navItems"
      :theme="theme"
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
          </div>

          <div class="hero__actions">
            <div class="hero__action-email">
              <a
                v-if="heroEmailLink"
                class="hero__action-link hero__action-link--email"
                :href="heroEmailLink.href"
              >
                <span class="hero__action-value">email@mai.mail</span>
              </a>
            </div>

            <div class="hero__action-buttons">
              <a
                v-for="link in heroSocialLinks"
                :key="link.label"
                class="hero__action-link hero__action-link--button"
                :href="link.href"
                :target="link.target"
                :rel="link.rel"
              >
                <span class="hero__action-value">{{ link.label }}</span>
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
          id="projects"
          title="Projects"
        >
          <div class="project-section">
            <div class="project-groups">
            <section v-for="group in projects.groups" :key="group.id" class="project-group">
              <div class="project-group__header">
                <h3>{{ group.title }}</h3>
              </div>

              <div class="project-group__panel">
                <div class="project-tabs">
                  <a
                    v-for="project in group.items"
                    :key="project.id"
                    class="project-slim-card"
                    :href="project.href"
                    target="_blank"
                    rel="noreferrer"
                    :title="project.repoPath"
                  >
                    <div class="project-slim-card__name">
                      <h4>{{ project.name }}</h4>
                      <p>{{ project.repoPath }}</p>
                    </div>

                    <div class="project-slim-card__stats">
                      <span class="project-slim-card__value">
                        {{ formatCompactNumber(project.monthlyDownloads) }}/month
                      </span>
                      <span class="project-slim-card__label">downloads</span>
                    </div>
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
              <span>HF static snapshot {{ formatShortDate(projects.generatedAt) }}</span>
            </div>
          </div>
        </SectionShell>

        <SectionShell
          id="education"
          title="Education"
        >
          <div class="education-grid">
            <InfoCard v-for="item in education" :key="`${item.institution}-${item.program}`">
              <div class="education-card">
                <div class="timeline-card__header">
                  <div>
                    <h3>{{ item.program }}</h3>
                    <p class="timeline-card__company">{{ item.institution }}</p>
                  </div>
                  <div class="timeline-card__meta">
                    <span>{{ item.period }}</span>
                    <span>{{ item.location }}</span>
                  </div>
                </div>

                <p class="card-copy">{{ item.details }}</p>
                <TagList :items="item.extras" />
              </div>
            </InfoCard>
          </div>
        </SectionShell>

        <SectionShell
          id="experience"
          title="Experience"
        >
          <div class="stack-grid">
            <InfoCard v-for="role in experience" :key="`${role.company}-${role.role}`">
              <div class="timeline-card">
                <div class="timeline-card__header">
                  <div>
                    <h3>{{ role.role }}</h3>
                    <p class="timeline-card__company">
                      <a
                        v-if="role.website"
                        :href="role.website"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {{ role.company }}
                      </a>
                      <template v-else>
                        {{ role.company }}
                      </template>
                    </p>
                  </div>
                  <div class="timeline-card__meta">
                    <span>{{ role.period }}</span>
                    <span>{{ role.location }}</span>
                  </div>
                </div>

                <p class="card-copy">{{ role.summary }}</p>

                <ul class="check-list">
                  <li v-for="achievement in role.achievements" :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>

                <TagList :items="role.tech" />
              </div>
            </InfoCard>
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
  display: grid;
  gap: 5.5rem;
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
  grid-template-columns: minmax(0, 1fr) auto 16rem;
  grid-template-areas:
    'copy actions avatar';
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
  grid-area: actions;
  display: grid;
  gap: 0.9rem;
  align-content: center;
  justify-items: center;
  min-width: 10rem;
}

.hero__action-email {
  display: flex;
  justify-content: center;
  min-width: 0;
}

.hero__action-link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.96rem;
}

.hero__action-link--email {
  color: var(--text-primary);
  justify-self: start;
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

.hero__action-buttons {
  display: grid;
  gap: 0.75rem;
  justify-items: center;
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
.contact-card,
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

.two-column,
.contact-grid {
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
}

.project-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

.project-section__footer {
  display: flex;
  justify-content: flex-end;
  color: var(--text-muted);
  font-size: 0.76rem;
}

.project-slim-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--border-soft);
  border-radius: 0.35rem;
  background: color-mix(in srgb, var(--surface-card) 88%, transparent);
}

.project-slim-card__name {
  min-width: 0;
}

.project-slim-card__name h4 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.15;
}

.project-slim-card__name p {
  margin: 0.35rem 0 0;
  color: var(--text-muted);
  font-family: Consolas, 'Courier New', monospace;
  font-size: 0.76rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.project-card__header h3,
.contact-card h3 {
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
.project-card__links a,
.contact-links__item {
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

.contact-links {
  display: grid;
}

.contact-links__item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.35rem;
  border-top: 1px solid var(--border-soft);
}

.contact-links__item:first-child {
  border-top: 0;
}

.contact-links__label {
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  font-weight: 800;
}

.contact-links__value {
  text-align: right;
  font-weight: 700;
}

.site-footer {
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
    grid-template-columns: minmax(0, 1fr) auto 13rem;
  }
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
    grid-template-areas:
      'copy'
      'actions'
      'avatar';
  }

  .hero__avatar {
    justify-content: flex-start;
  }

  .two-column,
  .contact-grid,
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
    grid-template-columns: 1fr;
    align-items: start;
  }

  .project-slim-card__stats {
    text-align: left;
  }

  .project-tabs {
    grid-template-columns: 1fr;
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
    gap: 4.25rem;
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

  .hero__action-email,
  .hero__action-buttons {
    width: 100%;
  }

  .hero__action-buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .contact-links__item {
    flex-direction: column;
  }

  .contact-links__value {
    text-align: left;
  }

  .site-footer {
    padding-bottom: 2.5rem;
  }
}
</style>
