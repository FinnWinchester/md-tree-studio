<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <textarea v-model="model" class="textarea" spellcheck="false" />
</template>

<style scoped>
.textarea {
  flex: 1;
  min-height: 260px;
  width: 100%;
  resize: none;
  border: 0;
  padding: 14px;
  background: var(--surface);
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.65;
  tab-size: 2;
  white-space: pre;
  overflow: auto;
}
.textarea:focus-visible {
  outline-offset: -2px;
}
</style>
