import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import App from '@/App.vue'
import { clearState } from '@/core/storage'
import { resetHistory } from '@/composables/useHistory'
import { resetStatus } from '@/composables/useStatus'
import { resetStudio } from '@/composables/useStudio'
import { resetTreeEditor } from '@/composables/useTreeEditor'

function fresh() {
  clearState()
  resetStudio()
  resetTreeEditor()
  resetHistory()
  resetStatus()
  return mount(App, { attachTo: document.body })
}

describe('App', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the first example as an explorer', () => {
    const wrapper = fresh()
    expect(wrapper.find('h1').text()).toBe('MD Tree Studio')
    expect(wrapper.findAll('.row').length).toBeGreaterThan(10)
    expect(wrapper.text()).toContain('layout.tsx')
    wrapper.unmount()
  })

  it('switches examples', async () => {
    const wrapper = fresh()
    const items = wrapper.findAll('.item')
    expect(items).toHaveLength(3)
    await items[1].trigger('click')
    expect(wrapper.text()).toContain('Button.stories.tsx')
    wrapper.unmount()
  })

  it('writes explorer edits back to the Markdown, and undoes them', async () => {
    const wrapper = fresh()
    const textarea = wrapper.find('textarea')
    const before = (textarea.element as HTMLTextAreaElement).value

    await wrapper.find('button[aria-label="Add file in my-app"]').trigger('click')
    const input = wrapper.find('input[aria-label="name.ext (a/b.ext adds folders)"]')
    expect(input.exists()).toBe(true)
    await input.setValue('todo.md')
    await input.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect((textarea.element as HTMLTextAreaElement).value).toContain('todo.md')
    expect(wrapper.text()).toContain('todo.md')

    const undo = wrapper.findAll('button').find((b) => b.text() === 'Undo')!
    expect(undo.attributes('disabled')).toBeUndefined()
    await undo.trigger('click')
    expect((textarea.element as HTMLTextAreaElement).value).toBe(before)
    wrapper.unmount()
  })

  it('renames and deletes from the explorer', async () => {
    const wrapper = fresh()
    const textarea = wrapper.find('textarea').element as HTMLTextAreaElement

    await wrapper.find('button[aria-label="Rename README.md"]').trigger('click')
    const input = wrapper.find('input[aria-label="Name"]')
    await input.setValue('GUIDE.md')
    await input.trigger('keydown', { key: 'Enter' })
    expect(textarea.value).toContain('GUIDE.md')
    expect(textarea.value).not.toContain('README.md')

    await wrapper.find('button[aria-label="Delete GUIDE.md"]').trigger('click')
    expect(textarea.value).not.toContain('GUIDE.md')
    wrapper.unmount()
  })

  it('edits name and comment separately on double click', async () => {
    const wrapper = fresh()
    const textarea = wrapper.find('textarea').element as HTMLTextAreaElement

    const row = wrapper.findAll('.row').find((r) => r.text().includes('README.md'))!
    await row.trigger('dblclick')
    expect(wrapper.find('input[aria-label="Name"]').exists()).toBe(true)
    const comment = wrapper.find('input[aria-label="Comment"]')
    await comment.setValue('start here')
    await comment.trigger('keydown', { key: 'Enter' })
    expect(textarea.value).toContain('README.md  # start here')

    // Name change keeps the comment; Escape discards
    const again = wrapper.findAll('.row').find((r) => r.text().includes('README.md'))!
    await again.trigger('dblclick')
    await wrapper.find('input[aria-label="Name"]').setValue('GUIDE.md')
    await wrapper.find('input[aria-label="Name"]').trigger('keydown', { key: 'Enter' })
    expect(textarea.value).toContain('GUIDE.md  # start here')

    const third = wrapper.findAll('.row').find((r) => r.text().includes('GUIDE.md'))!
    await third.trigger('dblclick')
    await wrapper.find('input[aria-label="Comment"]').setValue('nope')
    await wrapper.find('input[aria-label="Comment"]').trigger('keydown', { key: 'Escape' })
    expect(textarea.value).toContain('# start here')
    wrapper.unmount()
  })

  it('duplicates a file from the explorer', async () => {
    const wrapper = fresh()
    const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
    await wrapper.find('button[aria-label="Duplicate README.md"]').trigger('click')
    expect(textarea.value).toContain('README (Copy).md')
    wrapper.unmount()
  })

  it('does not start editing when the row buttons are clicked repeatedly', async () => {
    const wrapper = fresh()
    const button = wrapper.find('button[aria-label="Duplicate README.md"]')
    await button.trigger('click')
    await button.trigger('click')
    await button.trigger('dblclick')
    expect(wrapper.find('input[aria-label="Name"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('rebuilds the preview when the Markdown is typed', async () => {
    const wrapper = fresh()
    await wrapper.find('textarea').setValue('site/\n  - index.html\n')
    expect(wrapper.text()).toContain('index.html')
    expect(wrapper.text()).toContain('1 folder · 1 file')
    wrapper.unmount()
  })

  it('has no Markdown format selector and always writes an ASCII tree', async () => {
    const wrapper = fresh()
    expect(wrapper.find('select').exists()).toBe(false)
    await wrapper.find('textarea').setValue('site/\n  - index.html\n  - css/\n    - app.css\n')
    const regen = wrapper.findAll('button').find((b) => b.text().startsWith('Regenerate Markdown'))!
    await regen.trigger('click')
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('site/\n├── index.html\n└── css/\n    └── app.css\n')
    wrapper.unmount()
  })

  it('keeps the theme button in the app header, not in the preview', () => {
    const wrapper = fresh()
    expect(wrapper.find('header.top').text()).toContain('Theme')
    expect(wrapper.find('section[aria-label="Preview"]').text()).not.toContain('Theme')
    wrapper.unmount()
  })

  it('always shows Atom Material icons, with no badge or pack switch', () => {
    const wrapper = fresh()
    const preview = wrapper.find('section[aria-label="Preview"]')
    expect(preview.findAll('img.pack-icon').length).toBeGreaterThan(10)
    expect(preview.findAll('img.pack-icon').every((img) => img.attributes('src'))).toBe(true)
    expect(preview.find('[role="radio"]').exists()).toBe(false)
    expect(preview.find('select').exists()).toBe(false)
    wrapper.unmount()
  })
})
