<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { compressImage } from '~/utils/imageUtils'
import { ErrorCode, createError, handleError } from '~/utils/errorUtils'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'organizer']
})

const auth = useAuth()
const router = useRouter()
const competitions = useCompetitions()

// Double check role
if (auth.user?.role !== 'ORGANIZER') {
  router.push('/dashboard')
}

enum DanceStyle {
  BACHATA = 'BACHATA',
  ZOUK = 'ZOUK',
  WESTCOAST_SWING = 'WESTCOAST_SWING',
  SALSA = 'SALSA',
  KIZOMBA = 'KIZOMBA',
  OTHER = 'OTHER'
}

const danceStyles = [
  { label: 'Bachata', value: DanceStyle.BACHATA },
  { label: 'Zouk', value: DanceStyle.ZOUK },
  { label: 'West Coast Swing', value: DanceStyle.WESTCOAST_SWING },
  { label: 'Salsa', value: DanceStyle.SALSA },
  { label: 'Kizomba', value: DanceStyle.KIZOMBA },
  { label: 'Other', value: DanceStyle.OTHER }
]

// Add rounds options
const roundOptions = [
  { label: '1 Round', value: 1 },
  { label: '2 Rounds', value: 2 },
  { label: '3 Rounds', value: 3 }
]

const form = ref({
  name: '',
  date: '',
  location: '',
  maxDancers: 0, // Unlimited
  description: '',
  registrationDeadline: '',
  entryFee: 0,
  rules: '',
  rounds: 3,
  banner: null as string | null,
  danceStyle: DanceStyle.BACHATA,
  otherDanceStyle: '',
  paymentMethods: {
    paypal: false,
    stripe: false,
    cash: false
  }
})

const loading = ref(false)
const error = ref<AppError | null>(null)

const showOtherDanceStyle = computed(() => {
  return form.value.danceStyle === DanceStyle.OTHER
})

async function handleBannerUpload(event: Event) {
  error.value = null
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      error.value = createError(ErrorCode.FILE_TOO_LARGE)
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      error.value = createError(ErrorCode.FILE_INVALID_TYPE)
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const base64String = e.target?.result as string
        const compressedImage = await compressImage(base64String)
        form.value.banner = compressedImage
      } catch (e) {
        error.value = createError(ErrorCode.FILE_UPLOAD_FAILED)
      }
    }
    reader.readAsDataURL(file)
  }
}

async function handleSubmit() {
  try {
    error.value = null
    loading.value = true

    await competitions.createCompetition({
      name: form.value.name,
      date: form.value.date,
      location: form.value.location,
      maxDancers: form.value.maxDancers,
      description: form.value.description,
      registrationDeadline: form.value.registrationDeadline,
      entryFee: form.value.entryFee,
      rules: form.value.rules,
      rounds: form.value.rounds,
      banner: form.value.banner,
      danceStyle: form.value.danceStyle === DanceStyle.OTHER 
        ? form.value.otherDanceStyle 
        : form.value.danceStyle,
      paymentMethods: form.value.paymentMethods
    })
    
    router.push('/dashboard/organizer')
  } catch (e) {
    error.value = handleError(e)
  } finally {
    loading.value = false
  }
}
</script>

<style>
.select-content {
  @apply bg-white dark:bg-gray-900;
}
</style>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <div class="space-y-8">
      <!-- Show error if exists -->
      <ErrorMessage v-if="error" :error="error" />

      <div>
        <h1 class="text-2xl font-bold">Create New Competition</h1>
        <p class="text-gray-500 mt-2">Fill in the details for your new Jack & Jill competition.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <!-- Competition Banner -->
          <div>
            <Label for="banner">Competition Banner (Optional)</Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              @change="handleBannerUpload"
              class="mt-1"
            />
          </div>

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

            <!-- Other Dance Style input -->
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

          <div>
            <Label for="rounds">Number of Rounds</Label>
            <Select v-model="form.rounds">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select number of rounds" />
              </SelectTrigger>
              <SelectContent class="select-content">
                <SelectItem 
                  v-for="option in roundOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            Create Competition
          </Button>
        </div>
      </form>
    </div>
  </div>
</template> 