<template>
  <form @submit.prevent="handleSubmit" class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">
      {{ mode === 'login' ? 'Login' : 'Register' }}
    </h2>

    <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <div class="space-y-4">
      <!-- Login Form -->
      <template v-if="mode === 'login'">
        <div>
          <Label for="email">Email</Label>
          <Input id="email" v-model="form.email" type="email" placeholder="your@email.com" required />
        </div>

        <div>
          <Label for="password">Password</Label>
          <Input id="password" v-model="form.password" type="password" placeholder="••••••••" required />
        </div>
      </template>

      <!-- Registration Form -->
      <template v-else>
        <!-- Basic Information -->
        <div class="space-y-4">
          <h3 class="font-semibold">Basic Information</h3>
          
          <div>
            <Label for="name">Full Name</Label>
            <Input id="name" v-model="form.name" type="text" placeholder="Your full name" required />
          </div>

          <div>
            <Label for="email">Email</Label>
            <Input id="email" v-model="form.email" type="email" placeholder="your@email.com" required />
          </div>

          <div>
            <Label for="password">Password</Label>
            <Input id="password" v-model="form.password" type="password" placeholder="••••••••" required />
          </div>

          <div>
            <Label for="role">Role</Label>
            <Select v-model="form.role" required>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in roleOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-4">
          <h3 class="font-semibold">Contact Information</h3>
          
          <div>
            <Label for="city">City</Label>
            <Input id="city" v-model="form.city" type="text" placeholder="Your city" />
          </div>

          <div>
            <Label for="contact_phone">Phone Number</Label>
            <Input id="contact_phone" v-model="form.contact_phone" type="tel" placeholder="Your phone number" />
          </div>

          <div>
            <Label for="instagram">Instagram Handle</Label>
            <Input id="instagram" v-model="form.instagram" type="text" placeholder="@your_instagram" />
          </div>
        </div>

        <!-- Dancer Specific Fields -->
        <div v-if="form.role === UserRole.DANCER" class="space-y-4">
          <h3 class="font-semibold">Dancer Information</h3>
          
          <div>
            <Label for="dance_style">Dance Style</Label>
            <Select v-model="form.dance_style">
              <SelectTrigger id="dance_style">
                <SelectValue placeholder="Select your dance style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salsa">Salsa</SelectItem>
                <SelectItem value="bachata">Bachata</SelectItem>
                <SelectItem value="kizomba">Kizomba</SelectItem>
                <SelectItem value="zouk">Zouk</SelectItem>
                <SelectItem value="tango">Tango</SelectItem>
                <SelectItem value="hiphop">Hip-Hop</SelectItem>
                <SelectItem value="ballet">Ballet</SelectItem>
                <SelectItem value="contemporary">Contemporary Dance</SelectItem>
                <SelectItem value="jazz">Jazz Dance</SelectItem>
                <SelectItem value="other">Other (please specify)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div v-if="form.dance_style === 'other'">
            <Label for="other_dance_style">Other Dance Style</Label>
            <Input id="other_dance_style" v-model="form.other_dance_style" type="text" placeholder="Please specify your dance style" />
          </div>

          <div>
            <Label for="level">Experience Level</Label>
            <Select v-model="form.level" required>
              <SelectTrigger id="level">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novice">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Organizer Specific Fields -->
        <div v-if="form.role === UserRole.ORGANIZER" class="space-y-4">
          <h3 class="font-semibold">Organization Information</h3>
          
          <div>
            <Label for="organization_name">Organization Name</Label>
            <Input id="organization_name" v-model="form.organization_name" type="text" placeholder="Your organization name" />
          </div>

          <div>
            <Label for="organization_description">Organization Description</Label>
            <Textarea id="organization_description" v-model="form.organization_description" placeholder="Describe your organization" />
          </div>
        </div>
      </template>

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

<script setup lang="ts">
import { UserRole } from '../types/user'

type Mode = 'login' | 'register'

interface FormData {
  email: string
  password: string
  name?: string
  role?: UserRole
  city?: string
  dance_style?: string
  other_dance_style?: string
  level?: string
  organization_name?: string
  organization_description?: string
  contact_phone?: string
  instagram?: string
}

const props = defineProps<{
  mode: Mode
}>()

const auth = useAuth()
const router = useRouter()

const form = ref<FormData>({
  email: '',
  password: '',
  name: props.mode === 'register' ? '' : undefined,
  role: props.mode === 'register' ? undefined : undefined,
  city: '',
  dance_style: undefined,
  other_dance_style: '',
  level: undefined,
  organization_name: '',
  organization_description: '',
  contact_phone: '',
  instagram: ''
})

const loading = ref(false)
const error = ref('')

const roleOptions = [
  { label: 'Dancer', value: UserRole.DANCER },
  { label: 'Organizer', value: UserRole.ORGANIZER },
  { label: 'Judge', value: UserRole.JUDGE }
]

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

    if (props.mode === 'register') {
      if (!form.value.name) {
        error.value = 'Name is required'
        return
      }
      if (!form.value.role) {
        error.value = 'Role is required'
        return
      }
    }

    if (props.mode === 'login') {
      const user = await auth.login(form.value.email, form.value.password)
      console.log('Login user data:', user)
      console.log('User role:', user.role)
      if (user.role === UserRole.ORGANIZER) {
        console.log('Redirecting to organizer dashboard')
        router.push('/dashboard/organizer')
      } else if (user.role === UserRole.JUDGE) {
        router.push('/dashboard/judge')
      } else {
        router.push('/dashboard')
      }
    } else {
      if (!form.value.name || !form.value.role) {
        error.value = 'Name and role are required for registration'
        return
      }
      const user = await auth.register(form.value.email, form.value.password, form.value.name, form.value.role)
      if (user.role === UserRole.ORGANIZER) {
        router.push('/dashboard/organizer')
      } else if (user.role === UserRole.JUDGE) {
        router.push('/dashboard/judge')
      } else {
        router.push('/dashboard')
      }
    }

    // Clear form after successful submission
    form.value = {
      email: '',
      password: '',
      name: props.mode === 'register' ? '' : undefined,
      role: props.mode === 'register' ? undefined : undefined,
      city: '',
      dance_style: undefined,
      other_dance_style: '',
      level: undefined,
      organization_name: '',
      organization_description: '',
      contact_phone: '',
      instagram: ''
    }

  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script> 