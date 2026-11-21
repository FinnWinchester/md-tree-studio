<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <span class="status" role="status" aria-live="polite">{{ text }}</span>
</template>

<style scoped>
.status {
  font-size: 12px;
  color: var(--accent);
}
</style>
