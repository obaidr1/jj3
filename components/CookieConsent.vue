<script setup lang="ts">
const accepted = ref(false)

function accept() {
  accepted.value = true
}
</script>

<template>
  <div v-if="!accepted" class="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="p-2 rounded-lg bg-primary shadow-lg sm:p-3">
        <div class="flex items-center justify-between flex-wrap">
          <div class="w-0 flex-1 flex items-center">
            <p class="ml-3 font-medium text-white truncate">
              <span class="md:hidden">We use cookies</span>
              <span class="hidden md:inline">We use cookies to enhance your experience</span>
            </p>
          </div>
          <div class="mt-2 flex-shrink-0 w-full sm:mt-0 sm:w-auto">
            <Button variant="secondary" @click="accept">
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 