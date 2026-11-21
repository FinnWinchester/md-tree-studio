<script setup lang="ts" generic="T extends string">
export interface SegmentOption<V extends string> {
  value: V
  label: string
}

const props = defineProps<{ options: SegmentOption<T>[]; label: string }>()
const model = defineModel<T>({ required: true })

// Radio-group keyboard behaviour: arrows move the selection.
function onKeydown(event: KeyboardEvent) {
  const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
  if (!step) return
  event.preventDefault()
  const count = props.options.length
  const index = props.options.findIndex((option) => option.value === model.value)
  const next = props.options[(index + step + count) % count]
  model.value = next.value
  const group = event.currentTarget as HTMLElement
  group.querySelectorAll<HTMLElement>('[role="radio"]')[props.options.indexOf(next)]?.focus()
}
</script>

<template>
  <div class="segmented" role="radiogroup" :aria-label="label" @keydown="onKeydown">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      class="segment"
      :class="{ active: model === option.value }"
      :aria-checked="model === option.value"
      :tabindex="model === option.value ? 0 : -1"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.segmented {
  display: inline-flex;
  padding: 2px;
  gap: 2px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}
.segment {
  border: 0;
  border-radius: 6px;
  padding: 3px 10px;
  background: transparent;
  color: var(--muted);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
}
.segment:hover {
  color: var(--text);
}
.active {
  background: var(--accent-soft);
  color: var(--text);
}
</style>
