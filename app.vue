<script setup lang="ts">
const auth = useAuth()

// Check authentication on app start
onMounted(async () => {
  await auth.checkAuth()
})
</script>

<template>
  <div class="bg-background text-foreground">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
