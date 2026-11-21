import { describe, expect, it } from 'vitest'
import { parse } from '@/core/parse'
import { SEED_EXAMPLES } from '@/core/seed'
import { serialize, toAscii } from '@/core/serialize'

describe('serialize', () => {
  it('round-trips every seed example', () => {
    for (const example of SEED_EXAMPLES) {
      const out = serialize(parse(example.md))
      expect(parse(out)).toEqual(parse(example.md))
    }
  })

  it('always writes an ASCII tree, whatever style was parsed', () => {
    const tree = parse('- app/\n  - a.ts\n  - b.ts\n')
    expect(toAscii(tree)).toBe('app/\n├── a.ts\n└── b.ts')
    expect(serialize(tree)).toBe('app/\n├── a.ts\n└── b.ts\n')
    expect(parse(serialize(tree))).toEqual(tree)
    expect(serialize([])).toBe('')
  })
})
