<template>
  <div class="app">
    <slot name="header" />
    <main class="panes">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.panes {
  flex: 1;
  min-height: 0;
  display: grid;
  gap: 14px;
  padding: 14px 16px 20px;
  grid-template-columns: 1fr;
}
@media (min-width: 900px) {
  .panes {
    grid-template-columns: 210px minmax(280px, 1fr) minmax(320px, 1.15fr);
  }
}
</style>
