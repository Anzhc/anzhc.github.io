<template>
  <article class="info-card">
    <slot />
  </article>
</template>

<style scoped>
.info-card {
  position: relative;
  border: 1px solid var(--border-soft);
  border-radius: 0.75rem;
  background: var(--surface-card);
  overflow: hidden;
}
</style>
