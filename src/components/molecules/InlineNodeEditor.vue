<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseInput from '@/components/atoms/BaseInput.vue'

const props = defineProps<{ name: string; comment: string }>()
const emit = defineEmits<{ commit: [edit: { name: string; comment: string }]; cancel: [] }>()

const name = ref(props.name)
const comment = ref(props.comment)
const nameInput = ref<InstanceType<typeof BaseInput>>()
let done = false

function finish(save: boolean) {
  if (done) return
  done = true
  if (save) emit('commit', { name: name.value, comment: comment.value })
  else emit('cancel')
}

// Rows can live inside <summary>, so keys and clicks must not reach it.
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

// Commit only when focus leaves both fields, so Tab between them keeps editing.
function onFocusout(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && (event.currentTarget as HTMLElement).contains(next)) return
  finish(true)
}

onMounted(() => {
  nameInput.value?.focus()
  nameInput.value?.select()
})
</script>

<template>
  <span
    class="editor"
    @click.stop.prevent
    @dblclick.stop
    @mousedown.stop
    @keyup.stop
    @keydown="onKeydown"
    @focusout="onFocusout"
  >
    <BaseInput ref="nameInput" v-model="name" variant="mono" aria-label="Name" placeholder="Name" />
    <BaseInput v-model="comment" variant="mono" aria-label="Comment" placeholder="Comment" />
  </span>
</template>

<style scoped>
.editor {
  display: inline-flex;
  flex: 1;
  gap: 6px;
  min-width: 0;
}
</style>
