import { defineStore } from 'pinia'
import { useAuth } from '../composables/useAuth'

interface Competition {
  id: string
  name: string
  date: Date
  location: string
  maxDancers: number // 0 means unlimited
  currentRound: number
  status: 'upcoming' | 'ongoing' | 'completed'
  description: string
  registrationDeadline: Date
  entryFee: number
  rules: string
  rounds: number
  organizerId: string
  banner?: string // base64 encoded image
  danceStyle: string
  paymentMethods: {
    paypal: boolean
    stripe: boolean
    cash: boolean
  }
  updatedAt: Date
  registrations?: Registration[]
}

interface Registration {
  id: string
  userId: string
  competitionId: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    city: string
    country: string
    instagram?: string
  }
  role: 'leader' | 'follower'
  paymentMethod: 'paypal' | 'stripe' | 'cash'
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date
}

interface CreateCompetitionData {
  name: string
  date: string
  location: string
  maxDancers: number
  description: string
  registrationDeadline: string
  entryFee: number
  rules: string
  rounds: number
  banner?: string
  danceStyle: string
  paymentMethods: {
    paypal: boolean
    stripe: boolean
    cash: boolean
  }
}

// Simulate database storage
const COMPETITIONS_STORAGE_KEY = 'competitions'

export const useCompetitions = defineStore('competitions', {
  state: () => ({
    competitions: [] as Competition[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    // Add getter for organizer's competitions
    organizerCompetitions: (state) => {
      const auth = useAuth()
      return state.competitions.filter(comp => comp.organizerId === auth.user?.id)
    }
  },

  actions: {
    // Load competitions from localStorage
    initializeFromStorage() {
      const stored = localStorage.getItem(COMPETITIONS_STORAGE_KEY)
      if (stored) {
        const competitions = JSON.parse(stored)
        // Convert string dates back to Date objects and ensure payment methods are booleans
        this.competitions = competitions.map((comp: Competition) => ({
          ...comp,
          date: new Date(comp.date),
          registrationDeadline: new Date(comp.registrationDeadline),
          paymentMethods: {
            paypal: Boolean(comp.paymentMethods?.paypal),
            stripe: Boolean(comp.paymentMethods?.stripe),
            cash: Boolean(comp.paymentMethods?.cash)
          }
        }))
      }
    },

    // Save competitions to localStorage
    saveToStorage() {
      try {
        localStorage.setItem(COMPETITIONS_STORAGE_KEY, JSON.stringify(this.competitions))
      } catch (error) {
        console.error('Failed to save to storage:', error)
        // If storage fails, try to remove old items or compress data
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          // Remove old competitions or compress images
          this.cleanupStorage()
        }
      }
    },

    cleanupStorage() {
      try {
        // Keep only the most recent competitions
        const maxCompetitions = 10
        if (this.competitions.length > maxCompetitions) {
          this.competitions = this.competitions.slice(-maxCompetitions)
        }
        // Try saving again
        localStorage.setItem(COMPETITIONS_STORAGE_KEY, JSON.stringify(this.competitions))
      } catch (error) {
        console.error('Failed to cleanup storage:', error)
      }
    },

    async fetchCompetitions() {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 100)) // Simulate network delay
        this.initializeFromStorage()
      } catch (error) {
        this.error = 'Failed to fetch competitions'
      } finally {
        this.loading = false
      }
    },

    async createCompetition(data: CreateCompetitionData) {
      this.loading = true
      try {
        const auth = useAuth()
        
        const newCompetition: Competition = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name,
          date: new Date(data.date),
          location: data.location,
          maxDancers: data.maxDancers,
          currentRound: 0,
          status: 'upcoming',
          description: data.description,
          registrationDeadline: new Date(data.registrationDeadline),
          entryFee: data.entryFee,
          rules: data.rules,
          rounds: data.rounds,
          organizerId: auth.user?.id || '1',
          banner: data.banner || 'https://placehold.co/600x400/png?text=Dance+Competition',
          danceStyle: data.danceStyle,
          paymentMethods: {
            paypal: Boolean(data.paymentMethods?.paypal),
            stripe: Boolean(data.paymentMethods?.stripe),
            cash: Boolean(data.paymentMethods?.cash)
          },
          updatedAt: new Date()
        }

        // Add to state
        this.competitions.push(newCompetition)
        
        // Save to localStorage
        this.saveToStorage()
        
        return newCompetition
      } catch (error) {
        this.error = 'Failed to create competition'
        throw error
      } finally {
        this.loading = false
      }
    },

    getCompetitionById(id: string): Competition | undefined {
      const competition = this.competitions.find(comp => comp.id === id)
      console.log('Retrieved competition:', competition)
      return competition
    },

    async updateCompetition(id: string, data: Partial<CreateCompetitionData>) {
      console.log('Updating competition with data:', data)
      this.loading = true
      try {
        const index = this.competitions.findIndex(comp => comp.id === id)
        if (index === -1) {
          throw new Error('Competition not found')
        }

        const currentCompetition = this.competitions[index]

        // Create updated competition object
        const updatedCompetition: Competition = {
          ...currentCompetition,
          name: data.name || currentCompetition.name,
          date: new Date(data.date || currentCompetition.date),
          location: data.location || currentCompetition.location,
          maxDancers: data.maxDancers ?? currentCompetition.maxDancers,
          description: data.description || currentCompetition.description,
          registrationDeadline: new Date(data.registrationDeadline || currentCompetition.registrationDeadline),
          entryFee: data.entryFee ?? currentCompetition.entryFee,
          rules: data.rules || currentCompetition.rules,
          rounds: data.rounds ?? currentCompetition.rounds,
          danceStyle: data.danceStyle || currentCompetition.danceStyle,
          paymentMethods: {
            paypal: data.paymentMethods?.paypal || false,
            stripe: data.paymentMethods?.stripe || false,
            cash: data.paymentMethods?.cash || false
          },
          updatedAt: new Date()
        }

        // Update in state
        this.competitions[index] = updatedCompetition

        // Save to localStorage
        this.saveToStorage()

        return updatedCompetition
      } catch (error) {
        this.error = 'Failed to update competition'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCompetition(id: string) {
      this.loading = true
      try {
        const index = this.competitions.findIndex(comp => comp.id === id)
        if (index === -1) {
          throw new Error('Competition not found')
        }

        // Remove from state
        this.competitions.splice(index, 1)

        // Save to localStorage
        this.saveToStorage()
      } catch (error) {
        this.error = 'Failed to delete competition'
        throw error
      } finally {
        this.loading = false
      }
    },

    async registerForCompetition(competitionId: string, data: any) {
      try {
        const competition = this.getCompetitionById(competitionId)
        if (!competition) {
          throw new Error('Competition not found')
        }

        // Check if registration is still open
        if (new Date() > new Date(competition.registrationDeadline)) {
          throw new Error('Registration closed')
        }

        // Check if spots are available
        if (competition.maxDancers > 0 && 
            (competition.registrations?.length || 0) >= competition.maxDancers) {
          throw new Error('Competition is full')
        }

        // Check if user is already registered
        if (competition.registrations?.some(reg => reg.userId === data.userId)) {
          throw new Error('Already registered for this competition')
        }

        const registration = {
          id: Math.random().toString(36).substr(2, 9),
          userId: data.userId,
          competitionId,
          personalInfo: data.personalInfo,
          role: data.role,
          paymentMethod: data.paymentMethod,
          status: 'pending',
          createdAt: new Date()
        }

        // Initialize registrations array if it doesn't exist
        if (!competition.registrations) {
          competition.registrations = []
        }

        // Add registration
        competition.registrations.push(registration)

        // Save to storage
        this.saveToStorage()

        return registration
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    }
  }
}) 