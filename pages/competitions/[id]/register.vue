<script setup lang="ts">
import { useRuntimeConfig } from '#app'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const competitions = useCompetitions()
const config = useRuntimeConfig()

const loading = ref(false)
const error = ref<string | null>(null)

// Get competition data
const competitionId = route.params.id as string
const competition = computed(() => {
  const comp = competitions.getCompetitionById(route.params.id as string)
  if (!comp) {
    error.value = 'Competition not found'
    return null
  }
  return comp
})

// Get user data
const userData = computed(() => {
  if (!auth.user) return null
  return {
    firstName: auth.user.name.split(' ')[0],
    lastName: auth.user.name.split(' ')[1] || '',
    email: auth.user.email,
  }
})

// Add role options
const roleOptions = [
  { label: 'Leader', value: 'leader' },
  { label: 'Follower', value: 'follower' }
]

// Add payment options
const paymentOptions = [
  { label: 'PayPal (Coming Soon)', value: 'paypal', disabled: true },
  { label: 'Credit Card (Coming Soon)', value: 'creditcard', disabled: true },
  { label: 'Cash Payment', value: 'cash' }
]

// Form data with readonly fields
const form = ref({
  personalInfo: {
    firstName: userData.value?.firstName || '',
    lastName: userData.value?.lastName || '',
    email: userData.value?.email || '',
    phone: '',
    city: '',
    country: '',
    instagram: ''
  },
  role: '' as 'leader' | 'follower',
  paymentMethod: 'cash' as 'cash' | 'paypal' | 'creditcard',
  agreements: {
    rules: false,
    photoConsent: false
  }
})

// Validation
const isFormValid = computed(() => {
  if (!form.value) return false
  
  const { personalInfo, role, paymentMethod, agreements } = form.value
  
  // Check personal info
  const hasRequiredPersonalInfo = Boolean(
    personalInfo.firstName &&
    personalInfo.lastName &&
    personalInfo.email &&
    personalInfo.phone &&
    personalInfo.city &&
    personalInfo.country
  )

  // Check role and payment
  const hasRoleAndPayment = Boolean(
    role && 
    paymentMethod
  )

  // Check agreements
  const hasAgreed = Boolean(
    agreements.rules &&
    agreements.photoConsent
  )

  return hasRequiredPersonalInfo && hasRoleAndPayment && hasAgreed
})

// Add form watcher for debugging
watch(form, (newValue) => {
  console.log('Form state:', {
    isValid: isFormValid.value,
    form: newValue,
    personalInfo: {
      hasName: Boolean(newValue.personalInfo.firstName && newValue.personalInfo.lastName),
      hasEmail: Boolean(newValue.personalInfo.email),
      hasPhone: Boolean(newValue.personalInfo.phone),
      hasLocation: Boolean(newValue.personalInfo.city && newValue.personalInfo.country)
    },
    hasRole: Boolean(newValue.role),
    hasPayment: Boolean(newValue.paymentMethod),
    hasAgreed: Boolean(newValue.agreements.rules && newValue.agreements.photoConsent)
  })
}, { deep: true })

// Add registration status checks
const isRegistrationOpen = computed(() => {
  if (!competition.value) return false
  
  const deadline = new Date(competition.value.registrationDeadline.date)
  const [hours, minutes] = competition.value.registrationDeadline.time.split(':')
  deadline.setHours(parseInt(hours), parseInt(minutes))
  
  return new Date() <= deadline
})

const isCompetitionFull = computed(() => {
  if (!competition.value) return false
  return competition.value.maxDancers > 0 && 
         (competition.value.registrations?.length || 0) >= competition.value.maxDancers
})

const registrationStatus = computed(() => {
  if (!isRegistrationOpen.value) {
    return { text: 'Registration Closed', color: 'text-destructive', allowed: false }
  }
  if (isCompetitionFull.value) {
    return { text: 'Competition Full', color: 'text-destructive', allowed: false }
  }
  return { text: 'Open for Registration', color: 'text-green-600', allowed: true }
})

