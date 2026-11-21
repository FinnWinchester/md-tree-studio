import { ref } from 'vue'

const message = ref('')
let timer: number | undefined

export function useStatus() {
  function show(text: string, ms = 2200) {
    message.value = text
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      message.value = ''
    }, ms)
  }
  return { message, show }
}

export function resetStatus() {
  window.clearTimeout(timer)
  message.value = ''
}
