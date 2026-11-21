<script setup lang="ts">
defineProps<{ count: number }>()
</script>

<template>
  <span class="count">{{ count }}</span>
</template>

<style scoped>
.count {
  color: var(--muted);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}
</style>
