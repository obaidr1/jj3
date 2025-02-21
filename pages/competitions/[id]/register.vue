<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const competitions = useCompetitions()
const { $toast } = useNuxtApp()

const loading = ref(false)
const formError = ref<string | null>(null)

// Form data with proper types
const form = ref({
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    instagram: ''
  },
  role: '' as 'leader' | 'follower' | '',
  agreements: {
    rules: false,
    photoConsent: false
  },
  paymentMethod: '' as 'paypal' | 'stripe' | 'cash' | ''
})

// Get competition data
const competitionId = route.params.id as string
const competition = computed(() => competitions.getCompetitionById(competitionId))

// Validation
const isFormValid = computed(() => {
  const { personalInfo, role, agreements, paymentMethod } = form.value
  return (
    // Required fields
    personalInfo.firstName &&
    personalInfo.lastName &&
    personalInfo.email &&
    personalInfo.city &&
    personalInfo.country &&
    // Role selection
    role &&
    // Agreements
    agreements.rules &&
    agreements.photoConsent &&
    // Payment method
    paymentMethod &&
    competition.value?.paymentMethods[paymentMethod]
  )
})

async function handleSubmit() {
  try {
    loading.value = true

    if (!isFormValid.value) {
      $toast.error('Please fill in all required fields')
      return
    }

    await competitions.registerForCompetition(competitionId, {
      ...form.value,
      userId: auth.user?.id
    })

    router.push('/dashboard/my-competitions')
  } catch (e) {
    $toast.error(e instanceof Error ? e.message : 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <div v-if="competition" class="space-y-8">
      <div class="space-y-4">
        <h1 class="text-2xl font-bold">Register for {{ competition.name }}</h1>
        <p class="text-gray-500">
          Please complete your registration below.
        </p>
      </div>

      <RegistrationForm :competition="competition" />
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