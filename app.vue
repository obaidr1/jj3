<script setup lang="ts">
const auth = useAuth()
const competitions = useCompetitions()

// Initialize stores on client side only
onMounted(() => {
  if (process.client) {
    auth.initializeFromStorage()
    competitions.initializeFromStorage()
  }
})
</script>

<template>
  <div class="bg-background text-foreground">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
