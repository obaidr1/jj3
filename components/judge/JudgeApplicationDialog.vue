<script setup lang="ts">
import type { JudgeApplication } from '~/types/user'

const props = defineProps<{
  competitionId: string
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: Partial<JudgeApplication>): void
}>()

const competitions = useCompetitions()
const auth = useAuth()

async function handleSubmit(data: Partial<JudgeApplication>) {
  try {
    await competitions.applyAsJudge(props.competitionId, {
      ...data,
      judgeId: auth.user?.id
    })
    emit('update:open', false)
  } catch (error) {
    console.error('Failed to submit application:', error)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Apply as Judge</DialogTitle>
        <DialogDescription>
          Please provide your experience and expertise to be considered as a judge for this competition.
        </DialogDescription>
      </DialogHeader>

      <JudgeApplicationForm
        :competition-id="competitionId"
        @submit="handleSubmit"
        @cancel="emit('update:open', false)"
      />
    </DialogContent>
  </Dialog>
</template> 