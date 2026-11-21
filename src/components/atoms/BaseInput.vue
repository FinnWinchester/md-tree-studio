<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{ variant?: 'title' | 'mono' }>(), { variant: 'mono' })
const model = defineModel<string>({ default: '' })
const el = ref<HTMLInputElement>()

defineExpose({
  focus: () => el.value?.focus(),
  select: () => el.value?.select(),
})
</script>

<template>
  <input ref="el" v-model="model" type="text" class="input" :class="variant" autocomplete="off" spellcheck="false" />
</template>

<style scoped>
.input {
  background: transparent;
}
.title {
  flex: 1;
  min-width: 120px;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 4px 6px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
}
.title:hover,
.title:focus {
  border-color: var(--line);
  background: var(--surface);
}
.mono {
  flex: 1;
  min-width: 130px;
  max-width: 300px;
  border: 1px solid var(--accent);
  border-radius: 5px;
  padding: 2px 6px;
  background: var(--surface);
  font-family: var(--font-mono);
  font-size: 12.5px;
}
</style>
