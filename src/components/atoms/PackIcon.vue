<script setup lang="ts">
defineProps<{ src: string }>()
</script>

<template>
  <!-- draggable="false": the row is the drag handle, not the image. -->
  <img class="pack-icon" :src="src" alt="" aria-hidden="true" draggable="false" />
</template>

<style scoped>
.pack-icon {
  width: 18px;
  height: 18px;
  flex: none;
  object-fit: contain;
}
</style>
