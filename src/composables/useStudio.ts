import { computed, ref, watch } from 'vue'
import type { Example } from '@/types/tree'
import { parse } from '@/core/parse'
import { countAll, sortTree } from '@/core/tree'
import { NEW_EXAMPLE_MD, SEED_EXAMPLES } from '@/core/seed'
import { loadState, saveState, type PersistedState } from '@/core/storage'

function uid(): string {
  return `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function seedState(): PersistedState {
  const items = SEED_EXAMPLES.map((example) => ({ id: uid(), ...example }))
  return { items, activeId: items[0].id, sort: false }
}

function createStudio() {
  const initial = loadState() ?? seedState()
  const items = ref<Example[]>(initial.items)
  const activeId = ref(initial.activeId)
  const sort = ref(initial.sort)

  const active = computed(() => items.value.find((item) => item.id === activeId.value) ?? items.value[0])
  const roots = computed(() => parse(active.value.md))
  const viewRoots = computed(() => (sort.value ? sortTree(roots.value) : roots.value))
  const stats = computed(() => countAll(viewRoots.value))

  watch(
    [items, activeId, sort],
    () =>
      saveState({
        items: items.value,
        activeId: activeId.value,
        sort: sort.value,
      }),
    { deep: true },
  )

  function select(id: string) {
    activeId.value = id
  }
  function setMarkdown(md: string) {
    active.value.md = md
  }
  function setTitle(title: string) {
    active.value.title = title
  }
  function create() {
    const example: Example = { id: uid(), title: 'Untitled example', md: NEW_EXAMPLE_MD }
    items.value.push(example)
    activeId.value = example.id
  }
  function duplicate() {
    const source = active.value
    const copy: Example = { id: uid(), title: `${source.title || 'Untitled'} copy`, md: source.md }
    const index = items.value.findIndex((item) => item.id === source.id)
    items.value.splice(index + 1, 0, copy)
    activeId.value = copy.id
  }
  function remove() {
    const removedId = active.value.id
    items.value = items.value.filter((item) => item.id !== removedId)
    if (!items.value.length) items.value.push({ id: uid(), title: 'Untitled example', md: 'project/\n  - README.md\n' })
    activeId.value = items.value[0].id
  }

  return { items, activeId, sort, active, roots, viewRoots, stats, select, setMarkdown, setTitle, create, duplicate, remove }
}

let instance: ReturnType<typeof createStudio> | undefined

export function useStudio() {
  return (instance ??= createStudio())
}

export function resetStudio() {
  instance = undefined
}
