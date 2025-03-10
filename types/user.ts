export enum UserRole {
  DANCER = 'DANCER',
  ORGANIZER = 'ORGANIZER',
  JUDGE = 'JUDGE'
}

export interface PersonalInfo {
  phone: string
  city: string
  country: string
  instagram?: string
}

export interface Agreements {
  rules: boolean
  photoConsent: boolean
}

export interface RegistrationForm {
  name: string
  email: string
  password: string
  role: UserRole
  personalInfo: PersonalInfo
  agreements: Agreements
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  personalInfo: PersonalInfo
  createdAt: string
  updatedAt: string
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