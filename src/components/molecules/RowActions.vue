<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'

defineProps<{ name: string; isDir: boolean }>()
defineEmits<{ addFile: []; addFolder: []; rename: []; duplicate: []; remove: [] }>()
</script>

<template>
  <!-- The row can be a <summary>: swallow clicks, double clicks and keys so they never toggle the folder or start an edit. -->
  <span class="acts" @click.stop.prevent @dblclick.stop @keydown.stop @keyup.stop>
    <template v-if="isDir">
      <BaseButton size="sm" variant="subtle" title="Add file in" :aria-label="`Add file in ${name}`" @click="$emit('addFile')">
        + file
      </BaseButton>
      <BaseButton size="sm" variant="subtle" title="Add folder in" :aria-label="`Add folder in ${name}`" @click="$emit('addFolder')">
        + folder
      </BaseButton>
    </template>
    <BaseButton size="sm" variant="subtle" title="Rename" :aria-label="`Rename ${name}`" @click="$emit('rename')">
      rename
    </BaseButton>
    <BaseButton size="sm" variant="subtle" title="Duplicate" :aria-label="`Duplicate ${name}`" @click="$emit('duplicate')">
      duplicate
    </BaseButton>
    <BaseButton size="sm" variant="subtle-danger" title="Delete" :aria-label="`Delete ${name}`" @click="$emit('remove')">
      delete
    </BaseButton>
  </span>
</template>

<style scoped>
.acts {
  display: inline-flex;
  gap: 4px;
  margin-left: auto;
  flex: none;
}
</style>
