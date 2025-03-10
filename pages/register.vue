<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <AuthForm mode="register" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  path: '/register',
  alias: ['/auth/register']
})
</script> 