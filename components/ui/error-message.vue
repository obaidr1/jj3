<script setup lang="ts">
import { AppError } from '~/utils/errorUtils'

defineProps<{
  error: AppError
}>()
</script>

<template>
  <div class="bg-destructive/15 text-destructive px-4 py-2 rounded-md flex items-start space-x-2">
    <Icon name="i-heroicons-exclamation-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
    <div>
      <p class="font-medium">{{ error.message }}</p>
      <p v-if="error.field" class="text-sm opacity-90">
        Field: {{ error.field }}
      </p>
    </div>
  </div>
</template> 