<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const competitions = useCompetitions()
</script>

<template>
  <div class="container mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold">Competition Management</h1>
    <!-- Add your competition management content here -->
  </div>
</template> 