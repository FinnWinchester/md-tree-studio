import type { FileInfo, NodeKind } from '@/types/tree'

const GROUPS: Record<Exclude<NodeKind, 'config'>, string> = {
  code: 'js jsx mjs cjs ts tsx vue svelte astro py go rs java rb php c cpp h cs swift kt sh bash zsh',
  style: 'css scss sass less styl',
  markup: 'html htm xml',
  data: 'json yaml yml toml csv sql lock',
  doc: 'md mdx txt rst',
  image: 'png jpg jpeg gif svg webp ico avif',
}

const KIND_BY_EXT = new Map<string, NodeKind>()
for (const [kind, exts] of Object.entries(GROUPS)) {
  for (const ext of exts.split(' ')) KIND_BY_EXT.set(ext, kind as NodeKind)
}

export function fileInfo(name: string): FileInfo {
  const lower = name.toLowerCase()
  const dot = lower.lastIndexOf('.')
  const ext = dot > 0 ? lower.slice(dot + 1) : ''
  const dotfile = lower.startsWith('.')
  const kind: NodeKind =
    dotfile || /\.config\.|^(dockerfile|makefile|license)$/.test(lower)
      ? 'config'
      : (KIND_BY_EXT.get(ext) ?? 'config')
  const label = ext ? ext.slice(0, 4) : dotfile ? 'rc' : '··'
  return { kind, label }
}
