<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDragState } from '@/composables/useDragState'
import { useStudio } from '@/composables/useStudio'
import { useTreeEditor } from '@/composables/useTreeEditor'
import EmptyState from '@/components/atoms/EmptyState.vue'
import NewEntryRow from '@/components/molecules/NewEntryRow.vue'
import TreeNode from '@/components/organisms/TreeNode.vue'

const studio = useStudio()
const editor = useTreeEditor()
const drag = useDragState()
const overBackground = ref(false)

const rootAdd = computed(() => {
  const current = editor.editing.value
  return current && current.mode !== 'rename' && current.targetId === null ? current.mode : null
})

// Only the empty area (and the top-level list) counts as "drop at the top level".
function isBackground(event: DragEvent) {
  const target = event.target as HTMLElement
  return target === event.currentTarget || target.classList.contains('tree')
}
function onDragOver(event: DragEvent) {
  if (drag.draggedId.value === null || !isBackground(event)) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  overBackground.value = true
}
function onDragLeave(event: DragEvent) {
  const box = event.currentTarget as HTMLElement
  if (!box.contains(event.relatedTarget as Node | null)) overBackground.value = false
}
function onDrop(event: DragEvent) {
  if (drag.draggedId.value === null || !isBackground(event)) return
  event.preventDefault()
  overBackground.value = false
  const from = drag.draggedId.value
  drag.end()
  editor.moveToTopLevel(from)
}
</script>

<template>
  <div class="explorer" :class="{ 'drop-root': overBackground }" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <ul v-if="studio.viewRoots.value.length || rootAdd" class="tree">
      <TreeNode v-for="node in studio.viewRoots.value" :key="node.id" :node="node" />
      <NewEntryRow v-if="rootAdd" :mode="rootAdd" @commit="editor.commitAdd($event)" @cancel="editor.cancelEdit()" />
    </ul>
    <EmptyState v-else>Nothing to show yet. Type in the editor or use New file and New folder.</EmptyState>
  </div>
</template>

<style scoped>
.explorer {
  flex: 1;
  overflow: auto;
  padding: 12px 14px 18px;
  min-height: 260px;
}
.drop-root {
  outline: 2px dashed var(--accent);
  outline-offset: -6px;
}
.tree {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
