import { Ref } from 'vue'

export function useApi<T>() {
  const pending = ref(false)
  const error = ref<Error | null>(null)
  const data = ref<T | null>(null)

  // Store active controllers for cleanup
  const controllers: AbortController[] = []

  // Create a new controller and add to list
  function createController() {
    const controller = new AbortController()
    controllers.push(controller)
    return controller
  }

  // Cleanup function to abort all pending requests
  function cleanup() {
    controllers.forEach(controller => controller.abort())
    controllers.length = 0
  }

  // Automatically cleanup on component unmount
  onUnmounted(cleanup)

  async function execute<R = T>(
    url: string,
    options: RequestInit = {}
  ): Promise<R | null> {
    const controller = createController()

    try {
      pending.value = true
      error.value = null

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      data.value = result
      return result
    } catch (e) {
      if (e instanceof Error) {
        error.value = e
      }
      return null
    } finally {
      pending.value = false
      const index = controllers.indexOf(controller)
      if (index > -1) {
        controllers.splice(index, 1)
      }
    }
  }

  return {
    pending,
    error,
    data,
    execute,
    cleanup
  }
} 