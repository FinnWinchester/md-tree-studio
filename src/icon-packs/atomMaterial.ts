import { FILE_RULES, FOLDER_RULES } from '@/icon-packs/atom-material/rules'

const fileUrls = import.meta.glob<string>('./atom-material/files/*.svg', { eager: true, query: '?url', import: 'default' })
const folderUrls = import.meta.glob<string>('./atom-material/folders/*.svg', { eager: true, query: '?url', import: 'default' })

function indexByName(modules: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>()
  for (const [path, url] of Object.entries(modules)) {
    map.set(path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), url)
  }
  return map
}

const files = indexByName(fileUrls)
const folders = indexByName(folderUrls)
const fileMatchers = FILE_RULES.map((rule) => ({ test: new RegExp(rule.pattern), icon: rule.icon }))
const folderMatchers = FOLDER_RULES.map((rule) => ({ test: new RegExp(rule.pattern), icon: rule.icon }))

/** Some icons ship a "_dark" twin that stays readable on dark backgrounds. */
function pick(map: Map<string, string>, icon: string, dark: boolean): string {
  return (dark ? map.get(`${icon}_dark`) : undefined) ?? map.get(icon) ?? map.get('default') ?? ''
}

/** Same rules as the plugin: the first matching pattern wins, otherwise the default file icon. */
export function resolveFileIcon(name: string, dark = false): string {
  const match = fileMatchers.find((rule) => rule.test.test(name))
  return pick(files, match?.icon ?? 'default', dark)
}

/** Folders are matched on their lower-cased name. Plain folders use the open icon when expanded. */
export function resolveFolderIcon(name: string, dark = false): string {
  const match = folderMatchers.find((rule) => rule.test.test(name.toLowerCase()))
  return pick(folders, match?.icon ?? 'regular', dark)
}
