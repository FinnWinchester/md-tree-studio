<script setup lang="ts">
import { ref } from 'vue'
import type { DropZone } from '@/types/tree'
import { useDragState } from '@/composables/useDragState'
import { isSameOrInside } from '@/core/tree'

const props = defineProps<{ tag: 'summary' | 'div'; nodeId: string; isDir: boolean; draggable?: boolean }>()
const emit = defineEmits<{ dropped: [fromId: string, zone: DropZone] }>()

const drag = useDragState()
const el = ref<HTMLElement>()
const zone = ref<DropZone | null>(null)
const dragging = ref(false)

const canDrop = () => drag.draggedId.value !== null && !isSameOrInside(props.nodeId, drag.draggedId.value)

function zoneAt(event: DragEvent): DropZone {
  const rect = el.value!.getBoundingClientRect()
  const y = rect.height ? (event.clientY - rect.top) / rect.height : 0.5
  if (props.isDir) return y < 0.28 ? 'before' : y > 0.72 ? 'after' : 'into'
  return y < 0.5 ? 'before' : 'after'
}

function onDragStart(event: DragEvent) {
  if (event.target !== el.value) return
  drag.start(props.nodeId)
  dragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', props.nodeId)
  }
}
function onDragEnd() {
  drag.end()
  dragging.value = false
  zone.value = null
}
function onDragOver(event: DragEvent) {
  if (!canDrop()) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  zone.value = zoneAt(event)
}
function onDragLeave(event: DragEvent) {
  if (!el.value?.contains(event.relatedTarget as Node | null)) zone.value = null
}
function onDrop(event: DragEvent) {
  if (!canDrop()) return
  event.preventDefault()
  event.stopPropagation()
  const target = zoneAt(event)
  const from = drag.draggedId.value as string
  zone.value = null
  drag.end()
  emit('dropped', from, target)
}
</script>

<template>
  <component
    :is="tag"
    ref="el"
    class="row"
    :class="{
      dragging,
      'drop-into': zone === 'into',
      'drop-before': zone === 'before',
      'drop-after': zone === 'after',
    }"
    :draggable="draggable"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <slot />
  </component>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 6px;
  border-radius: 6px;
  min-height: 28px;
}
summary.row {
  list-style: none;
  cursor: pointer;
}
summary.row::-webkit-details-marker {
  display: none;
}
.row:hover {
  background: var(--surface-2);
}
.dragging {
  opacity: 0.4;
}
.drop-into {
  background: var(--accent-soft);
  outline: 1.5px dashed var(--accent);
  outline-offset: -1px;
}
.drop-before {
  box-shadow: 0 -2px 0 var(--accent);
}
.drop-after {
  box-shadow: 0 2px 0 var(--accent);
}

/* Row actions appear on hover or keyboard focus (not after a mouse click, which would pin them), and stay visible on touch screens. */
.row :slotted(.acts) {
  opacity: 0;
  transition: opacity 0.1s;
}
.row:hover :slotted(.acts),
.row:has(:focus-visible) :slotted(.acts) {
  opacity: 1;
}
@media (hover: none) {
  .row :slotted(.acts) {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .row :slotted(.acts) {
    transition: none;
  }
}
</style>
