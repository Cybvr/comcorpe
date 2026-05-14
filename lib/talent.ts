export interface TalentProfile {
  id: string
  name: string
  role: string
  bg: string
  desc: string
  initials: string
  dashboardTitle?: string
  communityRole?: string
  color?: string
  featured?: boolean
  image?: string
  rate?: string
}

export interface TalentSpotlightCard {
  eyebrow: string
  title: string
  tags: string[]
  inverted?: boolean
}

export interface TalentArchetype {
  title: string
  role: string
  desc: string
}

export interface TalentTrainingModule {
  title: string
  desc: string
  progress: {
    label: string
    completed: boolean
  }[]
}

export const talentSpotlightCards: TalentSpotlightCard[] = [
  {
    eyebrow: 'Commercial Architect',
    title: 'Growth Strategy & Design',
    tags: ['Fintech', 'Unit Economics'],
  },
  {
    eyebrow: 'Execution Lead',
    title: 'Revenue Ops & Performance',
    tags: ['CRM', 'Automation'],
    inverted: true,
  },
]

export const talentArchetypes: TalentArchetype[] = [
  {
    title: 'The Architect',
    role: 'Commercial Strategy & Design',
    desc: 'Builds the foundational growth system. Maps unit economics, channel architecture, and go-to-market strategies that turn business ambition into measurable commercial logic.',
  },
  {
    title: 'The Integrator',
    role: 'Market Entry & Partnerships',
    desc: 'Connects the strategy to the reality of the market. Navigates regulatory landscapes, builds local partnership networks, and embeds operations into complex emerging markets.',
  },
  {
    title: 'The Operator',
    role: 'Execution & Revenue Ops',
    desc: 'Drives day-to-day implementation. Manages the performance marketing, sales activation, and revenue pipelines, ensuring the growth system operates efficiently at scale.',
  },
]

export const talentTrainingModules: TalentTrainingModule[] = [
  {
    title: 'Commercial Architecture',
    desc: 'Design reliable, production-grade business models',
    progress: [
      { label: 'Unit Economics Mapping', completed: true },
      { label: 'Go-to-Market Strategy', completed: true },
      { label: 'Pricing & Monetization', completed: true },
    ],
  },
  {
    title: 'Market Intelligence',
    desc: 'Architect localized strategies for complex African markets',
    progress: [
      { label: 'Regulatory Navigation', completed: true },
      { label: 'Partnership Ecosystems', completed: true },
      { label: 'Consumer Trust Dynamics', completed: false },
    ],
  },
  {
    title: 'Growth Operations',
    desc: 'Deploy scalable revenue infrastructure in live environments',
    progress: [
      { label: 'Performance Marketing', completed: true },
      { label: 'Pipeline Automation', completed: true },
      { label: 'Data & Analytics', completed: false },
    ],
  },
]

export const talentProfiles: TalentProfile[] = [
  {
    id: 'tunde-a',
    name: 'Tunde A.',
    role: 'Commercial Strategy Lead',
    bg: 'Formerly at McKinsey & Company',
    desc: 'Designs go-to-market strategies for pan-African fintech expansions.',
    initials: 'TA',
    featured: true,
    image: '/images/talent/Tunde A.png',
    rate: '$15k - $22k/mo'
  },
  {
    id: 'sarah-m',
    name: 'Sarah M.',
    role: 'Revenue Operations Director',
    bg: 'Formerly at Flutterwave',
    desc: 'Builds scalable data platforms to automate enterprise sales pipelines.',
    initials: 'SM',
    featured: true,
    image: '/images/talent/Sarah M.png',
    rate: '$14k - $20k/mo'
  },
  {
    id: 'david-o',
    name: 'David O.',
    role: 'Market Entry Specialist',
    bg: 'Formerly at KPMG',
    desc: 'Navigates complex regulatory environments to launch foreign brands in Nigeria.',
    initials: 'DO',
    featured: true,
    image: '/images/talent/David O.png',
    rate: '$12k - $18k/mo'
  },
  {
    id: 'amira-h',
    name: 'Amira H.',
    role: 'Brand & Comms Architect',
    bg: 'Formerly at DDB',
    desc: 'Translates global brand equity into localized, culturally nuanced campaigns.',
    initials: 'AH',
    featured: true,
    image: '/images/talent/Amira H.png',
    rate: '$12k - $16k/mo'
  },
  {
    id: 'james-k',
    name: 'James K.',
    role: 'Growth Marketing Lead',
    bg: 'Formerly at Jumia',
    desc: 'Drives customer acquisition and performance marketing at massive scale.',
    initials: 'JK',
    featured: true,
    image: '/images/talent/James K.png',
    rate: '$13k - $19k/mo'
  },
  {
    id: 'elena-r',
    name: 'Elena R.',
    role: 'Strategic Partnerships',
    bg: 'Formerly at Standard Bank',
    desc: 'Builds high-trust corporate networks to accelerate B2B distribution.',
    initials: 'ER',
    featured: true,
    image: '/images/talent/Elena R.png',
    rate: '$14k - $21k/mo'
  },
  {
    id: 'amara-nwosu',
    name: 'Amara Nwosu',
    role: 'Growth Architect',
    bg: 'Lagos operator network',
    desc: 'Builds market-specific growth systems for early and expansion-stage companies.',
    initials: 'AN',
    dashboardTitle: 'Growth Architect - Lagos',
    color: 'bg-violet',
    rate: '$10k - $15k/mo'
  },
  {
    id: 'tobi-adeyemi',
    name: 'Tobi Adeyemi',
    role: 'Fintech Commercial Lead',
    bg: 'Fintech operator network',
    desc: 'Leads commercial strategy and regulated-market growth for fintech teams.',
    initials: 'TA',
    dashboardTitle: 'Fintech Commercial Lead',
    color: 'bg-blue',
    rate: '$15k - $20k/mo'
  },
  {
    id: 'yetunde-bello',
    name: 'Yetunde Bello',
    role: 'Growth Lead',
    bg: 'Market entry operator',
    desc: 'Turns local trust signals and partnership networks into launch momentum.',
    initials: 'YB',
    communityRole: 'Growth Lead - 4 days ago',
  },
  {
    id: 'daniel-osei',
    name: 'Daniel Osei',
    role: 'Strategy Lead',
    bg: 'Growth strategy operator',
    desc: 'Clarifies strategic briefs and turns ambiguous growth problems into executable work.',
    initials: 'DO',
    communityRole: 'Strategy - 2 days ago',
    image: '/images/talent/Daniel Osei.png',
    rate: '$14k - $19k/mo'
  },
  {
    id: 'kemi-adaora',
    name: 'Kemi Adaora',
    role: 'Brand Systems Lead',
    bg: 'Consumer trust strategist',
    desc: 'Designs market-specific brand systems for consumer growth across African markets.',
    initials: 'KA',
    communityRole: 'Brand Systems - 1 day ago',
    image: '/images/talent/Kemi Adaora.png',
    rate: '$12k - $17k/mo'
  },
]

const talentProfileMap = new Map(talentProfiles.map((profile) => [profile.id, profile]))

export const talentRoster = talentProfiles.filter((profile) => profile.featured)

export function getTalentProfile(id: string) {
  const profile = talentProfileMap.get(id)

  if (!profile) {
    throw new Error(`Unknown talent profile: ${id}`)
  }

  return profile
}
