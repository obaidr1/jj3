<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    loading.value = true

    await auth.login(form.value.email, form.value.password)
    
    // Redirect based on role
    if (auth.isOrganizer) {
      router.push('/dashboard/organizer')
    } else if (auth.isJudge) {
      router.push('/dashboard/judge')
    } else if (auth.isDancer) {
      router.push('/dashboard/dancer')
    } else {
      router.push('/dashboard')
    }
  } catch (e) {
    console.error('Login failed:', e)
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card class="w-full max-w-md p-6">
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2 text-center">
          <h1 class="text-3xl font-bold">Welcome Back</h1>
          <p class="text-gray-500">Enter your credentials to access your account</p>
        </div>

        <!-- Error Alert -->
        <Alert 
          v-if="error" 
          variant="destructive"
          class="mb-4"
        >
          <AlertTitle>Login Failed</AlertTitle>
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <div class="space-y-4">
          <!-- Email Input -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <!-- Submit Button -->
        <Button 
          type="submit" 
          class="w-full"
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </Button>

        <!-- Registration Link -->
        <div class="text-center text-sm">
          <span class="text-gray-500">Don't have an account?</span>
          <NuxtLink 
            to="/register" 
            class="text-primary hover:underline ml-1"
          >
            Register
          </NuxtLink>
        </div>
      </form>
    </Card>
  </div>
</template> 