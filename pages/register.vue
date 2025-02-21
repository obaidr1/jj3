<script setup lang="ts">
import { UserRole } from '~/types/user'

definePageMeta({
  layout: 'default'
})

const auth = useAuth()
const router = useRouter()

const form = ref({
  role: UserRole.DANCER,
  danceRoles: {
    leader: false,
    follower: false
  },
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  instagram: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const isFormValid = computed(() => {
  const { firstName, lastName, email, city, country, password, confirmPassword, role, danceRoles } = form.value

  // Basic validation for required fields
  const hasRequiredFields = Boolean(
    firstName?.trim() &&
    lastName?.trim() &&
    email?.trim() &&
    city?.trim() &&
    country?.trim() &&
    password?.trim() &&
    confirmPassword?.trim() &&
    password === confirmPassword
  )

  // For dancers, check if at least one dance role is selected
  if (role === UserRole.DANCER) {
    return hasRequiredFields && (danceRoles.leader || danceRoles.follower)
  }

  return hasRequiredFields
})

async function handleSignUp() {
  try {
    error.value = ''
    loading.value = true

    // Validate passwords match
    if (form.value.password !== form.value.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    // Validate dance roles for dancers
    if (form.value.role === UserRole.DANCER && 
        !form.value.danceRoles.leader && 
        !form.value.danceRoles.follower) {
      throw new Error('Please select at least one dance role')
    }

    await auth.register(
      form.value.email,
      form.value.password,
      `${form.value.firstName} ${form.value.lastName}`,
      form.value.role,
      {
        phone: form.value.phone,
        city: form.value.city,
        country: form.value.country,
        instagram: form.value.instagram,
        danceRoles: form.value.danceRoles
      }
    )

    router.push('/dashboard')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <Card class="w-full max-w-md p-6">
      <form @submit.prevent="handleSignUp" class="space-y-6">
        <div class="space-y-2 text-center">
          <h1 class="text-3xl font-bold">Create Account</h1>
          <p class="text-gray-500">Enter your details to register</p>
        </div>

        <!-- Error Alert -->
        <Alert 
          v-if="error" 
          variant="destructive"
          class="mb-4"
        >
          <AlertTitle>Registration Failed</AlertTitle>
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <!-- Account Type -->
        <div class="space-y-2">
          <Label>Account Type</Label>
          <Select v-model="form.role" required>
            <SelectTrigger class="w-full bg-background border">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent position="popper" class="bg-background border">
              <SelectItem 
                v-for="role in [UserRole.DANCER, UserRole.ORGANIZER, UserRole.JUDGE]" 
                :key="role" 
                :value="role"
                class="cursor-pointer"
              >
                {{ role }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Personal Information -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName">First Name</Label>
              <Input
                id="firstName"
                v-model="form.firstName"
                type="text"
                placeholder="First name"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="lastName">Last Name</Label>
              <Input
                id="lastName"
                v-model="form.lastName"
                type="text"
                placeholder="Last name"
                required
              />
            </div>
          </div>

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

          <div class="space-y-2">
            <Label for="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              v-model="form.phone"
              type="tel"
              placeholder="Your phone number"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="city">City</Label>
              <Input
                id="city"
                v-model="form.city"
                type="text"
                placeholder="Your city"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="country">Country</Label>
              <Input
                id="country"
                v-model="form.country"
                type="text"
                placeholder="Your country"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="instagram">Instagram (Optional)</Label>
            <Input
              id="instagram"
              v-model="form.instagram"
              type="text"
              placeholder="@username"
            />
          </div>

          <!-- Dance Roles (Only for dancers) -->
          <div v-if="form.role === UserRole.DANCER" class="space-y-4">
            <Label>Dance Roles (Select at least one)</Label>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <FormField name="leader">
                  <FormItem class="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        :checked="form.danceRoles.leader"
                        @update:checked="(checked) => form.danceRoles.leader = checked"
                      />
                    </FormControl>
                    <FormLabel class="font-normal">Leader</FormLabel>
                  </FormItem>
                </FormField>
              </div>
              <div class="flex items-center space-x-2">
                <FormField name="follower">
                  <FormItem class="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        :checked="form.danceRoles.follower"
                        @update:checked="(checked) => form.danceRoles.follower = checked"
                      />
                    </FormControl>
                    <FormLabel class="font-normal">Follower</FormLabel>
                  </FormItem>
                </FormField>
              </div>
            </div>
          </div>
        </div>

        <!-- Password Section -->
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Create a password"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <!-- Submit Button -->
        <Button 
          type="submit" 
          class="w-full"
          :loading="loading"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </Button>

        <!-- Login Link -->
        <div class="text-center text-sm">
          <span class="text-gray-500">Already have an account?</span>
          <NuxtLink 
            to="/login" 
            class="text-primary hover:underline ml-1"
          >
            Login
          </NuxtLink>
        </div>
      </form>
    </Card>

    <!-- Debug Section -->
    <div class="w-full max-w-md mt-8 p-4 bg-muted rounded-lg">
      <details class="text-xs">
        <summary class="cursor-pointer font-medium mb-2">Debug Information</summary>
        <div class="font-mono whitespace-pre-wrap">
          <div>Form State:</div>
          {{ JSON.stringify(form, null, 2) }}
          <div class="mt-2">Form Valid: {{ isFormValid }}</div>
        </div>
      </details>
    </div>
  </div>
</template> 