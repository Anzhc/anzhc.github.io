<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
import type { NavItem, Theme } from '../content';

defineProps<{
  navItems: NavItem[];
  theme: Theme;
  activeSectionId?: string;
}>();

defineEmits<{
  toggleTheme: [];
}>();
</script>

<template>
  <aside class="sidebar-nav">
    <nav class="sidebar-nav__links" aria-label="Section navigation">
      <button class="sidebar-nav__toggle" type="button" @click="$emit('toggleTheme')">
        <span class="sidebar-nav__toggle-icon" aria-hidden="true">
          <MoonIcon v-if="theme === 'dark'" class="sidebar-nav__icon-svg" />
          <SunIcon v-else class="sidebar-nav__icon-svg sidebar-nav__icon-svg--sun" />
        </span>
        <span class="sidebar-nav__sr-only">
          Switch to {{ theme === 'dark' ? 'light' : 'dark' }} theme
        </span>
      </button>

      <a
        v-for="item in navItems"
        :key="item.id"
        class="sidebar-nav__link"
        :class="{ 'sidebar-nav__link--active': item.id === activeSectionId }"
        :href="`#${item.id}`"
      >
        {{ item.label }}
      </a>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar-nav {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 10;
}

.sidebar-nav__links {
  display: grid;
  gap: 1.15rem;
  padding-left: 1rem;
}

.sidebar-nav__link,
.sidebar-nav__toggle {
  display: block;
}

.sidebar-nav__link {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  letter-spacing: -0.01em;
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.sidebar-nav__link::before {
  content: '-';
  display: inline-block;
  width: 1.35rem;
  margin-right: 0.5rem;
  color: var(--accent-strong);
}

.sidebar-nav__link--active {
  color: var(--text-primary);
  transform: translateX(0.2rem);
}

.sidebar-nav__link--active::before {
  color: var(--accent);
}

.sidebar-nav__link:hover,
.sidebar-nav__link:focus-visible {
  color: var(--text-primary);
  transform: translateX(0.14rem);
}

.sidebar-nav__toggle {
  justify-self: start;
  margin-bottom: 0.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  padding: 0;
  border: 1px solid var(--border-strong);
  border-radius: 0.28rem;
  background: var(--surface-raised);
  color: var(--text-primary);
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.sidebar-nav__toggle:hover,
.sidebar-nav__toggle:focus-visible {
  border-color: var(--border-strong);
  background: color-mix(in srgb, var(--surface-raised) 90%, var(--surface-card));
  transform: translateY(-2px);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--bg) 65%, transparent);
}

.sidebar-nav__toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sidebar-nav__icon-svg {
  width: 1.3rem;
  height: 1.3rem;
}

.sidebar-nav__icon-svg--sun {
  transform: scale(1.12);
}

.sidebar-nav__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1180px) {
  .sidebar-nav {
    display: none;
  }
}
</style>
