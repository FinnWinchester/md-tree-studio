<script setup lang="ts">
defineProps<{ folders: number; files: number }>()
</script>

<template>
  <span class="stats">
    {{ folders }} {{ folders === 1 ? 'folder' : 'folders' }} · {{ files }} {{ files === 1 ? 'file' : 'files' }}
  </span>
</template>

<style scoped>
.stats {
  color: var(--muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
</style>