async function handleSubmit() {
  try {
    if (!isFormValid.value) {
      error.value = 'Please fill in all required fields'
      // Log validation state for debugging
      console.log('Form validation failed:', {
        isValid: isFormValid.value,
        form: form.value
      })
      return
    }

    loading.value = true
    error.value = null

    // Register for competition
    await competitions.registerForCompetition(competitionId, {
      userId: auth.user?.id,
      ...form.value
    })

    // Show success message and redirect
    const toast = useToast()
    toast.success('Successfully registered for competition!')
    router.push('/dashboard')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Registration failed'
    console.error('Registration error:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <!-- Show error if competition not found -->
    <Alert v-if="error" variant="destructive">
      {{ error }}
    </Alert>

    <!-- Show loading state -->
    <div v-else-if="loading" class="text-center py-8">
      Loading...
    </div>

    <!-- Registration Status Alert -->
    <div v-else-if="!registrationStatus.allowed" class="mb-8">
      <Alert variant="destructive">
        <AlertTitle class="text-xl">{{ registrationStatus.text }}</AlertTitle>
        <AlertDescription v-if="!isRegistrationOpen && competition">
          Registration deadline was {{ new Date(competition.registrationDeadline.date).toLocaleDateString() }} 
          at {{ competition.registrationDeadline.time }}
        </AlertDescription>
        <AlertDescription v-if="isCompetitionFull">
          Maximum number of participants has been reached
        </AlertDescription>
      </Alert>
    </div>

    <!-- Show form only if competition exists and registration is open -->
    <div v-else-if="competition && registrationStatus.allowed" class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold">Register for {{ competition.name }}</h1>
        <p class="text-gray-500 mt-2">Please complete your registration below</p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Personal Information -->
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="firstName">First Name</Label>
                <Input
                  id="firstName"
                  v-model="form.personalInfo.firstName"
                  readonly
                  disabled
                />
              </div>
              <div class="space-y-2">
                <Label for="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  v-model="form.personalInfo.lastName"
                  readonly
                  disabled
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="form.personalInfo.email"
                type="email"
                readonly
                disabled
              />
            </div>

            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <Input
                id="phone"
                v-model="form.personalInfo.phone"
                type="tel"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="city">City</Label>
                <Input
                  id="city"
                  v-model="form.personalInfo.city"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="country">Country</Label>
                <Input
                  id="country"
                  v-model="form.personalInfo.country"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="instagram">Instagram (optional)</Label>
              <Input
                id="instagram"
                v-model="form.personalInfo.instagram"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Role Selection -->
        <Card>
          <CardHeader>
            <CardTitle>Dance Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <Label for="role">Select your role</Label>
              <Select v-model="form.role" required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
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
          </CardContent>
        </Card>

        <!-- Payment Method -->
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <Label for="payment">Select payment method</Label>
              <Select v-model="form.paymentMethod" required>
                <SelectTrigger id="payment">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in paymentOptions"
                    :key="option.value"
                    :value="option.value"
                    :disabled="option.disabled"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <!-- Agreements -->
        <Card>
          <CardHeader>
            <CardTitle>Agreements</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center space-x-2">
              <Checkbox
                id="rules"
                :checked="form.agreements.rules"
                @update:checked="(val) => form.agreements.rules = val"
              />
              <Label for="rules" class="cursor-pointer">
                I agree to the competition rules and terms
              </Label>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox
                id="photo"
                :checked="form.agreements.photoConsent"
                @update:checked="(val) => form.agreements.photoConsent = val"
              />
              <Label for="photo" class="cursor-pointer">
                I consent to being photographed during the event
              </Label>
            </div>
          </CardContent>
        </Card>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full"
          :disabled="!isFormValid || loading"
          :loading="loading"
        >
          {{ loading ? 'Registering...' : 'Complete Registration' }}
        </Button>
      </form>
    </div>

    <!-- Debug info without dev check -->
    <div class="mt-8 p-4 bg-gray-100 rounded-lg">
      <details>
        <summary class="cursor-pointer">Debug Info</summary>
        <pre class="mt-2 text-xs">{{ {
          isValid: isFormValid,
          form: form,
          personalInfo: {
            hasName: Boolean(form.personalInfo.firstName && form.personalInfo.lastName),
            hasEmail: Boolean(form.personalInfo.email),
            hasPhone: Boolean(form.personalInfo.phone),
            hasLocation: Boolean(form.personalInfo.city && form.personalInfo.country)
          },
          hasRole: Boolean(form.role),
          hasPayment: Boolean(form.paymentMethod),
          hasAgreed: Boolean(form.agreements.rules && form.agreements.photoConsent)
        } }}</pre>
      </details>
    </div>
  </div>
</template>

<style scoped>
.required::after {
  content: '*';
  color: rgb(var(--color-destructive));
  margin-left: 0.25rem;
}
</style> 