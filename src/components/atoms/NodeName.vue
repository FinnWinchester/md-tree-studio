<script setup lang="ts">
defineProps<{ name: string; folder?: boolean }>()
</script>

<template>
  <span class="name" :class="{ folder }">{{ name }}</span>
</template>

<style scoped>
.name {
  font-family: var(--font-mono);
  font-size: 12.5px;
  white-space: nowrap;
}
.folder {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 13.5px;
}
</style>
