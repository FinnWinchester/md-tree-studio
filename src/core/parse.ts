import type { TreeNode } from '@/types/tree'

// Optional tree/list marker at the start of a line; the name starts right after it.
const PREFIX = /^([\s│|]*(?:[├└]──|[├└]─|\|--|\+--|`--|\\--|[-*+](?=\s))?[\s─]*)/
// A note follows the name after " # ", " // ", " <- ", " ← " or " — ".
const NOTE = /^(.*?)\s+(?:#|\/\/|<--?|←|—)\s+(.*)$/

export function createNode(name: string, isDir: boolean, comment = ''): TreeNode {
  return { id: '', path: '', name, isDir, comment, children: [] }
}

export function assignIds(nodes: TreeNode[], parentId = '', parentPath = ''): void {
  nodes.forEach((node, index) => {
    node.id = parentId ? `${parentId}.${index}` : String(index)
    node.path = parentPath + node.name + (node.isDir ? '/' : '')
    assignIds(node.children, node.id, node.path)
  })
}

/** Reads a bullet list, an ASCII tree or plain indentation into a tree. */
export function parse(text: string): TreeNode[] {
  const roots: TreeNode[] = []
  const stack: { col: number; node: TreeNode }[] = []

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\t/g, '  ')
    if (!line.trim() || /^\s*```/.test(line) || /^\s*#{1,6}\s/.test(line)) continue

    const col = (PREFIX.exec(line) as RegExpExecArray)[0].length
    const rest = line.slice(col).trim()
    if (!rest) continue

    const split = NOTE.exec(rest)
    let name = (split ? split[1] : rest).replace(/`/g, '').replace(/\*\*/g, '').trim()
    const comment = split ? split[2].trim() : ''
    const isDir = name.endsWith('/')
    name = name.replace(/\/+$/, '')
    if (!name) continue

    while (stack.length && stack[stack.length - 1].col >= col) stack.pop()
    const node = createNode(name, isDir, comment)
    const parent = stack.length ? stack[stack.length - 1].node : null
    if (parent) {
      parent.children.push(node)
      parent.isDir = true
    } else {
      roots.push(node)
    }
    stack.push({ col, node })
  }

  assignIds(roots)
  return roots
}
