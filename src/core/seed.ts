import type { Example } from '@/types/tree'

export const NEW_EXAMPLE_MD = 'project/\n├── src/\n│   └── index.js\n└── README.md\n'

export const SEED_EXAMPLES: Omit<Example, 'id'>[] = [
  {
    title: 'Next.js app',
    md: `my-app/
├── app/                  # App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── dashboard/
│       ├── page.tsx
│       └── loading.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── Header.tsx
├── lib/
│   └── api.ts            # fetch helpers
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
└── README.md
`,
  },
  {
    title: 'Design system package',
    md: `design-system/
├── src/
│   ├── tokens/
│   │   ├── colors.json  # semantic + brand
│   │   ├── spacing.json
│   │   └── typography.json
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   └── Input/
│   │       ├── Input.tsx
│   │       ├── Input.module.css
│   │       └── index.ts
│   └── index.ts
├── docs/
│   ├── getting-started.md
│   └── adoption-guide.md  # for the workshop
├── .storybook/
│   └── main.ts
├── package.json
└── CHANGELOG.md
`,
  },
  {
    title: 'Markdown notes vault',
    md: `notes/
├── inbox/
├── projects/
│   ├── website-redesign/
│   │   ├── brief.md
│   │   ├── meeting-2026-11-12.md
│   │   └── assets/
│   │       └── wireframe.png
│   └── hiring/
│       └── job-description.md
├── areas/
│   └── frontend-learning.md
├── archive/
└── index.md  # table of contents
`,
  },
]
