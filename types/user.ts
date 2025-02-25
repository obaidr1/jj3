export enum UserRole {
  DANCER = 'DANCER',
  JUDGE = 'JUDGE',
  ORGANIZER = 'ORGANIZER'
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface Judge extends User {
  competitions: string[] // Competition IDs they're judging
  isHeadJudge?: boolean
}

export interface Dancer extends User {
  competitions: string[] // Competition IDs they're registered in
  partners?: string[] // Previous partner IDs
  rankings?: Record<string, number> // Competition ID -> Ranking
}

export interface Organizer extends User {
  competitions: string[] // Competition IDs they've created
} 