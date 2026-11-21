<script setup lang="ts">
defineProps<{ title: string; folders: number; files: number; active: boolean }>()
defineEmits<{ select: [] }>()
</script>

<template>
  <button type="button" class="item" :aria-current="active || undefined" @click="$emit('select')">
    <span class="title">{{ title || 'Untitled' }}</span>
    <span class="meta">{{ folders }} folders · {{ files }} files</span>
  </button>
</template>

<style scoped>
.item {
  text-align: left;
  border: 0;
  background: transparent;
  border-radius: 7px;
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.item:hover {
  background: var(--surface-2);
}
.item[aria-current='true'],
.item[aria-current] {
  background: var(--accent-soft);
}
.title {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  font-size: 12px;
  color: var(--muted);
}
</style>
