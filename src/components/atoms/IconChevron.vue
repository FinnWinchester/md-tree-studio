<script setup lang="ts">
defineProps<{ open?: boolean }>()
</script>

<template>
  <svg class="chev" :class="{ open }" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M6 4l4 4-4 4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.chev {
  width: 14px;
  height: 14px;
  flex: none;
  color: var(--muted);
  transition: transform 0.12s;
}
.open {
  transform: rotate(90deg);
}
@media (prefers-reduced-motion: reduce) {
  .chev {
    transition: none;
  }
}
</style>
