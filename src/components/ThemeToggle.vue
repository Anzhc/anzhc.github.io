<script setup lang="ts">
import type { Theme } from '../content';

defineProps<{
  theme: Theme;
}>();

defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    :aria-pressed="theme === 'light'"
    @click="$emit('toggle')"
  >
    <span class="theme-toggle__track" :data-theme="theme">
      <span class="theme-toggle__thumb" />
    </span>
    <span class="theme-toggle__label">{{ theme === 'dark' ? 'Dark' : 'Light' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--border-strong);
  border-radius: 0.6rem;
  background: var(--surface-raised);
  color: var(--text-primary);
  padding: 0.55rem 0.8rem;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}

.theme-toggle__track {
  width: 2.4rem;
  height: 1.35rem;
  background: color-mix(in srgb, var(--accent) 28%, var(--surface-muted));
  border-radius: 0.7rem;
  padding: 0.12rem;
  display: inline-flex;
}

.theme-toggle__thumb {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.45rem;
  background: var(--surface-elevated);
  transition: transform 180ms ease;
}

.theme-toggle__track[data-theme='light'] .theme-toggle__thumb {
  transform: translateX(1.03rem);
}

.theme-toggle__label {
  min-width: 2.8rem;
  text-align: left;
}
</style>
