# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev         # Vite dev server
npm run build       # vue-tsc --noEmit && vite build (INLINE_ASSETS=1 inlines icons into the bundle)
npm run type-check  # vue-tsc only
npm test            # vitest run (jsdom, src/**/*.test.ts)
npx vitest run src/core/tree.test.ts            # single test file
npx vitest run -t "name of test"                # single test by name
```

Node `^20.19.0 || >=22.12.0`. `@/` aliases `src/`. TS is strict with `noUnusedLocals`/`noUnusedParameters` and `verbatimModuleSyntax` (use `import type`).

## Architecture

Vue 3 + Vite app: write a folder structure as Markdown and edit it as a file explorer, and vice versa.

**The Markdown string is the single source of truth.** Nothing stores a tree. `useStudio().roots` is `parse(active.md)`, computed on demand. Every explorer edit (`useTreeEditor.mutate`) parses the Markdown fresh, applies one pure operation from `src/core/tree.ts` (`addEntries`, `renameNode`, `removeNode`, `moveNode`, `duplicateNode`, `updateNode`) and serializes back via `src/core/serialize.ts`, preserving the style in use (bullet list, ASCII tree, indentation). Operations return an `EditResult` (`ok` / `noop` / `error` with message) rather than throwing.

- `src/core/` is pure TypeScript with no Vue: `parse`, `serialize`, `tree`, `seed` (example data), `storage` (`localStorage` key `tree-studio.v1`), `fileKinds`. Tests sit beside the code.
- Nodes are addressed by dot-joined index path ids (e.g. `"0.2.1"`, see `findNode`), so ids change when siblings are reordered or removed. Don't hold on to them across edits. `sortTree` clones keep their ids.
- `src/composables/` are module-level singletons (`useStudio` caches its instance; `resetStudio()` is for tests). `useStudio` owns the examples list, the active example, the sort flag and persistence (deep watch → `saveState`). `useTreeEditor` owns edit/collapse state and per-example undo through `useHistory`.
- `sort` only affects the view (`viewRoots`), and `mutate({ useView: true })` exists for edits that must target the sorted view.

## Components

Atomic design under `src/components/` (atoms → molecules → organisms → templates). `App.vue` composes `StudioLayout` with `AppHeader`, `ExamplesPane`, `EditorPane`, `PreviewPane`. Theming and file/folder kind colors live in `src/styles/`.

## Icons

`src/icon-packs/atom-material/` is a vendored, curated subset of Atom Material Icons (MIT) with `_dark` variants. Which icon a name gets is decided by first match in `FILE_RULES` / `FOLDER_RULES` in `rules.ts`; unmatched folders use `folders/regular.svg`. To extend the subset, copy SVGs (plus `_dark` variants) from the `atom-material-icons@3.0.0` npm package into `files/` or `folders/` and add a rule. Vite is configured with `assetsInlineLimit: 0` so icons stay separate files.
