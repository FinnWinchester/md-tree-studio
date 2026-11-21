import { computed, reactive, ref, watch } from 'vue'
import type { AddMode, DropZone, EditingState, EditResult, TreeNode } from '@/types/tree'
import { parse } from '@/core/parse'
import { serialize, toAscii } from '@/core/serialize'
import { addEntries, collectFolderPaths, duplicateNode, moveNode, removeNode, renameNode, rootTarget, sortTree, updateNode } from '@/core/tree'
import { useHistory } from '@/composables/useHistory'
import { useStatus } from '@/composables/useStatus'
import { useStudio } from '@/composables/useStudio'

interface MutateOptions {
  useView?: boolean
}

/**
 * Every explorer edit parses the Markdown fresh, applies one operation to that tree
 * and writes the result back, so the Markdown stays the single source of truth.
 */
function createTreeEditor() {
  const studio = useStudio()
  const status = useStatus()
  const history = useHistory()

  const editing = ref<EditingState | null>(null)
  const collapsed = reactive(new Set<string>())

  const canUndo = computed(() => history.canUndo(studio.active.value.id))
  const rootFolder = computed(() => rootTarget(studio.roots.value))

  watch(
    () => studio.active.value.id,
    () => {
      editing.value = null
      collapsed.clear()
    },
  )

  function mutate(operation: (roots: TreeNode[]) => EditResult, options: MutateOptions = {}): boolean {
    const item = studio.active.value
    const before = item.md
    const roots = parse(before)
    const result = operation(roots)
    if (result.status === 'error') {
      status.show(result.message)
      return false
    }
    if (result.status === 'noop') return false
    const nodes = options.useView && studio.sort.value ? sortTree(roots) : roots
    const out = serialize(nodes)
    if (out === before) return false
    history.push(item.id, before)
    studio.setMarkdown(out)
    return true
  }

  // Folder open state
  const isCollapsed = (path: string) => collapsed.has(path)
  function setOpen(path: string, open: boolean) {
    if (open) collapsed.delete(path)
    else collapsed.add(path)
  }
  function expandAll() {
    collapsed.clear()
  }
  function collapseAll() {
    collapsed.clear()
    collectFolderPaths(studio.viewRoots.value).forEach((path) => collapsed.add(path))
  }

  // Inline editing
  function startAdd(mode: AddMode, folder: TreeNode | null) {
    if (folder) collapsed.delete(folder.path)
    editing.value = { mode, targetId: folder?.id ?? null }
  }
  function startAddAtRoot(mode: AddMode) {
    startAdd(mode, rootFolder.value)
  }
  function startRename(node: TreeNode) {
    editing.value = { mode: 'rename', targetId: node.id }
  }
  function cancelEdit() {
    editing.value = null
  }
  function commitAdd(value: string) {
    const current = editing.value
    editing.value = null
    if (!current || current.mode === 'rename' || !value.trim()) return
    mutate((roots) => addEntries(roots, current.targetId, current.mode as AddMode, value))
  }
  function commitRename(node: TreeNode, value: string) {
    editing.value = null
    if (!value.trim()) return
    mutate((roots) => renameNode(roots, node.id, value))
  }

  function commitEdit(node: TreeNode, edit: { name: string; comment: string }) {
    editing.value = null
    mutate((roots) => updateNode(roots, node.id, edit))
  }

  // Structure changes
  function deleteNode(node: TreeNode) {
    if (mutate((roots) => removeNode(roots, node.id))) status.show(`Deleted ${node.name}`)
  }
  function duplicate(node: TreeNode) {
    if (mutate((roots) => duplicateNode(roots, node.id))) status.show(`Duplicated ${node.name}`)
  }
  function move(fromId: string, target: TreeNode | null, zone: DropZone) {
    if (target && zone === 'into') collapsed.delete(target.path)
    mutate((roots) => moveNode(roots, fromId, target?.id ?? null, zone))
  }
  function moveToTopLevel(fromId: string) {
    move(fromId, rootFolder.value, 'into')
  }

  // History and regeneration
  function undo() {
    const previous = history.pop(studio.active.value.id)
    if (previous === undefined) return
    editing.value = null
    studio.setMarkdown(previous)
    status.show('Undone')
  }
  function regenerateMarkdown() {
    editing.value = null
  }
  function regeneratePreview() {
    editing.value = null
    collapsed.clear()
  }

  // Clipboard exports follow what the explorer shows
  const asciiText = () => toAscii(studio.viewRoots.value)

  return {
    editing,
    canUndo,
    rootFolder,
    isCollapsed,
    setOpen,
    expandAll,
    collapseAll,
    startAdd,
    startAddAtRoot,
    startRename,
    cancelEdit,
    commitAdd,
    commitRename,
    commitEdit,
    duplicate,
    deleteNode,
    move,
    moveToTopLevel,
    undo,
    regenerateMarkdown,
    regeneratePreview,
    asciiText,
  }
}

let instance: ReturnType<typeof createTreeEditor> | undefined

export function useTreeEditor() {
  return (instance ??= createTreeEditor())
}

export function resetTreeEditor() {
  instance = undefined
}
