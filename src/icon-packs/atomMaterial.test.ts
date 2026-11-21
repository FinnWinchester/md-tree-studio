import { describe, expect, it } from 'vitest'
import { resolveFileIcon, resolveFolderIcon } from '@/icon-packs'

const name = (url: string) => url.slice(url.lastIndexOf('/') + 1)

describe('Atom Material icon pack', () => {
  it('matches files with the plugin rules', () => {
    expect(name(resolveFileIcon('package.json'))).toBe('npm.svg')
    expect(name(resolveFileIcon('App.vue'))).toBe('vue.svg')
    expect(name(resolveFileIcon('README.md'))).toBe('readme.svg')
    expect(name(resolveFileIcon('data.json'))).toBe('json.svg')
    expect(name(resolveFileIcon('.gitignore'))).toBe('git.svg')
  })

  it('falls back to the default file icon', () => {
    expect(name(resolveFileIcon('mystery.zzzzz'))).toBe('default.svg')
  })

  it('matches folders on their lower-cased name', () => {
    expect(name(resolveFolderIcon('src'))).toBe('src.svg')
    expect(name(resolveFolderIcon('Components'))).toBe('components.svg')
    expect(name(resolveFolderIcon('node_modules'))).toBe('node.svg')
  })
})
