<template>
  <div class="toolbar">
    <slot />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 12px;
  border-bottom: 1px solid var(--line);
}
</style>
