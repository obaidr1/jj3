import { defineStore } from 'pinia'
import { useAuth } from '../composables/useAuth'
import { DanceStyle } from '~/types/competition'

interface Competition {
  id: string
  name: string
  date: Date
  location: string
  maxDancers: number // 0 means unlimited
  currentRound: number
  status: 'upcoming' | 'ongoing' | 'completed'
  description: string
  registrationDeadline: {
    date: Date,
    time: string // Format: "HH:mm"
  }
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

export interface CreateCompetitionData {
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

// Test data
const DEFAULT_COMPETITIONS = [
  {
    id: 'test1',
    name: 'Bachata Masters',
    date: new Date('2024-06-15'),
    location: 'Munich',
    danceStyle: DanceStyle.BACHATA,
    status: 'upcoming',
    maxDancers: 100,
    description: 'Join us for the biggest Bachata competition in Munich!',
    registrationDeadline: {
      date: new Date('2024-06-01'),
      time: '23:59'
    },
    entryFee: 50,
    rules: 'Standard competition rules apply',
    rounds: 3,
    organizerId: '1', // matches test user id
    banner: 'https://placehold.co/600x400/png?text=Bachata+Competition',
    paymentMethods: {
      paypal: true,
      stripe: true,
      cash: true
    },
    registrations: [],
    updatedAt: new Date()
  },
  {
    id: 'test2',
    name: 'Salsa Championship',
    date: new Date('2024-07-20'),
    location: 'Berlin',
    danceStyle: DanceStyle.SALSA,
    status: 'upcoming',
    maxDancers: 0, // unlimited
    description: 'The ultimate Salsa showdown!',
    registrationDeadline: {
      date: new Date('2024-07-01'),
      time: '23:59'
    },
    entryFee: 75,
    rules: 'Professional division rules apply',
    rounds: 4,
    organizerId: '1',
    banner: 'https://placehold.co/600x400/png?text=Salsa+Competition',
    paymentMethods: {
      paypal: true,
      stripe: true,
      cash: true
    },
    registrations: [],
    updatedAt: new Date()
  }
]

export const useCompetitions = defineStore('competitions', {
  state: () => ({
    competitions: [] as any[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    organizerCompetitions: (state) => {
      const auth = useAuth()
      return state.competitions.filter(comp => comp.organizerId === auth.user?.id)
    }
  },

  actions: {
    initializeFromStorage() {
      const stored = localStorage.getItem('competitions')
      this.competitions = stored ? JSON.parse(stored) : DEFAULT_COMPETITIONS
      this.saveToStorage()
    },

    saveToStorage() {
      localStorage.setItem('competitions', JSON.stringify(this.competitions))
    },

    getCompetitionById(id: string) {
      try {
        const competition = this.competitions.find(c => c.id === id)
        if (!competition) {
          console.error(`Competition with id ${id} not found. Available IDs:`, 
            this.competitions.map(c => c.id).join(', '))
          return null
        }
        return competition
      } catch (error) {
        console.error('Error getting competition:', error)
        return null
      }
    },

    async fetchCompetitions() {
      // In a real app, this would be an API call
      // For now, we're using the sample data from state
      return this.organizerCompetitions
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
          registrationDeadline: {
            date: new Date(data.registrationDeadline),
            time: '23:59'
          },
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
          registrationDeadline: {
            date: new Date(data.registrationDeadline?.date || currentCompetition.registrationDeadline.date),
            time: data.registrationDeadline?.time || currentCompetition.registrationDeadline.time
          },
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

    migrateExistingDeadlines() {
      this.competitions = this.competitions.map(comp => {
        if (!(comp.registrationDeadline instanceof Object)) {
          return {
            ...comp,
            registrationDeadline: {
              date: new Date(comp.registrationDeadline),
              time: '23:59'
            }
          }
        }
        return comp
      })
      this.saveToStorage()
    },

    async registerForCompetition(competitionId: string, registrationData: any) {
      try {
        const competition = this.getCompetitionById(competitionId)
        if (!competition) {
          throw new Error('Competition not found')
        }

        // Check if registration is still open using the new function
        if (!isRegistrationOpen(competition)) {
          throw new Error('Registration is closed')
        }

        // Check if spots are available
        if (competition.maxDancers > 0 && 
            (competition.registrations?.length || 0) >= competition.maxDancers) {
          throw new Error('Competition is full')
        }

        // Create registration
        const registration = {
          id: Math.random().toString(),
          competitionId,
          userId: registrationData.userId,
          personalInfo: registrationData.personalInfo,
          role: registrationData.role,
          paymentMethod: registrationData.paymentMethod,
          status: 'pending',
          createdAt: new Date()
        }

        // Add to competition registrations
        if (!competition.registrations) {
          competition.registrations = []
        }
        competition.registrations.push(registration)

        // Save to localStorage
        this.saveToStorage()

        return registration
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    }
  }
})

function isRegistrationOpen(competition: Competition): boolean {
  const deadline = new Date(competition.registrationDeadline.date)
  const [hours, minutes] = competition.registrationDeadline.time.split(':')
  deadline.setHours(parseInt(hours), parseInt(minutes))
  return new Date() <= deadline
} 