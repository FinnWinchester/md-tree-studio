<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="toggle">
    <input v-model="model" type="checkbox" />
    <slot />
  </label>
</template>

<style scoped>
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--muted);
  cursor: pointer;
}
</style>
