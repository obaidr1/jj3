<script setup lang="ts">
import OrganizerSubNav from '~/components/organizer/OrganizerSubNav.vue'
import type { User } from '~/types/user'
import type { Registration } from '~/composables/useCompetitions'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const auth = useAuth()
const competitions = useCompetitions()

// Get all dancers from organizer's competitions
const registeredDancers = computed(() => {
  const dancers = new Set<{
    id: string
    name: string
    email: string
    competitionName: string
    registrationDate: Date
  }>()
  
  competitions.organizerCompetitions.forEach(comp => {
    comp.registrations?.forEach((reg: Registration) => {
      if (reg.userId) {
        const dancer = auth.getUserById(reg.userId) as User
        if (dancer) {
          dancers.add({
            ...dancer,
            competitionName: comp.name,
            registrationDate: reg.createdAt
          })
        }
      }
    })
  })
  
  return Array.from(dancers)
})

onMounted(() => {
  competitions.fetchCompetitions()
})
</script>

<template>
  <div>
    <OrganizerSubNav />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-semibold">Registered Dancers</h1>
          <p class="text-gray-500">View all dancers registered in your competitions</p>
        </div>
      </div>

      <!-- Dancers List -->
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Competition
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="dancer in registeredDancers" :key="dancer.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ dancer.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ dancer.competitionName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ new Date(dancer.registrationDate).toLocaleDateString() }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ dancer.email }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template> 