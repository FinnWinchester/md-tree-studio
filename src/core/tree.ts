import type { AddMode, DropZone, EditResult, TreeNode, TreeStats } from '@/types/tree'
import { createNode } from '@/core/parse'

const OK: EditResult = { status: 'ok' }
const NOOP: EditResult = { status: 'noop' }
const fail = (message: string): EditResult => ({ status: 'error', message })
const exists = (name: string) => fail(`“${name}” already exists here`)

export interface Located {
  node: TreeNode
  parent: TreeNode | null
  list: TreeNode[]
  index: number
}

export function countAll(nodes: TreeNode[], acc: TreeStats = { folders: 0, files: 0 }): TreeStats {
  for (const node of nodes) {
    if (node.isDir) acc.folders++
    else acc.files++
    countAll(node.children, acc)
  }
  return acc
}

/** Folders first, keeping the original order inside each group. Clones keep their ids. */
export function sortTree(nodes: TreeNode[]): TreeNode[] {
  const dirs: TreeNode[] = []
  const files: TreeNode[] = []
  for (const node of nodes) {
    const copy = { ...node, children: sortTree(node.children) }
    ;(copy.isDir ? dirs : files).push(copy)
  }
  return [...dirs, ...files]
}

export function collectFolderPaths(nodes: TreeNode[], out: string[] = []): string[] {
  for (const node of nodes) {
    if (node.isDir) {
      out.push(node.path)
      collectFolderPaths(node.children, out)
    }
  }
  return out
}

/** The folder that "top level" actions target: a lone root folder, otherwise none. */
export function rootTarget(roots: TreeNode[]): TreeNode | null {
  return roots.length === 1 && roots[0].isDir ? roots[0] : null
}

export function findNode(roots: TreeNode[], id: string): Located | null {
  let list = roots
  let parent: TreeNode | null = null
  const indexes = id.split('.').map(Number)
  for (let i = 0; i < indexes.length; i++) {
    const node = list[indexes[i]]
    if (!node) return null
    if (i === indexes.length - 1) return { node, parent, list, index: indexes[i] }
    parent = node
    list = node.children
  }
  return null
}

export function isSameOrInside(id: string, ancestorId: string): boolean {
  return id === ancestorId || id.startsWith(`${ancestorId}.`)
}

/**
 * Adds a file or folder. "a/b.ts" creates the missing folders; a trailing "/" makes a folder.
 * Operations mutate the tree they are given, so callers pass a fresh parse.
 */
export function addEntries(roots: TreeNode[], targetId: string | null, mode: AddMode, raw: string): EditResult {
  const value = raw.trim()
  const parts = value
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
  if (!parts.length) return NOOP

  let parent: TreeNode | null = null
  let list = roots
  if (targetId !== null) {
    const target = findNode(roots, targetId)
    if (!target) return fail('That folder no longer exists')
    parent = target.node
    list = parent.children
  }

  for (let i = 0; i < parts.length; i++) {
    const name = parts[i]
    const last = i === parts.length - 1
    const existing = list.find((node) => node.name === name)
    if (existing) {
      if (last) return exists(name)
      if (!existing.isDir) return fail(`“${name}” is a file`)
      parent = existing
      list = existing.children
      continue
    }
    const node = createNode(name, !last || value.endsWith('/') || mode === 'add-folder')
    list.push(node)
    if (parent) parent.isDir = true
    parent = node
    list = node.children
  }
  return OK
}

export function renameNode(roots: TreeNode[], id: string, raw: string): EditResult {
  const found = findNode(roots, id)
  if (!found) return fail('That item no longer exists')
  const name = raw.trim()
  if (!name) return NOOP
  if (name.includes('/')) return fail('Names can’t contain /')
  if (name === found.node.name) return NOOP
  if (found.list.some((node) => node !== found.node && node.name === name)) return exists(name)
  found.node.name = name
  return OK
}

/** Renames a node and sets its comment in one step. An empty name keeps the current one; an empty comment clears it. */
export function updateNode(roots: TreeNode[], id: string, edit: { name: string; comment: string }): EditResult {
  const found = findNode(roots, id)
  if (!found) return fail('That item no longer exists')
  const name = edit.name.trim() || found.node.name
  const comment = edit.comment.replace(/\s+/g, ' ').trim()
  if (name.includes('/')) return fail('Names can’t contain /')
  if (name !== found.node.name && found.list.some((node) => node !== found.node && node.name === name)) return exists(name)
  if (name === found.node.name && comment === found.node.comment) return NOOP
  found.node.name = name
  found.node.comment = comment
  return OK
}

/** Goes before the leftmost dot: "a.test.ts" → "a (Copy).test.ts", "src" → "src (Copy)", ".env" → ".env (Copy)"; numbered when taken. */
export function copyName(name: string, isDir: boolean, taken: (candidate: string) => boolean): string {
  const dot = isDir ? -1 : name.indexOf('.', 1)
  const base = dot > 0 ? name.slice(0, dot) : name
  const ext = dot > 0 ? name.slice(dot) : ''
  let candidate = `${base} (Copy)${ext}`
  for (let n = 2; taken(candidate); n++) candidate = `${base} (Copy ${n})${ext}`
  return candidate
}

function cloneNode(node: TreeNode): TreeNode {
  return { ...node, children: node.children.map(cloneNode) }
}

/** Duplicates a file or a whole folder right after the original. */
export function duplicateNode(roots: TreeNode[], id: string): EditResult {
  const found = findNode(roots, id)
  if (!found) return fail('That item no longer exists')
  const copy = cloneNode(found.node)
  copy.name = copyName(found.node.name, found.node.isDir, (name) => found.list.some((node) => node.name === name))
  found.list.splice(found.index + 1, 0, copy)
  return OK
}

export function removeNode(roots: TreeNode[], id: string): EditResult {
  const found = findNode(roots, id)
  if (!found) return fail('That item no longer exists')
  found.list.splice(found.index, 1)
  return OK
}

/**
 * Moves a node. targetId null means the top level. "into" appends to a folder,
 * "before" and "after" place the node next to the target.
 */
export function moveNode(roots: TreeNode[], id: string, targetId: string | null, zone: DropZone): EditResult {
  const source = findNode(roots, id)
  if (!source) return fail('That item no longer exists')

  let parent: TreeNode | null = null
  let list = roots
  let index = roots.length

  if (targetId !== null) {
    if (isSameOrInside(targetId, id)) return NOOP
    const target = findNode(roots, targetId)
    if (!target) return fail('That target no longer exists')
    if (zone === 'into') {
      parent = target.node
      list = target.node.children
      index = list.length
    } else {
      parent = target.parent
      list = target.list
      index = target.index + (zone === 'after' ? 1 : 0)
    }
  }

  if (list.some((node) => node !== source.node && node.name === source.node.name)) {
    return fail(`“${source.node.name}” already exists in that folder`)
  }
  if (source.list === list && source.index < index) index--
  if (source.list === list && source.index === index) return NOOP

  source.list.splice(source.index, 1)
  list.splice(index, 0, source.node)
  if (parent) parent.isDir = true
  return OK
}
