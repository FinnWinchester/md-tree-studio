import { describe, expect, it } from 'vitest'
import { parse } from '@/core/parse'
import { toAscii } from '@/core/serialize'
import { addEntries, copyName, duplicateNode, countAll, moveNode, removeNode, renameNode, rootTarget, sortTree, updateNode } from '@/core/tree'

const sample = () => parse('- app/\n  - src/\n    - a.ts\n  - docs/\n  - README.md\n')
const text = (roots: ReturnType<typeof parse>) => toAscii(roots)

describe('tree operations', () => {
  it('adds nested paths and rejects duplicates', () => {
    const roots = sample()
    expect(addEntries(roots, '0', 'add-file', 'lib/utils/date.ts').status).toBe('ok')
    expect(text(roots)).toContain('└── lib/\n    └── utils/\n        └── date.ts')
    expect(addEntries(roots, '0', 'add-file', 'README.md').status).toBe('error')
    expect(addEntries(roots, '0', 'add-folder', 'empty').status).toBe('ok')
    expect(text(roots)).toContain('empty/')
  })

  it('renames and removes', () => {
    const roots = sample()
    expect(renameNode(roots, '0.0.0', 'b.ts').status).toBe('ok')
    expect(renameNode(roots, '0.2', 'docs').status).toBe('error')
    expect(removeNode(roots, '0.1').status).toBe('ok')
    expect(countAll(roots)).toEqual({ folders: 2, files: 2 })
  })

  it('updates name and comment together', () => {
    const roots = sample()
    expect(updateNode(roots, '0.2', { name: 'README.md', comment: ' read  me ' }).status).toBe('ok')
    expect(text(roots)).toContain('README.md  # read me')
    expect(updateNode(roots, '0.2', { name: 'README.md', comment: 'read me' }).status).toBe('noop')
    expect(updateNode(roots, '0.2', { name: '', comment: '' }).status).toBe('ok') // empty name keeps it, clears comment
    expect(roots[0].children[2].name).toBe('README.md')
    expect(updateNode(roots, '0.2', { name: 'docs', comment: '' }).status).toBe('error')
  })

  it('duplicates files and folders with (Copy) before the extension', () => {
    const roots = sample()
    expect(duplicateNode(roots, '0.2').status).toBe('ok') // README.md
    expect(roots[0].children.map((n) => n.name)).toEqual(['src', 'docs', 'README.md', 'README (Copy).md'])
    duplicateNode(roots, '0.2')
    expect(roots[0].children[3].name).toBe('README (Copy 2).md')
    expect(copyName('app.test.ts', false, () => false)).toBe('app (Copy).test.ts')
    expect(copyName('.env.local', false, () => false)).toBe('.env (Copy).local')
    expect(copyName('.gitignore', false, () => false)).toBe('.gitignore (Copy)')
    duplicateNode(roots, '0.0') // src/ with its content
    expect(text(roots)).toContain('├── src (Copy)/\n│   └── a.ts')
  })

  it('moves into, before and after, and refuses cycles', () => {
    const roots = sample()
    expect(moveNode(roots, '0.2', '0.1', 'into').status).toBe('ok') // README into docs
    expect(text(roots)).toContain('└── docs/\n    └── README.md')

    const second = sample()
    expect(moveNode(second, '0.2', '0.0', 'before').status).toBe('ok') // README before src
    expect(second[0].children.map((n) => n.name)).toEqual(['README.md', 'src', 'docs'])

    const third = sample()
    expect(moveNode(third, '0.0', '0.1', 'after').status).toBe('ok') // src after docs
    expect(third[0].children.map((n) => n.name)).toEqual(['docs', 'src', 'README.md'])

    const cycle = sample()
    expect(moveNode(cycle, '0', '0.0', 'into').status).toBe('noop')
    expect(moveNode(cycle, '0.0', '0.0', 'before').status).toBe('noop')
  })

  it('treats moving to the same place as a no-op', () => {
    const roots = sample()
    expect(moveNode(roots, '0.0', '0.1', 'before').status).toBe('noop')
  })

  it('sorts folders first without losing ids, and finds the root folder', () => {
    const roots = sample()
    const sorted = sortTree(roots)
    expect(sorted[0].children.map((n) => n.name)).toEqual(['src', 'docs', 'README.md'])
    expect(sorted[0].children[2].id).toBe('0.2')
    expect(rootTarget(roots)?.name).toBe('app')
    expect(rootTarget(parse('a.ts\nb.ts'))).toBeNull()
  })
})
