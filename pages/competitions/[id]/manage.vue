<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DanceStyle } from '~/types/competition' // Ensure this type is defined
import { useWebSocket } from '~/composables/useWebSocket'
import { ref, computed, watchEffect, watch, onUnmounted } from 'vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()

console.log('Route params:', route.params)

const auth = useAuth()
const competitions = useCompetitions()
const loading = ref(false)

// Add dance styles options
const danceStyles = [
  { label: 'Bachata', value: DanceStyle.BACHATA },
  { label: 'Zouk', value: DanceStyle.ZOUK },
  { label: 'West Coast Swing', value: DanceStyle.WESTCOAST_SWING },
  { label: 'Salsa', value: DanceStyle.SALSA },
  { label: 'Kizomba', value: DanceStyle.KIZOMBA },
  { label: 'Other', value: DanceStyle.OTHER }
]

// Get competition data
const competitionId = route.params.id as string
const competition = computed(() => competitions.getCompetitionById(competitionId))

// Redirect if not authorized
watchEffect(() => {
  if (!auth.isOrganizer) {
    router.push('/dashboard')
    return
  }

  if (!competition.value || competition.value.organizerId !== auth.user?.id) {
    router.push('/dashboard/organizer')
    return
  }

  if (!competition.value) {
    // Possibly fetch from the API if not found in store
    competitions.fetchAllCompetitions().then(() => {
      if (!competitions.getCompetitionById(competitionId)) {
        console.warn("Still not found. Check server data.")
      }
    })
  }
})

// Initialize form with competition data
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

// 1) Create helpers to format local dates & datetimes (no UTC shift).
function formatLocalDate(dateObj: Date): string {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`        // e.g. "2025-03-09"
}

function formatLocalDateTime(dateObj: Date): string {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  const hh = String(dateObj.getHours()).padStart(2, '0')
  const mm = String(dateObj.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${hh}:${mm}` // e.g. "2025-03-09T23:59"
}

// Update form when competition data is available
watchEffect(() => {
  if (competition.value) {
    // Safely parse 'competition.value.date' if it's a string:
    if (typeof competition.value.date === 'string') {
      const parsedDate = new Date(competition.value.date)
      if (!isNaN(parsedDate.getTime())) {
        competition.value.date = parsedDate
      } else {
        competition.value.date = null
      }
    }

    // Likewise, parse 'competition.value.registrationDeadline' if it's a string
    if (typeof competition.value.registrationDeadline === 'string') {
      const parsedDeadline = new Date(competition.value.registrationDeadline)
      if (!isNaN(parsedDeadline.getTime())) {
        competition.value.registrationDeadline = parsedDeadline
      } else {
        competition.value.registrationDeadline = null
      }
    }

    // If date is still not a valid Date, skip .toISOString()
    const validDate =
      competition.value.date instanceof Date &&
      !isNaN(competition.value.date.getTime())

    // Similarly for registrationDeadline
    const validDeadline =
      competition.value.registrationDeadline instanceof Date &&
      !isNaN(competition.value.registrationDeadline.getTime())

    form.value = {
      name: competition.value.name,
      date: validDate
        ? formatLocalDate(competition.value.date)
        : '',
      location: competition.value.location,
      maxDancers: competition.value.maxDancers,
      description: competition.value.description,
      registrationDeadline: validDeadline
        ? formatLocalDateTime(competition.value.registrationDeadline)
        : '',
      entryFee: competition.value.entryFee,
      rules: competition.value.rules,
      rounds: competition.value.rounds,
      danceStyle: competition.value.danceStyle,
      otherDanceStyle: '',
      paymentMethods: {
        paypal: competition.value.paymentMethods.paypal,
        stripe: competition.value.paymentMethods.stripe,
        cash: competition.value.paymentMethods.cash
      },
      banner: competition.value.banner || ''
    }
  }
})

const showOtherDanceStyle = computed(() => {
  return form.value.danceStyle === DanceStyle.OTHER
})

const previewImage = ref(competition.value?.banner || '')

// Optionally store the actual File object:
const bannerFile = ref<File | null>(null)

function handleBannerUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    bannerFile.value = file

    // For local preview only
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Fix the date handling for watchers if needed
const formattedDate = ref('')

watch(
  () => competition.value?.date,
  (newValue) => {
    if (!newValue) return
    try {
      const date = newValue instanceof Date ? newValue : new Date(newValue)
      if (!isNaN(date.getTime())) {
        formattedDate.value = date.toISOString()
      }
    } catch (error) {
      console.warn('Invalid date:', newValue)
    }
  },
  { immediate: true }
)

// Handle the update submission
async function handleSubmit() {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('date', form.value.date)
    formData.append('location', form.value.location)
    formData.append('maxDancers', form.value.maxDancers.toString())
    formData.append('description', form.value.description)
    formData.append(
      'registrationDeadline',
      form.value.registrationDeadline
        ? new Date(form.value.registrationDeadline).toISOString()
        : ''
    )
    formData.append('entryFee', form.value.entryFee.toString())
    formData.append('rules', form.value.rules)
    formData.append('rounds', form.value.rounds.toString())
    formData.append('danceStyle', form.value.danceStyle)
    formData.append('otherDanceStyle', form.value.otherDanceStyle)
    formData.append('paymentMethods', JSON.stringify(form.value.paymentMethods))

    if (bannerFile.value) {
      formData.append('banner', bannerFile.value)
    }

    await competitions.updateCompetition(route.params.id as string, formData)

    // Force the store to refresh so it gets the new banner from the server
    await competitions.fetchAllCompetitions()
    // Alternatively, if you have a dedicated fetchOneCompetition:
    // await competitions.fetchOneCompetition(route.params.id as string)

  } catch (error) {
    console.error('Error updating competition:', error)
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (confirm('Are you sure you want to delete this competition?')) {
    try {
      loading.value = true
      // Add delete functionality to competitions store
      await competitions.deleteCompetition(route.params.id as string)
      router.push('/dashboard/organizer')
    } catch (error) {
      console.error('Failed to delete competition:', error)
    } finally {
      loading.value = false
    }
  }
}

// (Optional) If fetching competition data
const fetchCompetition = async () => {
  try {
    // ... your fetch logic ...
    // Ensure date is properly parsed when receiving data
    if (competition.value?.date) {
      competition.value.date = new Date(competition.value.date)
    }
  } catch (error) {
    console.error('Error fetching competition:', error)
  }
}

// Register the WebSocket in top-level scope
const { ws } = useWebSocket()

// onUnmounted in top-level scope to minimize warnings
onUnmounted(() => {
  console.log('Manage.vue is unmounting...')
})
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <div class="space-y-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Manage Competition</h1>
        <Button variant="destructive" @click="handleDelete">
          Delete Competition
        </Button>
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
              <!-- If you only need date (no time), keep type="date".
                   If you do need time for the event date, switch to type="datetime-local". -->
              <Input
                id="date"
                v-model="form.date"
                type="date"
                required
              />
            </div>

            <div>
              <Label for="registrationDeadline">Registration Deadline</Label>
              <!-- This is already datetime-local to preserve hour/minute -->
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

          <!-- Banner -->
          <div>
            <Label for="banner">Competition Banner</Label>
            <div class="mt-2 space-y-4">
              <div v-if="previewImage" class="w-48 h-48 relative">
                <img
                  :src="previewImage"
                  :alt="form.name"
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
              <Input
                id="banner"
                type="file"
                accept="image/*"
                @change="handleBannerUpload"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4">
            <Button variant="outline" type="button" @click="router.push('/dashboard/organizer')">
              Cancel
            </Button>
            <Button type="submit" :loading="loading">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template> 