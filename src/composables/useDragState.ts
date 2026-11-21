import { ref } from 'vue'

const draggedId = ref<string | null>(null)

/** Shared by every row, so a drop target knows which node is being dragged. */
export function useDragState() {
  return {
    draggedId,
    start(id: string) {
      draggedId.value = id
    },
    end() {
      draggedId.value = null
    },
  }
}
