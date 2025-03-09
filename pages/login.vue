<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <AuthForm mode="login" />
  </div>
</template>

<script setup>
definePageMeta({
  path: '/login',
  alias: ['/auth/login']
})
</script> 