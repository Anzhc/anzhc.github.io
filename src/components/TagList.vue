<script setup lang="ts">
defineProps<{
  items: string[];
  accent?: boolean;
}>();
</script>

<template>
  <ul class="tag-list">
    <li v-for="item in items" :key="item" class="tag-list__item" :data-accent="accent">
      {{ item }}
    </li>
  </ul>
</template>

<style scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tag-list__item {
  border-radius: 0.25rem;
  border: 1px solid var(--border-soft);
  background: var(--surface-muted);
  color: var(--text-secondary);
  padding: 0.42rem 0.8rem;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.tag-list__item[data-accent='true'] {
  background: color-mix(in srgb, var(--accent) 14%, var(--surface-muted));
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--accent) 24%, var(--border-soft));
}
</style>
