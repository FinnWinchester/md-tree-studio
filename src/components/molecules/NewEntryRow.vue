<script setup lang="ts">
import type { AddMode } from '@/types/tree'
import FileIcon from '@/components/molecules/FileIcon.vue'
import FolderIcon from '@/components/molecules/FolderIcon.vue'
import InlineNameInput from '@/components/molecules/InlineNameInput.vue'

const props = defineProps<{ mode: AddMode }>()
defineEmits<{ commit: [value: string]; cancel: [] }>()

const isFile = () => props.mode === 'add-file'
</script>

<template>
  <li>
    <div class="row">
      <span class="gap" />
      <FileIcon v-if="isFile()" name="" />
      <FolderIcon v-else name="" />
      <InlineNameInput
        :placeholder="isFile() ? 'name.ext (a/b.ext adds folders)' : 'folder name'"
        @commit="$emit('commit', $event)"
        @cancel="$emit('cancel')"
      />
    </div>
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 6px;
  min-height: 28px;
}
.gap {
  width: 14px;
  flex: none;
}
</style>
