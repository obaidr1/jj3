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
import { DanceStyle } from '~/types/competition' // You might need to create this

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

// Update form when competition data is available
watchEffect(() => {
  if (competition.value) {
    form.value = {
      name: competition.value.name,
      date: competition.value.date.toISOString().split('T')[0],
      location: competition.value.location,
      maxDancers: competition.value.maxDancers,
      description: competition.value.description,
      registrationDeadline: competition.value.registrationDeadline.toISOString().split('T')[0],
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

function handleBannerUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string
      form.value.banner = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function handleSubmit() {
  try {
    loading.value = true

    const updateData = {
      name: form.value.name,
      date: form.value.date,
      location: form.value.location,
      maxDancers: form.value.maxDancers,
      description: form.value.description,
      registrationDeadline: form.value.registrationDeadline,
      entryFee: form.value.entryFee,
      rules: form.value.rules,
      rounds: form.value.rounds,
      danceStyle: form.value.danceStyle === DanceStyle.OTHER 
        ? form.value.otherDanceStyle 
        : form.value.danceStyle,
      paymentMethods: {
        paypal: Boolean(form.value.paymentMethods.paypal),
        stripe: Boolean(form.value.paymentMethods.stripe),
        cash: Boolean(form.value.paymentMethods.cash)
      },
      banner: form.value.banner
    }
    
    await competitions.updateCompetition(route.params.id as string, updateData)
    router.push('/dashboard/organizer')
  } catch (error) {
    console.error('Failed to update competition:', error)
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
                type="date"
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
                <Checkbox
                  id="paypal"
                  v-model="form.paymentMethods.paypal"
                />
                <Label for="paypal" class="ml-2">PayPal</Label>
              </div>
              <div class="flex items-center">
                <Checkbox
                  id="stripe"
                  v-model="form.paymentMethods.stripe"
                />
                <Label for="stripe" class="ml-2">Stripe</Label>
              </div>
              <div class="flex items-center">
                <Checkbox
                  id="cash"
                  v-model="form.paymentMethods.cash"
                />
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

          <div class="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              type="button"
              @click="router.push('/dashboard/organizer')"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              :loading="loading"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template> 