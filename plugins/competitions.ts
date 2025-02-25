export default defineNuxtPlugin(() => {
  // Only initialize on client-side
  if (process.client) {
    const competitions = useCompetitions()
    competitions.initializeFromStorage()
  }
}) 