<script setup lang="ts">
import { DanceStyle } from '~/types/competition'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const router = useRouter()
const competitions = useCompetitions()

// Initialize form data
const form = ref({
  name: '',
  date: '',
  location: '',
  maxDancers: 0,
  description: '',
  registrationDeadline: '',
  entryFee: 0,
  rules: '',
  rounds: 3,
  danceStyle: DanceStyle.BACHATA,
  otherDanceStyle: '',
  paymentMethods: {
    paypal: false,
    stripe: false,
    cash: false
  },
  banner: ''
})

// Add dance styles options
const danceStyles = [
  { label: 'Bachata', value: DanceStyle.BACHATA },
  { label: 'Zouk', value: DanceStyle.ZOUK },
  { label: 'West Coast Swing', value: DanceStyle.WESTCOAST_SWING },
  { label: 'Salsa', value: DanceStyle.SALSA },
  { label: 'Kizomba', value: DanceStyle.KIZOMBA },
  { label: 'Other', value: DanceStyle.OTHER }
]

const showOtherDanceStyle = computed(() => {
  return form.value.danceStyle === DanceStyle.OTHER
})

const loading = ref(false)

// Handle form submission
async function handleSubmit() {
  loading.value = true
  try {
    const competition = await competitions.createCompetition(form.value)
    router.push(`/competitions/${competition.id}/manage`)
  } catch (error) {
    console.error('Failed to create competition:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <div class="space-y-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Create Competition</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <!-- Name field -->
          <div>
            <Label for="name">Competition Name</Label>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Summer Dance Off 2024"
            />
          </div>

          <!-- Dance Style -->
          <div>
            <Label for="danceStyle">Dance Style</Label>
            <Select v-model="form.danceStyle">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a dance style" />
              </SelectTrigger>
              <SelectContent class="select-content">
                <SelectItem
                  v-for="style in danceStyles"
                  :key="style.value"
                  :value="style.value"
                >
                  {{ style.label }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              v-if="showOtherDanceStyle"
              v-model="form.otherDanceStyle"
              type="text"
              placeholder="Enter dance style"
              required
              class="mt-2"
            />
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="date">Event Date</Label>
              <Input
                id="date"
                v-model="form.date"
                type="date"
                required
              />
            </div>

            <div>
              <Label for="registrationDeadline">Registration Deadline</Label>
              <Input
                id="registrationDeadline"
                v-model="form.registrationDeadline"
                type="datetime-local"
                required
              />
            </div>
          </div>

          <!-- Location -->
          <div>
            <Label for="location">Location</Label>
            <Input
              id="location"
              v-model="form.location"
              type="text"
              required
              placeholder="Dance Studio A, City"
            />
          </div>

          <!-- Entry Fee -->
          <div>
            <Label for="entryFee">Entry Fee ($)</Label>
            <Input
              id="entryFee"
              v-model="form.entryFee"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>

          <!-- Payment Methods -->
          <div>
            <Label class="block mb-2">Payment Methods</Label>
            <div class="space-y-2">
              <div class="flex items-center">
                <Checkbox id="paypal" v-model="form.paymentMethods.paypal" />
                <Label for="paypal" class="ml-2">PayPal</Label>
              </div>
              <div class="flex items-center">
                <Checkbox id="stripe" v-model="form.paymentMethods.stripe" />
                <Label for="stripe" class="ml-2">Stripe</Label>
              </div>
              <div class="flex items-center">
                <Checkbox id="cash" v-model="form.paymentMethods.cash" />
                <Label for="cash" class="ml-2">Cash Payment</Label>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Provide details about your competition..."
              required
            />
          </div>

          <!-- Rules -->
          <div>
            <Label for="rules">Rules & Guidelines</Label>
            <Textarea
              id="rules"
              v-model="form.rules"
              rows="4"
              placeholder="List the competition rules and guidelines..."
              required
            />
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4">
            <Button variant="outline" type="button" @click="router.push('/dashboard/organizer')">
              Cancel
            </Button>
            <Button type="submit" :loading="loading">
              Create Competition
            </Button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template> 