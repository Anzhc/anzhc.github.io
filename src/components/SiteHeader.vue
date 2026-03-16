<script setup lang="ts">
import { ref } from 'vue';
import type { NavItem, Theme } from '../content';
import ThemeToggle from './ThemeToggle.vue';

defineProps<{
  name: string;
  title: string;
  navItems: NavItem[];
  theme: Theme;
}>();

defineEmits<{
  toggleTheme: [];
}>();

const menuOpen = ref(false);

const handleNavClick = () => {
  menuOpen.value = false;
};
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner container">
      <a class="site-header__brand" href="#top" @click="handleNavClick">
        <span class="site-header__name">{{ name }}</span>
        <span class="site-header__title">{{ title }}</span>
      </a>

      <div class="site-header__controls">
        <button
          class="site-header__menu"
          type="button"
          :aria-expanded="menuOpen"
          aria-label="Toggle navigation"
          @click="menuOpen = !menuOpen"
        >
          Menu
        </button>

        <nav class="site-header__nav" :data-open="menuOpen">
          <a
            v-for="item in navItems"
            :key="item.id"
            class="site-header__link"
            :href="`#${item.id}`"
            @click="handleNavClick"
          >
            {{ item.label }}
          </a>
        </nav>

        <ThemeToggle :theme="theme" @toggle="$emit('toggleTheme')" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 1rem 0 0;
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.8rem;
  background: var(--surface-header);
  padding: 0.9rem 1rem;
}

.site-header__brand {
  display: grid;
  gap: 0.2rem;
  text-decoration: none;
  min-width: 0;
}

.site-header__name {
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.site-header__title {
  color: var(--text-muted);
  font-size: 0.82rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-header__controls {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.site-header__menu {
  display: none;
  border: 1px solid var(--border-soft);
  border-radius: 0.6rem;
  background: var(--surface-muted);
  color: var(--text-primary);
  padding: 0.55rem 0.95rem;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.site-header__link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 700;
  padding: 0.55rem 0.85rem;
  border-radius: 0.55rem;
  transition:
    color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

.site-header__link:hover {
  color: var(--text-primary);
  background: var(--surface-muted);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .site-header__inner {
    align-items: flex-start;
  }

  .site-header__controls {
    position: relative;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .site-header__menu {
    display: inline-flex;
  }

  .site-header__nav {
    position: absolute;
    top: calc(100% + 0.75rem);
    right: 0;
    min-width: 11rem;
    display: grid;
    gap: 0.4rem;
    padding: 0.7rem;
    border: 1px solid var(--border-soft);
    border-radius: 0.75rem;
    background: var(--surface-header);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-0.5rem);
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  .site-header__nav[data-open='true'] {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .site-header__link {
    background: var(--surface-muted);
  }
}

@media (max-width: 720px) {
  .site-header__inner {
    flex-direction: column;
    align-items: stretch;
  }

  .site-header__controls {
    justify-content: space-between;
  }
}
</style>
