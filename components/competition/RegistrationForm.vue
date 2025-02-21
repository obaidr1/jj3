<script setup lang="ts">
const props = defineProps<{
  competition: Competition
}>()

const auth = useAuth()
const competitions = useCompetitions()
const router = useRouter()
const { $toast } = useNuxtApp()

const form = ref({
  role: '' as 'leader' | 'follower',
  paymentMethod: '' as 'stripe' | 'paypal' | 'cash'
})

const loading = ref(false)

async function handleSubmit() {
  try {
    loading.value = true

    if (!form.value.role || !form.value.paymentMethod) {
      $toast.error('Please select both role and payment method')
      return
    }

    const registration = await competitions.registerForCompetition(props.competition.id, {
      userId: auth.user?.id,
      role: form.value.role,
      paymentMethod: form.value.paymentMethod,
      personalInfo: {
        firstName: auth.user?.name.split(' ')[0] || '',
        lastName: auth.user?.name.split(' ')[1] || '',
        email: auth.user?.email || '',
      }
    })

    $toast.success('Registration successful!')
    await router.push('/dashboard/my-competitions')
  } catch (e) {
    console.error('Registration error:', e)
    $toast.error(e instanceof Error ? e.message : 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Role Selection -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Role Selection</h2>
      <RadioGroup v-model="form.role" required>
        <div class="space-y-2">
          <RadioGroupItem value="leader">
            <Label>Leader</Label>
          </RadioGroupItem>
          <RadioGroupItem value="follower">
            <Label>Follower</Label>
          </RadioGroupItem>
        </div>
      </RadioGroup>
    </div>

    <!-- Payment Method -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Payment Method</h2>
      <RadioGroup v-model="form.paymentMethod" required>
        <div class="space-y-2">
          <RadioGroupItem 
            v-if="competition.paymentMethods.stripe" 
            value="stripe"
          >
            <Label>Credit Card</Label>
          </RadioGroupItem>
          <RadioGroupItem 
            v-if="competition.paymentMethods.paypal" 
            value="paypal"
          >
            <Label>PayPal</Label>
          </RadioGroupItem>
          <RadioGroupItem 
            v-if="competition.paymentMethods.cash" 
            value="cash"
          >
            <Label>Cash</Label>
          </RadioGroupItem>
        </div>
      </RadioGroup>
    </div>

    <!-- Submit Button -->
    <Button
      type="submit"
      class="w-full"
      :loading="loading"
    >
      Complete Registration
    </Button>
  </form>
</template> 