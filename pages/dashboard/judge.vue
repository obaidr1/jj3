<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const competitions = useCompetitions()

onMounted(async () => {
  await competitions.fetchJudgeAssignments()
})

const activeAssignments = computed(() => 
  competitions.judgeAssignments.filter(a => 
    ['pending', 'in_progress'].includes(a.status)
  )
)

const completedAssignments = computed(() => 
  competitions.judgeAssignments.filter(a => a.status === 'completed')
)
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-bold">Judging Assignments</h1>

    <LoadingSpinner v-if="competitions.loading" />
    
    <Alert v-if="competitions.error" variant="destructive">
      {{ competitions.error }}
    </Alert>

    <template v-if="!competitions.loading && !competitions.error">
      <div class="space-y-6">
        <h2 class="text-xl font-semibold">Active Assignments</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="assignment in activeAssignments" :key="assignment.id">
            <CardHeader>
              <CardTitle>{{ assignment.competitionName }}</CardTitle>
              <CardDescription>{{ new Date(assignment.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p>Round: {{ assignment.round }}</p>
                <p>Status: {{ assignment.status }}</p>
                <p v-if="assignment.status === 'in_progress'">
                  Progress: {{ assignment.completedPairs }}/{{ assignment.pairsToJudge }} pairs
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                @click="navigateTo(`/competitions/${assignment.competitionId}/judge`)"
              >
                {{ assignment.status === 'pending' ? 'Start Judging' : 'Continue Judging' }}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </template>
  </div>
</template> 