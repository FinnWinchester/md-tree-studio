<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@/composables/useClipboard'
import { useStatus } from '@/composables/useStatus'
import { useStudio } from '@/composables/useStudio'
import { useTreeEditor } from '@/composables/useTreeEditor'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseTextarea from '@/components/atoms/BaseTextarea.vue'
import PaneHead from '@/components/atoms/PaneHead.vue'
import PaneShell from '@/components/atoms/PaneShell.vue'
import PaneToolbar from '@/components/atoms/PaneToolbar.vue'
import Spacer from '@/components/atoms/Spacer.vue'
import StatusText from '@/components/atoms/StatusText.vue'
import ConfirmButton from '@/components/molecules/ConfirmButton.vue'

const studio = useStudio()
const editor = useTreeEditor()
const status = useStatus()
const clipboard = useClipboard()

const title = computed({
  get: () => studio.active.value.title,
  set: (value: string) => studio.setTitle(value),
})
const markdown = computed({
  get: () => studio.active.value.md,
  set: (value: string) => {
    editor.cancelEdit()
    studio.setMarkdown(value)
  },
})
</script>

<template>
  <PaneShell label="Markdown editor">
    <PaneHead>
      <BaseInput v-model="title" variant="title" aria-label="Example name" maxlength="60" />
      <BaseButton @click="studio.duplicate()">Duplicate</BaseButton>
      <ConfirmButton label="Delete" confirm-label="Confirm delete" @confirm="studio.remove()" />
    </PaneHead>
    <PaneToolbar>
      <BaseButton @click="clipboard.copy(editor.asciiText())">Copy tree</BaseButton>
      <Spacer />
      <StatusText :text="status.message.value" />
      <BaseButton @click="editor.regenerateMarkdown()">Regenerate Markdown from preview</BaseButton>
    </PaneToolbar>
    <BaseTextarea v-model="markdown" aria-label="Markdown structure" />
    <p class="hint">
      Paste a Markdown tree (<code>├──</code>) or plain indentation; it is always written back as a Markdown
      tree. End a name with <code>/</code> for an empty folder. Add a note after <code> # </code>. In the preview, hover a row
      to add, rename or delete, and drag rows to move them.
    </p>
  </PaneShell>
</template>

<style scoped>
.hint {
  margin: 0;
  padding: 9px 12px;
  border-top: 1px solid var(--line);
  background: var(--surface-2);
  color: var(--muted);
  font-size: 12px;
}
.hint code {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text);
}
</style>
