<script setup lang="ts">
// Remove any toast imports if they exist
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <AppNavigation />
    <PrototypeBanner />
    <main>
      <slot />
    </main>
    <LandingFooter />
    <CookieConsent />
  </div>
</template>
