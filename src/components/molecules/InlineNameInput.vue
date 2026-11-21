<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseInput from '@/components/atoms/BaseInput.vue'

const props = defineProps<{ initial?: string; placeholder: string }>()
const emit = defineEmits<{ commit: [value: string]; cancel: [] }>()

const value = ref(props.initial ?? '')
const input = ref<InstanceType<typeof BaseInput>>()
let done = false

function finish(save: boolean) {
  if (done) return
  done = true
  if (save) emit('commit', value.value)
  else emit('cancel')
}

// Rows live inside <summary>, so keys and clicks must not reach it.
function onKeydown(event: KeyboardEvent) {
  event.stopPropagation()
  if (event.key === 'Enter') {
    event.preventDefault()
    finish(true)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    finish(false)
  }
}

onMounted(() => {
  input.value?.focus()
  input.value?.select()
})
</script>

<template>
  <BaseInput
    ref="input"
    v-model="value"
    variant="mono"
    :aria-label="placeholder"
    :placeholder="placeholder"
    @click.stop.prevent
    @mousedown.stop
    @keyup.stop
    @keydown="onKeydown"
    @blur="finish(true)"
  />
</template>
