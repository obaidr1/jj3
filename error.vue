<script setup lang="ts">
defineProps({
  error: Object,
})

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-muted flex items-center justify-center px-4">
    <div class="text-center max-w-xl mx-auto">
      <div class="mb-8">
        <Icon
          name="ph:warning-circle"
          class="mx-auto h-24 w-24 text-accent"
        />
      </div>

      <h1 class="text-4xl font-bold text-foreground mb-4">
        {{ error?.statusCode === 404 ? 'Page Not Found' : 'Something went wrong' }}
      </h1>

      <p class="text-lg text-muted-foreground mb-8">
        {{
          error?.statusCode === 404
            ? "It seems like the requested page is unavailable. Please try again."
            : "An error occurred. Please try again."
        }}
      </p>

      <div class="space-x-4">
        <Button @click="handleGoHome" size="lg"> Back to Home </Button>
        <Button @click="router.back()" variant="outline" size="lg">
          Go Back
        </Button>
      </div>
    </div>
  </div>
</template>
