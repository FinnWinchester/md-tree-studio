import { describe, expect, it } from 'vitest'
import { parse } from '@/core/parse'

describe('parse', () => {
  it('reads an ASCII tree', () => {
    const roots = parse('app/\n├── src/\n│   └── main.ts\n└── README.md\n')
    expect(roots).toHaveLength(1)
    expect(roots[0].children.map((n) => n.name)).toEqual(['src', 'README.md'])
    expect(roots[0].children[0].children[0].name).toBe('main.ts')
  })

  it('reads bullet lists with either marker', () => {
    for (const marker of ['-', '*']) {
      const roots = parse(`${marker} a/\n  ${marker} b.ts\n`)
      expect(roots[0].isDir).toBe(true)
      expect(roots[0].children[0].name).toBe('b.ts')
    }
  })

  it('reads plain indentation, notes and empty folders', () => {
    const roots = parse('root/\n  docs/\n  index.md  # entry point\n')
    expect(roots[0].children[0]).toMatchObject({ name: 'docs', isDir: true, children: [] })
    expect(roots[0].children[1]).toMatchObject({ name: 'index.md', comment: 'entry point', isDir: false })
  })

  it('ignores headings and fences, and assigns ids and paths', () => {
    const roots = parse('# Title\n```\na/\n  b.ts\n```\n')
    expect(roots[0].children[0]).toMatchObject({ id: '0.0', path: 'a/b.ts' })
    expect(roots[0].path).toBe('a/')
  })
})
