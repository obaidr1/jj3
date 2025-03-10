<script setup lang="ts">
import { ref } from 'vue'
import type { JudgeApplication } from '~/types/user'

const props = defineProps<{
  competitionId: string
}>()

const emit = defineEmits<{
  (e: 'submit', data: Partial<JudgeApplication>): void
  (e: 'cancel'): void
}>()

const form = ref({
  experience: '',
  specialties: [] as string[],
  bio: ''
})

const loading = ref(false)
const error = ref('')

const specialtyOptions = [
  'Salsa',
  'Bachata',
  'Kizomba',
  'Zouk',
  'Tango',
  'Hip-Hop',
  'Ballet',
  'Contemporary Dance',
  'Jazz Dance'
]

async function handleSubmit() {
  try {
    loading.value = true
    error.value = ''

    if (!form.value.experience) {
      error.value = 'Experience is required'
      return
    }

    if (form.value.specialties.length === 0) {
      error.value = 'Please select at least one specialty'
      return
    }

    if (!form.value.bio) {
      error.value = 'Bio is required'
      return
    }

    emit('submit', {
      ...form.value,
      competitionId: props.competitionId
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="error" class="p-3 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <div class="space-y-4">
      <div>
        <Label for="experience">Years of Experience</Label>
        <Input 
          id="experience" 
          v-model="form.experience" 
          type="text" 
          placeholder="e.g., 5 years of judging experience"
          required
        />
      </div>

      <div>
        <Label>Specialties</Label>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <div v-for="specialty in specialtyOptions" :key="specialty" class="flex items-center space-x-2">
            <Checkbox 
              :id="specialty"
              :checked="form.specialties.includes(specialty)"
              @update:checked="(checked) => {
                if (checked) {
                  form.specialties.push(specialty)
                } else {
                  form.specialties = form.specialties.filter(s => s !== specialty)
                }
              }"
            />
            <Label :for="specialty" class="cursor-pointer">{{ specialty }}</Label>
          </div>
        </div>
      </div>

      <div>
        <Label for="bio">Bio</Label>
        <Textarea 
          id="bio" 
          v-model="form.bio" 
          placeholder="Tell us about your judging experience and expertise..."
          required
        />
      </div>
    </div>

    <div class="flex justify-end space-x-4">
      <Button type="button" variant="outline" @click="emit('cancel')">
        Cancel
      </Button>
      <Button type="submit" :loading="loading">
        Submit Application
      </Button>
    </div>
  </form>
</template> 