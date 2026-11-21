import type { TreeNode } from '@/types/tree'

export function label(node: TreeNode): string {
  return node.name + (node.isDir ? '/' : '') + (node.comment ? `  # ${node.comment}` : '')
}

/** ASCII tree without a trailing newline. A single root is printed as the heading line. */
export function toAscii(nodes: TreeNode[]): string {
  const lines: string[] = []
  const walk = (list: TreeNode[], prefix: string) => {
    list.forEach((node, index) => {
      const last = index === list.length - 1
      lines.push(prefix + (last ? '└── ' : '├── ') + label(node))
      if (node.children.length) walk(node.children, prefix + (last ? '    ' : '│   '))
    })
  }
  if (nodes.length === 1) {
    lines.push(label(nodes[0]))
    walk(nodes[0].children, '')
  } else {
    walk(nodes, '')
  }
  return lines.join('\n')
}

/** Writes the tree back as an ASCII tree, ending with a newline. Any input style is still parsed. */
export function serialize(nodes: TreeNode[]): string {
  return nodes.length ? `${toAscii(nodes)}\n` : ''
}
