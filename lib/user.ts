export type UserRole = 'client' | 'talent' | 'admin'

export interface User {
  id: string
  name: string
  initials: string
  role: UserRole
  email?: string
  // Client fields
  company?: string
  clientId?: string
  credits?: number
  // Talent profile fields
  talentRole?: string
  bg?: string
  desc?: string
  dashboardTitle?: string
  communityRole?: string
  color?: string
  featured?: boolean
  image?: string
  rate?: string
  assignedJobSlugs?: string[]
  isOnboarded?: boolean
}

// ─── Client company users ─────────────────────────────────────────────────────
export const clientUsers: User[] = [
  {
    id: 'volks-bank',
    name: 'Volks Bank',
    initials: 'VB',
    role: 'client',
    company: 'Volks Bank',
    clientId: 'volks-bank',
    credits: 8,
  },
  {
    id: 't-finance',
    name: 'T-Finance',
    initials: 'TF',
    role: 'client',
    company: 'T-Finance',
    clientId: 't-finance',
    credits: 5,
  },
  {
    id: 'gridwell',
    name: 'Gridwell',
    initials: 'GW',
    role: 'client',
    company: 'Gridwell',
    clientId: 'gridwell',
    credits: 4,
  },
  {
    id: 'volta-pay',
    name: 'Volta Pay',
    initials: 'VP',
    role: 'client',
    company: 'Volta Pay',
    clientId: 'volta-pay',
    credits: 3,
  },
]

const clientMap = new Map(clientUsers.map(u => [u.id, u]))

export function getClientUser(id: string): User {
  return clientMap.get(id) ?? { id, name: id, initials: id.slice(0, 2).toUpperCase(), role: 'client' }
}

// ─── All platform users (talent operators) ────────────────────────────────────
export const users: User[] = []

// ─── Derived views ────────────────────────────────────────────────────────────
export const talentUsers = users.filter(u => u.role === 'talent')
export const talentRoster = users.filter(u => u.role === 'talent' && u.featured)

// ─── Lookup helper (drop-in replacement for getTalentProfile) ─────────────────
const userMap = new Map(users.map(u => [u.id, u]))

export function getTalentProfile(id: string): User {
  const user = userMap.get(id)
  if (!user) throw new Error(`Unknown user: ${id}`)
  return user
}

// Legacy alias so any code referencing talentProfiles still works
export const talentProfiles = talentUsers
