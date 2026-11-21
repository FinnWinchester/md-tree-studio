<script setup lang="ts">
import type { DropZone, TreeNode } from '@/types/tree'
import IconChevron from '@/components/atoms/IconChevron.vue'
import NodeCount from '@/components/atoms/NodeCount.vue'
import NodeName from '@/components/atoms/NodeName.vue'
import NodeNote from '@/components/atoms/NodeNote.vue'
import FolderIcon from '@/components/molecules/FolderIcon.vue'
import InlineNodeEditor from '@/components/molecules/InlineNodeEditor.vue'
import RowActions from '@/components/molecules/RowActions.vue'
import TreeRow from '@/components/molecules/TreeRow.vue'

defineProps<{ node: TreeNode; open: boolean; renaming: boolean; draggable: boolean }>()
defineEmits<{
  addFile: []
  addFolder: []
  rename: []
  commitEdit: [edit: { name: string; comment: string }]
  cancelEdit: []
  duplicate: []
  remove: []
  dropped: [fromId: string, zone: DropZone]
}>()
</script>

<template>
  <TreeRow tag="summary" :node-id="node.id" :is-dir="true" :draggable="draggable" @dropped="(from, zone) => $emit('dropped', from, zone)">
    <IconChevron :open="open" />
    <FolderIcon :name="node.name" />
    <InlineNodeEditor
      v-if="renaming"
      :name="node.name"
      :comment="node.comment"
      @commit="$emit('commitEdit', $event)"
      @cancel="$emit('cancelEdit')"
    />
    <NodeName v-else :name="node.name" folder />
    <NodeCount v-if="node.children.length" :count="node.children.length" />
    <NodeNote v-if="node.comment && !renaming" :text="node.comment" />
    <RowActions
      v-if="!renaming"
      :name="node.name"
      is-dir
      @add-file="$emit('addFile')"
      @add-folder="$emit('addFolder')"
      @rename="$emit('rename')"
      @duplicate="$emit('duplicate')"
      @remove="$emit('remove')"
    />
  </TreeRow>
</template>
