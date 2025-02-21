<template>
  <form @submit.prevent="handleSubmit">
    <input data-test="email-input" type="email" />
    <input data-test="password-input" type="password" />
    <button type="submit">Login</button>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits(['submit'])
const handleSubmit = () => emit('submit')
</script> 