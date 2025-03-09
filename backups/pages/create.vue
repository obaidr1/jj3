<script setup lang="ts">
import { DanceStyle } from '~/types/competition'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const router = useRouter()
const competitions = useCompetitions()
const loading = ref(false)
const error = ref<string | null>(null)

const form = ref({
  name: '',
  date: '',
  location: '',
  maxDancers: 0,
  description: '',
  registrationDeadline: {
    date: '',
    time: '23:59'
  },
  entryFee: 0,
  rules: '',
  rounds: 1,
  danceStyle: DanceStyle.BACHATA,
  paymentMethods: {
    paypal: false,
    stripe: false,
    cash: true
  }
})

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null

    await competitions.createCompetition(form.value)
    router.push('/dashboard/organizer')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create competition'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Create Competition</h1>
    </div>

    <Alert v-if="error" variant="destructive">
      {{ error }}
    </Alert>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Basic Info -->
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Competition Name</Label>
            <Input id="name" v-model="form.name" required />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="date">Date</Label>
              <Input id="date" v-model="form.date" type="date" required />
            </div>
            <div class="space-y-2">
              <Label for="location">Location</Label>
              <Input id="location" v-model="form.location" required />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="danceStyle">Dance Style</Label>
            <Select v-model="form.danceStyle" required>
              <SelectTrigger>
                <SelectValue placeholder="Select dance style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="DanceStyle.BACHATA">Bachata</SelectItem>
                <SelectItem :value="DanceStyle.SALSA">Salsa</SelectItem>
                <SelectItem :value="DanceStyle.KIZOMBA">Kizomba</SelectItem>
                <SelectItem :value="DanceStyle.ZOUK">Zouk</SelectItem>
                <SelectItem :value="DanceStyle.WESTCOAST_SWING">West Coast Swing</SelectItem>
                <SelectItem :value="DanceStyle.OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <!-- Registration Details -->
      <Card>
        <CardHeader>
          <CardTitle>Registration Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="maxDancers">Maximum Dancers (0 for unlimited)</Label>
              <Input 
                id="maxDancers" 
                v-model="form.maxDancers" 
                type="number" 
                min="0" 
                required 
              />
            </div>
            <div class="space-y-2">
              <Label for="entryFee">Entry Fee (€)</Label>
              <Input 
                id="entryFee" 
                v-model="form.entryFee" 
                type="number" 
                min="0" 
                required 
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="deadline">Registration Deadline Date</Label>
              <Input 
                id="deadline" 
                v-model="form.registrationDeadline.date" 
                type="date" 
                required 
              />
            </div>
            <div class="space-y-2">
              <Label for="deadlineTime">Registration Deadline Time</Label>
              <Input 
                id="deadlineTime" 
                v-model="form.registrationDeadline.time" 
                type="time" 
                required 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Competition Details -->
      <Card>
        <CardHeader>
          <CardTitle>Competition Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Textarea 
              id="description" 
              v-model="form.description" 
              rows="4" 
              required 
            />
          </div>

          <div class="space-y-2">
            <Label for="rules">Rules</Label>
            <Textarea 
              id="rules" 
              v-model="form.rules" 
              rows="4" 
              required 
            />
          </div>

          <div class="space-y-2">
            <Label for="rounds">Number of Rounds</Label>
            <Input 
              id="rounds" 
              v-model="form.rounds" 
              type="number" 
              min="1" 
              required 
            />
          </div>
        </CardContent>
      </Card>

      <!-- Payment Methods -->
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center space-x-2">
            <Checkbox 
              id="cash"
              v-model="form.paymentMethods.cash"
            />
            <Label for="cash">Cash Payment</Label>
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox 
              id="paypal"
              v-model="form.paymentMethods.paypal"
              disabled
            />
            <Label for="paypal">PayPal (Coming Soon)</Label>
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox 
              id="stripe"
              v-model="form.paymentMethods.stripe"
              disabled
            />
            <Label for="stripe">Credit Card (Coming Soon)</Label>
          </div>
        </CardContent>
      </Card>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <Button 
          type="submit" 
          size="lg"
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? 'Creating...' : 'Create Competition' }}
        </Button>
      </div>
    </form>
  </div>
</template> 