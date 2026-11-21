# Atom Material Icons (subset)

File and folder icons from **Atom Material Icons** by Mallowigi, the set behind the JetBrains plugin
(https://plugins.jetbrains.com/plugin/10044-atom-material-icons). Licensed under the MIT License (see `LICENSE`).

- Source: https://github.com/mallowigi/iconGenerator, published on npm as `atom-material-icons@3.0.0`.
- `files/` and `folders/` hold a curated subset of the SVGs plus their `_dark` variants.
- `rules.ts` keeps the plugin's own name patterns (first match wins) for the icons that are included.
- Extend the subset by copying SVGs from the npm package into `files/` or `folders/` and adding a rule in `rules.ts`.
