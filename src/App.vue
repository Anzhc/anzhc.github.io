<script setup lang="ts">
import { computed, ref } from 'vue';
import InfoCard from './components/InfoCard.vue';
import SectionShell from './components/SectionShell.vue';
import SidebarNav from './components/SidebarNav.vue';
import TagList from './components/TagList.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import { about, contact, education, experience, navItems, profile, projects, skillGroups } from './content';
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
    rel: link.external ? 'noopener noreferrer' : undefined,
    target: link.external ? '_blank' : undefined
  }))
);

const contactLinks = computed(() =>
  contact.links.map((link) => ({
    ...link,
    rel: link.href.startsWith('http') ? 'noopener noreferrer' : undefined,
    target: link.href.startsWith('http') ? '_blank' : undefined
  }))
);
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

            <div class="hero__actions">
              <a
                v-for="link in heroActions"
                :key="link.label"
                class="button"
                :class="{ 'button--ghost': link.external }"
                :href="link.href"
                :target="link.target"
                :rel="link.rel"
              >
                {{ link.label }}
              </a>
            </div>
          </div>

          <div class="hero__aside">
            <InfoCard>
              <div class="summary-card">
                <p class="summary-card__label">Profile Summary</p>
                <p class="summary-card__text">{{ profile.summary }}</p>
                <div class="summary-card__meta">
                  <span>{{ profile.location }}</span>
                  <span>{{ profile.availability }}</span>
                </div>
              </div>
            </InfoCard>

            <div class="stats-grid">
              <InfoCard v-for="stat in profile.stats" :key="stat.label">
                <div class="stat-card">
                  <strong>{{ stat.value }}</strong>
                  <span>{{ stat.label }}</span>
                </div>
              </InfoCard>
            </div>
          </div>
        </section>

        <SectionShell id="about" title="About">
          <div class="two-column">
            <InfoCard>
              <div class="copy-block">
                <p v-for="paragraph in about.paragraphs" :key="paragraph">
                  {{ paragraph }}
                </p>
              </div>
            </InfoCard>

            <InfoCard>
              <div class="highlights-block">
                <p class="card-label">Working Style</p>
                <ul class="check-list">
                  <li v-for="highlight in about.highlights" :key="highlight">
                    {{ highlight }}
                  </li>
                </ul>
              </div>
            </InfoCard>
          </div>
        </SectionShell>

        <SectionShell
          id="skills"
          title="Skills / Tech Stack"
        >
          <div class="skills-grid">
            <InfoCard v-for="group in skillGroups" :key="group.title">
              <div class="skill-card">
                <div>
                  <p class="card-label">{{ group.title }}</p>
                  <p class="card-copy">{{ group.description }}</p>
                </div>
                <TagList :items="group.items" accent />
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

        <SectionShell
          id="projects"
          title="Projects"
        >
          <div class="project-grid">
            <InfoCard v-for="project in projects" :key="project.name">
              <div class="project-card">
                <div class="project-card__header">
                  <div>
                    <h3>{{ project.name }}</h3>
                    <p class="project-card__blurb">{{ project.blurb }}</p>
                  </div>

                  <div class="project-card__links">
                    <a
                      v-for="link in project.links"
                      :key="`${project.name}-${link.label}`"
                      :href="link.href"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {{ link.label }}
                    </a>
                  </div>
                </div>

                <p class="card-copy">{{ project.description }}</p>
                <TagList :items="project.stack" accent />

                <ul class="check-list">
                  <li v-for="highlight in project.highlights" :key="highlight">
                    {{ highlight }}
                  </li>
                </ul>
              </div>
            </InfoCard>
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

        <SectionShell id="contact" title="Contact / Links">
          <div class="contact-grid">
            <InfoCard>
              <div class="contact-card">
                <p class="card-label">Availability</p>
                <h3>{{ contact.heading }}</h3>
                <p class="card-copy">{{ contact.availability }}</p>
              </div>
            </InfoCard>

            <InfoCard>
              <div class="contact-links">
                <a
                  v-for="link in contactLinks"
                  :key="link.label"
                  class="contact-links__item"
                  :href="link.href"
                  :target="link.target"
                  :rel="link.rel"
                >
                  <span class="contact-links__label">{{ link.label }}</span>
                  <span class="contact-links__value">{{ link.value }}</span>
                </a>
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
  grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 0.95fr);
  gap: 1.5rem;
  padding: 1.35rem 0 0;
}

.hero__copy,
.hero__aside {
  display: grid;
  gap: 1rem;
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
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.6rem;
}

.summary-card,
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

.summary-card__label,
.card-label {
  margin: 0;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 800;
}

.summary-card__text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.summary-card__meta {
  display: grid;
  gap: 0.55rem;
  color: var(--text-primary);
  font-size: 0.94rem;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.stat-card {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
}

.stat-card strong {
  font-size: 2rem;
  line-height: 1;
  letter-spacing: -0.05em;
}

.stat-card span {
  color: var(--text-secondary);
  line-height: 1.5;
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
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
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
}

@media (max-width: 640px) {
  .site-main {
    gap: 4.25rem;
  }

  .hero h1 {
    max-width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero__actions,
  .project-card__links {
    flex-direction: column;
    align-items: stretch;
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
