import { useStatus } from '@/composables/useStatus'

export function useClipboard() {
  const status = useStatus()

  function fallback(text: string) {
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    document.body.removeChild(area)
    status.show(ok ? 'Copied' : 'Copy blocked')
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      status.show('Copied')
    } catch {
      fallback(text)
    }
  }

  return { copy }
}
