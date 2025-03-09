import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Example composable that registers a WebSocket connection 
 * and cleans it up automatically on unmount.
 */
export function useWebSocket() {
  const ws = ref<WebSocket | null>(null)

  onMounted(() => {
    const url = process.env.WS_URL
    if (!url) {
      console.log('No WebSocket URL provided, skipping connection')
      return
    }

    console.log('Connecting to WebSocket:', url)
    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      console.log('WebSocket open:', url)
    }
    ws.value.onerror = (err) => {
      console.error('WebSocket error:', err)
    }
    ws.value.onclose = (ev) => {
      console.warn('WebSocket closed:', ev)
      // (Optional) Reconnection logic:
      // setTimeout(() => {
      //   ws.value = new WebSocket(url)
      // }, 2000)
    }
  })

  onUnmounted(() => {
    if (ws.value) {
      console.log('Closing WebSocket...')
      ws.value.close()
      ws.value = null
    }
  })

  return { ws }
} 