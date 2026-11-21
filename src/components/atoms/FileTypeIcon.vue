<script setup lang="ts">
import type { MarkerKind } from '@/types/tree'

defineProps<{ kind: MarkerKind }>()
</script>

<template>
  <svg class="file-type-icon" :class="`kind-${kind}`" viewBox="0 0 16 16" aria-hidden="true">
    <!-- Page with a folded corner, tinted by kind -->
    <path
      class="page"
      :class="{ dashed: kind === 'new' }"
      d="M4.5 1.5h4.8l3.2 3.2v8.8a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z"
    />
    <path class="line" d="M9.2 1.7v3.1h3.1" />

    <!-- One glyph per kind -->
    <g v-if="kind === 'code'" class="line">
      <path d="M6.5 8.3L5 9.9l1.5 1.6M9.5 8.3l1.5 1.6-1.5 1.6M8.6 7.8l-1.2 4.2" />
    </g>
    <g v-else-if="kind === 'markup'" class="line">
      <span>Hello</span>
    </g>
    <g v-else-if="kind === 'style'" class="line">
      <path d="M6.6 8v4M9.6 8v4M5.2 9.2h5.6M5.2 10.9h5.6" />
    </g>
    <g v-else-if="kind === 'data'" class="line">
      <path
        d="M6.9 8.2c-1 0-1 .6-1 1.1s-.4.6-.7.7c.3.1.7.2.7.7s0 1.1 1 1.1M9.1 8.2c1 0 1 .6 1 1.1s.4.6.7.7c-.3.1-.7.2-.7.7s0 1.1-1 1.1"
      />
    </g>
    <g v-else-if="kind === 'doc'" class="line">
      <path d="M5.5 8.2h5M5.5 10h5M5.5 11.8h3" />
    </g>
    <g v-else-if="kind === 'image'">
      <path class="line" d="M4.9 12.2l2.1-2.6 1.6 1.7 1.2-1.4 1.6 2.3" />
      <circle class="dot" cx="10.4" cy="8.6" r="0.8" />
    </g>
    <g v-else-if="kind === 'new'" class="line">
      <path d="M8 8.2v3.6M6.2 10h3.6" />
    </g>
    <g v-else>
      <path class="line" d="M5.5 8.8h5M5.5 11.3h5" />
      <circle class="dot" cx="7.3" cy="8.8" r="1" />
      <circle class="dot" cx="9.3" cy="11.3" r="1" />
    </g>
  </svg>
</template>

<style scoped>
.file-type-icon {
  width: 18px;
  height: 18px;
  flex: none;
  color: var(--c, var(--c-config));
}
.page {
  fill: color-mix(in srgb, var(--c, var(--c-config)) 14%, transparent);
  stroke: currentColor;
  stroke-width: 1.1;
  stroke-linejoin: round;
}
.dashed {
  stroke-dasharray: 2 1.6;
}
.line {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.dot {
  fill: currentColor;
}
</style>
