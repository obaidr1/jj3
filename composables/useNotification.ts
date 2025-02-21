import { useNotification as useVueUseNotification } from '@vueuse/core'

export function useNotification() {
  const notification = useVueUseNotification({
    position: 'top-right',
    duration: 3000,
  })

  return {
    success(message: string) {
      notification.add({
        title: 'Success',
        message,
        type: 'success',
      })
    },
    error(message: string) {
      notification.add({
        title: 'Error',
        message,
        type: 'error',
      })
    }
  }
} 