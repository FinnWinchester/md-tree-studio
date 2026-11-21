<script setup lang="ts">
import { computed } from 'vue'
import type { AddMode, TreeNode } from '@/types/tree'
import { useTreeEditor } from '@/composables/useTreeEditor'
import NewEntryRow from '@/components/molecules/NewEntryRow.vue'
import TreeFileRow from '@/components/molecules/TreeFileRow.vue'
import TreeFolderRow from '@/components/molecules/TreeFolderRow.vue'

const props = defineProps<{ node: TreeNode }>()
const editor = useTreeEditor()

const renaming = computed(() => editor.editing.value?.mode === 'rename' && editor.editing.value.targetId === props.node.id)
const addMode = computed<AddMode | null>(() => {
  const current = editor.editing.value
  return current && current.mode !== 'rename' && current.targetId === props.node.id ? current.mode : null
})
const open = computed(() => addMode.value !== null || !editor.isCollapsed(props.node.path))
const draggable = computed(() => editor.editing.value === null)

function onToggle(event: Event) {
  editor.setOpen(props.node.path, (event.currentTarget as HTMLDetailsElement).open)
}
</script>

<template>
  <li v-if="node.isDir">
    <details :open="open" @toggle="onToggle">
      <TreeFolderRow
        :node="node"
        :open="open"
        :renaming="renaming"
        :draggable="draggable"
        @add-file="editor.startAdd('add-file', node)"
        @add-folder="editor.startAdd('add-folder', node)"
        @rename="editor.startRename(node)"
        @commit-edit="editor.commitEdit(node, $event)"
        @cancel-edit="editor.cancelEdit()"
        @duplicate="editor.duplicate(node)"
        @remove="editor.deleteNode(node)"
        @dropped="(from, zone) => editor.move(from, node, zone)"
      />
      <ul v-if="node.children.length || addMode" class="children">
        <TreeNode v-for="child in node.children" :key="child.id" :node="child" />
        <NewEntryRow v-if="addMode" :mode="addMode" @commit="editor.commitAdd($event)" @cancel="editor.cancelEdit()" />
      </ul>
    </details>
  </li>
  <li v-else>
    <TreeFileRow
      :node="node"
      :renaming="renaming"
      :draggable="draggable"
      @rename="editor.startRename(node)"
      @commit-edit="editor.commitEdit(node, $event)"
      @cancel-edit="editor.cancelEdit()"
      @duplicate="editor.duplicate(node)"
        @remove="editor.deleteNode(node)"
      @dropped="(from, zone) => editor.move(from, node, zone)"
    />
  </li>
</template>

<style scoped>
.children {
  list-style: none;
  margin: 0 0 0 15px;
  padding: 0 0 0 9px;
  border-left: 1px solid var(--line);
}
</style>
