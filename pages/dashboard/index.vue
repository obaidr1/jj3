<script setup lang="ts">
const auth = useAuth()
const competitions = useCompetitions()

// Get all competitions
onMounted(() => {
  if (competitions.competitions.length === 0) {
    competitions.initializeFromStorage()
  }
})

// Get user's registered competitions
const registeredCompetitions = computed(() => {
  return competitions.competitions.filter(comp => 
    comp.registrations?.some(reg => reg.userId === auth.user?.id)
  )
})

// Get available competitions (not registered and registration still open)
const availableCompetitions = computed(() => {
  const now = new Date()
  return competitions.competitions.filter(comp => {
    // Check if user is not registered
    const notRegistered = !comp.registrations?.some(reg => reg.userId === auth.user?.id)
    
    // Check if registration is still open
    const deadline = new Date(comp.registrationDeadline.date)
    const [hours, minutes] = comp.registrationDeadline.time.split(':')
    deadline.setHours(parseInt(hours), parseInt(minutes))
    
    return notRegistered && now <= deadline
  })
})

// Get past competitions (registration closed)
const pastCompetitions = computed(() => {
  const now = new Date()
  return competitions.competitions.filter(comp => {
    const deadline = new Date(comp.registrationDeadline.date)
    const [hours, minutes] = comp.registrationDeadline.time.split(':')
    deadline.setHours(parseInt(hours), parseInt(minutes))
    return now > deadline
  })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-12">
    <!-- Registered Competitions -->
    <section>
      <h2 class="text-2xl font-bold mb-6">My Registered Competitions</h2>
      <div v-if="registeredCompetitions.length === 0" class="text-gray-500 text-center py-8">
        You haven't registered for any competitions yet.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CompetitionCard 
          v-for="comp in registeredCompetitions" 
          :key="comp.id"
          :competition="comp"
        />
      </div>
    </section>

    <!-- Available Competitions -->
    <section>
      <h2 class="text-2xl font-bold mb-6">Available Competitions</h2>
      <div v-if="availableCompetitions.length === 0" class="text-gray-500 text-center py-8">
        No available competitions at the moment.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CompetitionCard 
          v-for="comp in availableCompetitions" 
          :key="comp.id"
          :competition="comp"
        />
      </div>
    </section>

    <!-- Past Competitions -->
    <section>
      <h2 class="text-2xl font-bold mb-6">Past Competitions</h2>
      <div v-if="pastCompetitions.length === 0" class="text-gray-500 text-center py-8">
        No past competitions.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CompetitionCard 
          v-for="comp in pastCompetitions" 
          :key="comp.id"
          :competition="comp"
        />
      </div>
    </section>
  </div>
</template> 