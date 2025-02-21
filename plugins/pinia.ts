import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)

  // Initialize competitions store
  if (process.client) {
    const competitions = useCompetitions()
    competitions.initializeFromStorage()
  }
}) 