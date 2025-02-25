<script setup lang="ts">
// Remove any toast imports if they exist
const auth = useAuth()
</script>

<template>
  <div class="min-h-screen">
    <!-- Top Navigation - Only show when authenticated -->
    <template v-if="auth.isAuthenticated">
      <AppNavigation />
      <PrototypeBanner />
    </template>

    <!-- Page Content -->
    <slot />

    <!-- Cookie Consent -->
    <CookieConsent />
  </div>
</template>
