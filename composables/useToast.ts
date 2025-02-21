import { useToast as useVueToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

export function useToast() {
  const toast = useVueToast({
    position: 'top-right',
    duration: 3000
  })

  return {
    success(message: string) {
      toast.success(message)
    },
    error(message: string) {
      toast.error(message)
    },
    warning(message: string) {
      toast.warning(message)
    },
    info(message: string) {
      toast.info(message)
    }
  }
} 