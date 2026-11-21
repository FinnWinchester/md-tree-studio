<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = withDefaults(defineProps<{ label: string; confirmLabel?: string; timeout?: number }>(), {
  confirmLabel: 'Confirm',
  timeout: 3000,
})
const emit = defineEmits<{ confirm: [] }>()

const armed = ref(false)
let timer: number | undefined

function onClick() {
  if (!armed.value) {
    armed.value = true
    timer = window.setTimeout(() => (armed.value = false), props.timeout)
    return
  }
  window.clearTimeout(timer)
  armed.value = false
  emit('confirm')
}

onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<template>
  <BaseButton :variant="armed ? 'danger' : 'default'" @click="onClick">
    {{ armed ? confirmLabel : label }}
  </BaseButton>
</template>
