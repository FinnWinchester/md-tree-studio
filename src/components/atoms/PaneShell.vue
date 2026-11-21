<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <section class="pane" :aria-label="label">
    <slot />
  </section>
</template>

<style scoped>
.pane {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
@media (min-width: 900px) {
  .pane {
    min-height: 0;
  }
}
</style>
