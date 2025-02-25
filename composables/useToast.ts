export function useToast() {
  return {
    success(message: string) {
      console.log('Success:', message)
      // You can replace this with your preferred toast implementation
    },
    error(message: string) {
      console.error('Error:', message)
      // You can replace this with your preferred toast implementation
    },
    warning(message: string) {
      console.warn('Warning:', message)
    },
    info(message: string) {
      console.info('Info:', message)
    }
  }
} 