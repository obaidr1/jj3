<script setup lang="ts">
defineProps<{
  src?: string
  alt: string
}>()
</script>

<template>
  <div class="relative aspect-video overflow-hidden rounded-t-lg">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div
      v-else
      class="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
    >
      <Icon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
    </div>
  </div>
</template> 