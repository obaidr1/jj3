import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  // Only create pinia if it doesn't exist
  if (!nuxtApp.hasOwnProperty('$pinia')) {
    const pinia = createPinia()
    nuxtApp.vueApp.use(pinia)
  }
}) 