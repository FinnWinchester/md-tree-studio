# MD Tree Studio

Write a folder structure in Markdown and see it as a file explorer. Edit either side and the other follows.

- **Markdown to explorer:** bullet lists (`-` / `*`), ASCII trees (`├──`) or plain indentation. End a name with `/` for an empty folder and add a note after ` # `.
- **Explorer to Markdown:** hover a row to add a file or folder, rename or delete. Drag rows to move them. Changes are written back in the style you were using.
- **Regenerate:** rebuild the Markdown from the preview (keep style, bullet list or ASCII tree), or rebuild the preview from the Markdown.
- **Examples:** keep several structures, duplicate and delete them. They are stored in `localStorage`.
- **Icons:** files and folders use the Atom Material icon set (JetBrains plugin, MIT) with `_dark` variants in the dark theme. The theme button lives in the app header.
- **Export:** copy the tree as an ASCII tree or as a Markdown list. Undo covers explorer edits.

## Scripts

```bash
npm install
npm run dev         # start Vite
npm run build       # type-check and build to docs/
                    # INLINE_ASSETS=1 npm run build  -> single bundle, icons inlined
npm run type-check  # vue-tsc
npm test            # vitest (jsdom)
```

Requires Node `^20.19.0 || >=22.12.0`.

## Structure

```
src/
├── types/tree.ts            # shared types
├── core/                    # pure TypeScript: parse, serialize, tree operations, seed data
├── icon-packs/              # Atom Material icon resolver and the vendored icon subset (MIT)
├── composables/             # useStudio (examples), useTreeEditor (edits), useHistory, useDragState, ...
├── components/
│   ├── atoms/               # BaseButton, BaseInput, PackIcon, PaneShell, ...
│   ├── molecules/           # TreeRow, TreeFolderRow, TreeFileRow, RowActions, InlineNameInput, ...
│   ├── organisms/           # TreeNode, TreeExplorer, EditorPane, PreviewPane, ExamplesPane, ...
│   └── templates/           # StudioLayout
├── App.vue
└── main.ts
```

The Markdown text is the single source of truth. Each explorer edit parses it fresh, applies one operation
(`addEntries`, `renameNode`, `removeNode`, `moveNode`) and serializes the result back.

## Icons

`src/icon-packs/atom-material/` holds a curated subset of **Atom Material Icons** by Mallowigi (MIT, see its `LICENSE`
and `README.md`): 148 file icons, 84 folder icons, the plugin's own name rules and `_dark` variants for the dark theme.

To add more icons, copy the SVGs (and `_dark` variants) from the `atom-material-icons@3.0.0` npm package into `files/` or `folders/` and add a matching rule.

Which icon a name gets is decided by `FILE_RULES` and `FOLDER_RULES` in `src/icon-packs/atom-material/rules.ts` (first match wins); unmatched folders use `folders/regular.svg`.
