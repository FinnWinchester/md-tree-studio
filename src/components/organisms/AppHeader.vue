<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import BaseButton from '@/components/atoms/BaseButton.vue'
import Spacer from '@/components/atoms/Spacer.vue'

const theme = useTheme()
</script>

<template>
  <header class="top">
    <h1>MD Tree Studio</h1>
    <p>Edit the Markdown or the explorer. The other side follows.</p>
    <Spacer />
    <BaseButton aria-label="Toggle light or dark theme" @click="theme.toggle()">Theme</BaseButton>
  </header>
</template>

<style scoped>
.top {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 10px 20px;
  border-bottom: 1px solid var(--line);
  background: var(--surface);
}
h1 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.01em;
}
p {
  margin: 0;
  color: var(--muted);
}
</style>
