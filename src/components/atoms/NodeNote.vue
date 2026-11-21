<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <span class="note">{{ text }}</span>
</template>

<style scoped>
.note {
  color: var(--muted);
  font-size: 12.5px;
  margin-left: 4px;
}
.note::before {
  content: '— ';
  opacity: 0.6;
}
</style>
