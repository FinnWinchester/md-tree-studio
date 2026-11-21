<script setup lang="ts">
import { useStudio } from '@/composables/useStudio'
import { useTreeEditor } from '@/composables/useTreeEditor'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue'
import PaneToolbar from '@/components/atoms/PaneToolbar.vue'
import Spacer from '@/components/atoms/Spacer.vue'

const studio = useStudio()
const editor = useTreeEditor()
</script>

<template>
  <PaneToolbar>
    <BaseButton @click="editor.expandAll()">Expand all</BaseButton>
    <BaseButton @click="editor.collapseAll()">Collapse all</BaseButton>
    <BaseCheckbox v-model="studio.sort.value">Folders first</BaseCheckbox>
    <BaseButton @click="editor.startAddAtRoot('add-file')">New file</BaseButton>
    <BaseButton @click="editor.startAddAtRoot('add-folder')">New folder</BaseButton>
    <BaseButton :disabled="!editor.canUndo.value" @click="editor.undo()">Undo</BaseButton>
    <Spacer />
    <BaseButton @click="editor.regeneratePreview()">Regenerate preview from Markdown</BaseButton>
  </PaneToolbar>
</template>
