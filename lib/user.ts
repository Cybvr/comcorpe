export type UserRole = 'client' | 'talent'

export interface User {
  id: string
  name: string
  initials: string
  role: UserRole
  // Client fields
  company?: string
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
}

// ─── Current session (mock auth) ──────────────────────────────────────────────
export const currentUser: User = {
  id: 'jide-p',
  name: 'Jide',
  initials: 'JP',
  role: 'client',
  company: 'Volta Pay',
  credits: 3,
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
    rate: '$15k - $22k/mo',
  },
  {
    id: 'sarah-m',
    name: 'Sarah M.',
    initials: 'SM',
    role: 'talent',
    talentRole: 'Revenue Operations Director',
    bg: 'Formerly at Flutterwave',
    desc: 'Builds scalable data platforms to automate enterprise sales pipelines.',
    featured: true,
    image: '/images/talent/Sarah M.png',
    rate: '$14k - $20k/mo',
  },
  {
    id: 'david-o',
    name: 'David O.',
    initials: 'DO',
    role: 'talent',
    talentRole: 'Market Entry Specialist',
    bg: 'Formerly at KPMG',
    desc: 'Navigates complex regulatory environments to launch foreign brands in Nigeria.',
    featured: true,
    image: '/images/talent/David O.png',
    rate: '$12k - $18k/mo',
  },
  {
    id: 'amira-h',
    name: 'Amira H.',
    initials: 'AH',
    role: 'talent',
    talentRole: 'Brand & Comms Architect',
    bg: 'Formerly at DDB',
    desc: 'Translates global brand equity into localized, culturally nuanced campaigns.',
    featured: true,
    image: '/images/talent/Amira H.png',
    rate: '$12k - $16k/mo',
  },
  {
    id: 'james-k',
    name: 'James K.',
    initials: 'JK',
    role: 'talent',
    talentRole: 'Growth Marketing Lead',
    bg: 'Formerly at Jumia',
    desc: 'Drives customer acquisition and performance marketing at massive scale.',
    featured: true,
    image: '/images/talent/James K.png',
    rate: '$13k - $19k/mo',
  },
  {
    id: 'elena-r',
    name: 'Elena R.',
    initials: 'ER',
    role: 'talent',
    talentRole: 'Strategic Partnerships',
    bg: 'Formerly at Standard Bank',
    desc: 'Builds high-trust corporate networks to accelerate B2B distribution.',
    featured: true,
    image: '/images/talent/Elena R.png',
    rate: '$14k - $21k/mo',
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
    color: 'bg-violet',
    rate: '$10k - $15k/mo',
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
    color: 'bg-blue',
    rate: '$15k - $20k/mo',
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
    rate: '$14k - $19k/mo',
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
    rate: '$12k - $17k/mo',
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
