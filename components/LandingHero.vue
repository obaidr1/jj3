<template>
  <section class="relative min-h-screen flex items-center justify-center">
    <div class="container px-4 md:px-6">
      <div class="flex flex-col items-center space-y-4 text-center">
        <div class="space-y-2">
          <h1
            class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
          >
            {{ title }}
          </h1>
          <p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            {{ description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script>
