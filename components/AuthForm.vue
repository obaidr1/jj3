<template>
  <form @submit.prevent="handleSubmit" class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">
      {{ mode === 'login' ? 'Login' : 'Register' }}
    </h2>

    <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <div class="space-y-4">
      <div v-if="mode === 'register'">
        <Label for="name">Name</Label>
        <Input id="name" v-model="form.name" type="text" placeholder="Your name" />
      </div>

      <div>
        <Label for="email">Email</Label>
        <Input id="email" v-model="form.email" type="email" placeholder="your@email.com" />
      </div>

      <div>
        <Label for="password">Password</Label>
        <Input id="password" v-model="form.password" type="password" placeholder="••••••••" />
      </div>

      <Button type="submit" class="w-full" :loading="loading">
        {{ mode === 'login' ? 'Login' : 'Register' }}
      </Button>

      <div class="text-center text-sm text-gray-600">
        <NuxtLink :to="mode === 'login' ? '/register' : '/login'" class="text-primary hover:underline">
          {{ mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login' }}
        </NuxtLink>
      </div>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['login', 'register'].includes(value)
  }
})

const { login, register } = useAuth()

const form = ref({
  email: '',
  password: '',
  name: props.mode === 'register' ? '' : undefined
})

const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  try {
    loading.value = true
    error.value = ''

    if (!form.value.email) {
      error.value = 'Email is required'
      return
    }

    if (!form.value.password) {
      error.value = 'Password is required'
      return
    }

    if (props.mode === 'register' && !form.value.name) {
      error.value = 'Name is required'
      return
    }

    if (props.mode === 'login') {
      await login(form.value.email, form.value.password)
    } else {
      await register(form.value.name, form.value.email, form.value.password)
    }

    // Clear form after successful submission
    form.value = {
      email: '',
      password: '',
      name: props.mode === 'register' ? '' : undefined
    }

  } catch (e) {
    error.value = e.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script> 