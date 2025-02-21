<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { UserRole } from '~/types/user'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
  mode: 'login' | 'register'
}>()

const auth = useAuth()

const email = ref('')
const password = ref('')
const name = ref('')
const role = ref<UserRole>(UserRole.DANCER)

const loading = ref(false)
const error = ref('')

const schema = computed(() => {
  const baseSchema = {
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  }

  if (props.mode === 'register') {
    return yup.object({
      ...baseSchema,
      name: yup.string().required('Name is required'),
      role: yup.string().oneOf(Object.values(UserRole), 'Invalid role').required('Role is required')
    })
  }

  return yup.object(baseSchema)
})

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema
})

const onSubmit = handleSubmit(async (values) => {
  try {
    if (props.mode === 'login') {
      await auth.login(values.email, values.password)
    } else {
      await auth.register(values)
    }
    
    if (!auth.error) {
      navigateTo('/dashboard')
    }
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <Card class="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle>{{ mode === 'login' ? 'Sign In' : 'Create Account' }}</CardTitle>
      <CardDescription>
        {{ mode === 'login' ? 'Welcome back!' : 'Join the dance competition platform' }}
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input 
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="your@email.com"
          />
        </div>

        <div class="space-y-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            required
          />
        </div>

        <template v-if="mode === 'register'">
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input
              id="name"
              v-model="name"
              required
              placeholder="Your Name"
            />
          </div>

          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Select v-model="role">
              <option :value="UserRole.DANCER">Dancer</option>
              <option :value="UserRole.ORGANIZER">Organizer</option>
            </Select>
          </div>
        </template>

        <Button 
          type="submit" 
          class="w-full"
          :disabled="loading"
        >
          {{ mode === 'login' ? 'Sign In' : 'Create Account' }}
        </Button>

        <div v-if="errors.email" class="text-red-500 text-sm">
          {{ errors.email }}
        </div>
      </form>
    </CardContent>
  </Card>
</template> 