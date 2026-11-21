import type { Example } from '@/types/tree'

const KEY = 'tree-studio.v1'

export interface PersistedState {
  items: Example[]
  activeId: string
  sort: boolean
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<PersistedState>
    const valid =
      Array.isArray(data.items) &&
      data.items.length > 0 &&
      data.items.every((item) => typeof item?.id === 'string' && typeof item.md === 'string')
    if (!valid) return null
    return {
      items: data.items as Example[],
      activeId: typeof data.activeId === 'string' ? data.activeId : (data.items as Example[])[0].id,
      sort: !!data.sort,
    }
  } catch {
    return null
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage can be missing or full; the app keeps working in memory.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
