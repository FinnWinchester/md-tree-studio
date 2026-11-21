<script setup lang="ts">
export interface SelectOption {
  value: string
  label: string
}

defineProps<{ options: SelectOption[] }>()
const model = defineModel<string>({ default: '' })
</script>

<template>
  <select v-model="model" class="select">
    <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
  </select>
</template>

<style scoped>
.select {
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: 7px;
  padding: 4px 8px;
  font-size: 12.5px;
}
</style>
