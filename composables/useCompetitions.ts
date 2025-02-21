import { defineStore } from 'pinia'

interface Competition {
  id: string
  name: string
  date: string
  status: string
  [key: string]: any
}

interface CompetitionsState {
  dancerCompetitions: Competition[]
  organizerCompetitions: Competition[]
  judgeAssignments: Competition[]
  loading: boolean
  error: string | null
}

export const useCompetitions = defineStore('competitions', {
  state: (): CompetitionsState => ({
    dancerCompetitions: [],
    organizerCompetitions: [],
    judgeAssignments: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchDancerCompetitions() {
      this.loading = true
      this.error = null
      try {
        this.dancerCompetitions = await $fetch('/api/competitions/dancer')
      } catch (error) {
        this.error = 'Failed to fetch competitions'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchOrganizerCompetitions() {
      this.loading = true
      this.error = null
      try {
        this.organizerCompetitions = await $fetch('/api/competitions/organizer')
      } catch (error) {
        this.error = 'Failed to fetch competitions'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchJudgeAssignments() {
      this.loading = true
      this.error = null
      try {
        this.judgeAssignments = await $fetch('/api/competitions/judge')
      } catch (error) {
        this.error = 'Failed to fetch assignments'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}) 