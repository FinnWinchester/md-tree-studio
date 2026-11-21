<script setup lang="ts">
import type { MarkerKind } from '@/types/tree'

defineProps<{ kind: MarkerKind; label: string }>()
</script>

<template>
  <span class="badge" :class="`kind-${kind}`">{{ label }}</span>
</template>

<style scoped>
.badge {
  flex: none;
  min-width: 24px;
  height: 18px;
  padding: 0 4px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--c, var(--c-config));
  background: color-mix(in srgb, var(--c, var(--c-config)) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--c, var(--c-config)) 30%, transparent);
}
.kind-new {
  border-style: dashed;
}
</style>
