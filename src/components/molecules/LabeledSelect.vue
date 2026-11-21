<script setup lang="ts">
import { useId } from 'vue'
import BaseSelect, { type SelectOption } from '@/components/atoms/BaseSelect.vue'

defineProps<{ label: string; options: SelectOption[] }>()
const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <label :for="id" class="label">{{ label }}</label>
  <BaseSelect :id="id" v-model="model" :options="options" />
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--muted);
}
</style>
