<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="text-destructive" role="alert">
    {{ message }}
  </div>
</template> 