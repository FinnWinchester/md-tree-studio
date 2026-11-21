<template>
  <header class="head">
    <slot />
  </header>
</template>

<style scoped>
.head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  box-sizing: border-box;
  min-height: 54px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
  background: var(--surface-2);
}
</style>
