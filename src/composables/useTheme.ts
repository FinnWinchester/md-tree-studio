import { computed, ref } from 'vue'

const media = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
const explicit = ref<'light' | 'dark' | null>(null)
const systemDark = ref(!!media?.matches)
media?.addEventListener?.('change', (event) => {
  systemDark.value = event.matches
})

const isDark = computed(() => (explicit.value ?? (systemDark.value ? 'dark' : 'light')) === 'dark')

export function useTheme() {
  function toggle() {
    const next = isDark.value ? 'light' : 'dark'
    explicit.value = next
    document.documentElement.setAttribute('data-theme', next)
  }
  return { isDark, toggle }
}
