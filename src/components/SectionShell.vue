<script setup lang="ts">
defineProps<{
  id: string;
  title: string;
  lead?: string;
  eyebrow?: string;
}>();
</script>

<template>
  <section :id="id" class="section-shell">
    <div class="section-shell__header">
      <p v-if="eyebrow" class="section-shell__eyebrow">{{ eyebrow }}</p>
      <h2 class="section-shell__title">{{ title }}</h2>
      <p v-if="lead" class="section-shell__lead">{{ lead }}</p>
    </div>
    <div class="section-shell__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.section-shell {
  scroll-margin-top: 7rem;
}

.section-shell__header {
  display: grid;
  gap: 0.9rem;
  max-width: 44rem;
  margin-bottom: 1.75rem;
}

.section-shell__eyebrow {
  margin: 0;
  color: var(--accent-strong);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  font-weight: 800;
}

.section-shell__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.85rem);
  line-height: 1;
}

.section-shell__lead {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.02rem;
  line-height: 1.75;
}

.section-shell__body {
  display: grid;
  gap: 1.25rem;
}
</style>
