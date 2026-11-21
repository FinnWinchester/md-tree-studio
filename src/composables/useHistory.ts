import { reactive } from 'vue'

const LIMIT = 50
const stacks = reactive<Record<string, string[]>>({})

/** Undo stacks of Markdown snapshots, one per example. */
export function useHistory() {
  return {
    push(id: string, md: string) {
      const stack = stacks[id] ?? (stacks[id] = [])
      stack.push(md)
      if (stack.length > LIMIT) stack.shift()
    },
    pop(id: string): string | undefined {
      return stacks[id]?.pop()
    },
    canUndo(id: string): boolean {
      return (stacks[id]?.length ?? 0) > 0
    },
  }
}

export function resetHistory() {
  for (const key of Object.keys(stacks)) delete stacks[key]
}
