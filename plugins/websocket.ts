export default defineNuxtPlugin(() => {
  let socket: WebSocket | null = null

  const connectWebSocket = () => {
    if (process.server) return

    socket = new WebSocket('ws://localhost:4000/ws')
    
    socket.onopen = () => {
      console.log('WebSocket connected')
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const disconnectWebSocket = () => {
    if (socket) {
      socket.close()
      socket = null
    }
  }

  // Connect when plugin is loaded (client-side only)
  if (process.client) {
    connectWebSocket()
  }

  // Cleanup on app unmount
  onUnmounted(() => {
    disconnectWebSocket()
  })

  return {
    provide: {
      websocket: {
        connect: connectWebSocket,
        disconnect: disconnectWebSocket,
        send: (data: any) => socket?.send(JSON.stringify(data))
      }
    }
  }
}) 