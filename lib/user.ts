export type UserRole = 'client' | 'talent'

export interface User {
  id: string
  name: string
  initials: string
  role: UserRole
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
}

// ─── Client company users ─────────────────────────────────────────────────────
export const clientUsers: User[] = [
  { id: 'volta-pay',     name: 'Volta Pay',     initials: 'VP', role: 'client', company: 'Volta Pay', image: '/images/clients/voltapay.png' },
  { id: 't-finance',     name: 'T-Finance',     initials: 'TF', role: 'client', company: 'T-Finance' },
  { id: 'gridwell',      name: 'GridWell',      initials: 'GW', role: 'client', company: 'GridWell' },
  { id: 'stealth-co',    name: 'Stealth Co.',   initials: 'SC', role: 'client', company: 'Stealth Co.' },
  { id: 'wazobia-foods', name: 'Wazobia Foods', initials: 'WF', role: 'client', company: 'Wazobia Foods' },
  { id: 'volks-bank',    name: 'Volks Bank',    initials: 'VB', role: 'client', company: 'Volks Bank' },
  { id: 'eazebank',      name: 'EazeBank',      initials: 'EB', role: 'client', company: 'EazeBank' },
]

const clientMap = new Map(clientUsers.map(u => [u.id, u]))

export function getClientUser(id: string): User {
  const user = clientMap.get(id)
  if (!user) throw new Error(`Unknown client: ${id}`)
  return user
}

// ─── Current session (mock auth) ──────────────────────────────────────────────
export const currentUser: User = {
  id: 'jide-p',
  name: 'Jide',
  initials: 'JP',
  role: 'client',
  company: 'Volta Pay',
  clientId: 'volta-pay',
  credits: 3,
  assignedJobSlugs: [
    'volks-bank-loyalty-systems',
    't-finance-retention-sprints',
    'volta-pay-nigeria-entry',
  ],
}

// ─── All platform users (talent operators) ────────────────────────────────────
export const users: User[] = [
  {
    id: 'tunde-a',
    name: 'Tunde A.',
    initials: 'TA',
    role: 'talent',
    talentRole: 'Commercial Strategy Lead',
    bg: 'Formerly at McKinsey & Company',
    desc: 'Designs go-to-market strategies for pan-African fintech expansions.',
    featured: true,
    image: '/images/talent/Tunde A.png',
    rate: '$150 - $220/hr',
  },
  {
    id: 'sarah-m',
    name: 'Wanjiku Mwangi',
    initials: 'WM',
    role: 'talent',
    talentRole: 'Revenue Operations Director',
    bg: 'Formerly at Safaricom',
    desc: 'Builds revenue operations systems for enterprise sales teams across East Africa.',
    featured: true,
    image: '/images/talent/Sarah M.png',
    rate: '$140 - $200/hr',
  },
  {
    id: 'david-o',
    name: 'Kwame Mensah',
    initials: 'KM',
    role: 'talent',
    talentRole: 'Market Entry Specialist',
    bg: 'Formerly at KPMG Ghana',
    desc: 'Navigates regulatory, partner, and public-sector pathways for West African launches.',
    featured: true,
    image: '/images/talent/David O.png',
    rate: '$120 - $180/hr',
  },
  {
    id: 'amira-h',
    name: 'Awa Kone',
    initials: 'AK',
    role: 'talent',
    talentRole: 'Brand & Comms Architect',
    bg: 'Abidjan brand operator network',
    desc: 'Translates global brand equity into localized campaigns for Francophone markets.',
    featured: true,
    image: '/images/talent/Amira H.png',
    rate: '$120 - $160/hr',
  },
  {
    id: 'james-k',
    name: 'Thandi Mokoena',
    initials: 'TM',
    role: 'talent',
    talentRole: 'Growth Marketing Lead',
    bg: 'South Africa growth operator network',
    desc: 'Drives customer acquisition and performance marketing across high-volume consumer channels.',
    featured: true,
    image: '/images/talent/James K.png',
    rate: '$130 - $190/hr',
  },
  {
    id: 'elena-r',
    name: 'Nandi Khumalo',
    initials: 'NK',
    role: 'talent',
    talentRole: 'Strategic Partnerships',
    bg: 'Formerly at Standard Bank',
    desc: 'Builds high-trust corporate networks to accelerate B2B distribution.',
    featured: true,
    image: '/images/talent/Elena R.png',
    rate: '$140 - $210/hr',
  },
  {
    id: 'amara-nwosu',
    name: 'Amara Nwosu',
    initials: 'AN',
    role: 'talent',
    talentRole: 'Growth Architect',
    bg: 'Lagos operator network',
    desc: 'Builds market-specific growth systems for early and expansion-stage companies.',
    dashboardTitle: 'Growth Architect - Lagos',
    color: 'bg-accent',
    rate: '$100 - $150/hr',
  },
  {
    id: 'tobi-adeyemi',
    name: 'Tobi Adeyemi',
    initials: 'TA',
    role: 'talent',
    talentRole: 'Fintech Commercial Lead',
    bg: 'Fintech operator network',
    desc: 'Leads commercial strategy and regulated-market growth for fintech teams.',
    dashboardTitle: 'Fintech Commercial Lead',
    color: 'bg-primary',
    rate: '$150 - $200/hr',
  },
  {
    id: 'yetunde-bello',
    name: 'Yetunde Bello',
    initials: 'YB',
    role: 'talent',
    talentRole: 'Growth Lead',
    bg: 'Market entry operator',
    desc: 'Turns local trust signals and partnership networks into launch momentum.',
    communityRole: 'Growth Lead - 4 days ago',
    rate: '$110 - $160/hr',
  },
  {
    id: 'daniel-osei',
    name: 'Daniel Osei',
    initials: 'DO',
    role: 'talent',
    talentRole: 'Strategy Lead',
    bg: 'Growth strategy operator',
    desc: 'Clarifies strategic briefs and turns ambiguous growth problems into executable work.',
    communityRole: 'Strategy - 2 days ago',
    image: '/images/talent/Daniel Osei.png',
    rate: '$140 - $190/hr',
  },
  {
    id: 'kemi-adaora',
    name: 'Kemi Adaora',
    initials: 'KA',
    role: 'talent',
    talentRole: 'Brand Systems Lead',
    bg: 'Consumer trust strategist',
    desc: 'Designs market-specific brand systems for consumer growth across African markets.',
    communityRole: 'Brand Systems - 1 day ago',
    image: '/images/talent/Kemi Adaora.png',
    rate: '$120 - $170/hr',
  },
]

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
