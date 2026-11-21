export interface TreeNode {
  /** Index path in the parsed tree, e.g. "0.2.1". Stable until the Markdown changes. */
  id: string
  /** Name path used to remember collapsed folders, e.g. "src/components/". */
  path: string
  name: string
  isDir: boolean
  comment: string
  children: TreeNode[]
}

export interface Example {
  id: string
  title: string
  md: string
}

export type DropZone = 'before' | 'after' | 'into'
export type AddMode = 'add-file' | 'add-folder'
export type EditMode = AddMode | 'rename'

export interface EditingState {
  mode: EditMode
  /** Folder id for add modes (null = top level), node id for rename. */
  targetId: string | null
}

export type EditResult = { status: 'ok' | 'noop' } | { status: 'error'; message: string }

export interface TreeStats {
  folders: number
  files: number
}

export type NodeKind = 'code' | 'style' | 'markup' | 'data' | 'doc' | 'image' | 'config'
export type MarkerKind = NodeKind | 'new'

export interface FileInfo {
  kind: NodeKind
  label: string
}
