export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.client) {
    const competitions = useCompetitions()
    competitions.initializeFromStorage()
  }
}) 