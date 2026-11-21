<script setup lang="ts">
import type { DropZone, TreeNode } from '@/types/tree'
import FileIcon from '@/components/molecules/FileIcon.vue'
import InlineNodeEditor from '@/components/molecules/InlineNodeEditor.vue'
import RowActions from '@/components/molecules/RowActions.vue'
import TreeRow from '@/components/molecules/TreeRow.vue'
import NodeName from '@/components/atoms/NodeName.vue'
import NodeNote from '@/components/atoms/NodeNote.vue'

const props = defineProps<{ node: TreeNode; renaming: boolean; draggable: boolean }>()
const emit = defineEmits<{
  rename: []
  commitEdit: [edit: { name: string; comment: string }]
  cancelEdit: []
  duplicate: []
  remove: []
  dropped: [fromId: string, zone: DropZone]
}>()

function onDblclick() {
  if (!props.renaming) emit('rename')
}
</script>

<template>
  <TreeRow tag="div" :node-id="node.id" :is-dir="false" :draggable="draggable" @dropped="(from, zone) => $emit('dropped', from, zone)" @dblclick="onDblclick">
    <span class="gap" />
    <FileIcon :name="node.name" />
    <InlineNodeEditor
      v-if="renaming"
      :name="node.name"
      :comment="node.comment"
      @commit="$emit('commitEdit', $event)"
      @cancel="$emit('cancelEdit')"
    />
    <NodeName v-else :name="node.name" />
    <NodeNote v-if="node.comment && !renaming" :text="node.comment" />
    <RowActions v-if="!renaming" :name="node.name" :is-dir="false" @rename="$emit('rename')" @duplicate="$emit('duplicate')" @remove="$emit('remove')" />
  </TreeRow>
</template>

<style scoped>
.gap {
  width: 14px;
  flex: none;
}
</style>
