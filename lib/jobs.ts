export type JobType = 'RETAINED' | 'PROJECT' | 'EQUITY'

export interface Job {
  id: number
  slug: string
  type: JobType
  client: string
  role: string
  summary: string
  rate: string
  tags: string[]
  location: string
  time: string
  saved: boolean
  scope: string[]
  requirements: string[]
}

export const jobs: Job[] = [
  {
    id: 1,
    slug: 'volta-pay-market-entry',
    type: 'RETAINED',
    client: 'Volta Pay',
    role: 'Market Entry - Nigeria',
    summary: 'A UK payments platform needs a market-entry operator to build local partnerships, trust signals, and launch sequencing for Nigeria.',
    rate: '$15k - 30k/mo',
    tags: ['FINTECH', 'PAYMENTS'],
    location: 'Lagos / London',
    time: 'Any time',
    saved: false,
    scope: [
      'Map merchant acquisition channels and partnership routes',
      'Shape launch sequencing for Lagos before wider expansion',
      'Translate regulatory and trust constraints into commercial actions',
    ],
    requirements: [
      'Fintech or payments market-entry experience',
      'Strong operator network in Nigeria',
      'Comfort working across client leadership and local partners',
    ],
  },
  {
    id: 2,
    slug: 'eazebank-growth-turnaround',
    type: 'PROJECT',
    client: 'EazeBank',
    role: 'Growth Stagnation - Turnaround',
    summary: 'A fintech team needs a commercial reset across acquisition, activation, and retention after growth flattened.',
    rate: '$75k - 150k',
    tags: ['FINTECH', 'AFRICA'],
    location: 'Nigeria / Remote',
    time: '3 - 6 months',
    saved: true,
    scope: [
      'Audit acquisition, activation, and retention leaks',
      'Reframe growth priorities into a 12-week operating sprint',
      'Build a scorecard leadership can use after the project closes',
    ],
    requirements: [
      'Growth strategy and revenue operations experience',
      'Ability to diagnose funnel and channel performance',
      'Experience with African fintech or regulated consumer finance',
    ],
  },
  {
    id: 3,
    slug: 'stealth-consumer-brand-ecosystem',
    type: 'EQUITY',
    client: 'Stealth Co.',
    role: 'Consumer Brand Ecosystem Build',
    summary: 'A consumer venture is building a brand ecosystem and needs senior commercial and brand systems support.',
    rate: '$25k - 75k + equity',
    tags: ['FMCG', 'BRAND'],
    location: 'Pan-Africa',
    time: 'Long-term',
    saved: false,
    scope: [
      'Define the brand system and commercial operating rhythm',
      'Build launch messaging across multiple consumer channels',
      'Support partnerships, distribution, and repeat-purchase design',
    ],
    requirements: [
      'Consumer brand, FMCG, or marketplace experience',
      'Ability to move between strategy and execution',
      'Interest in a long-term venture-aligned engagement',
    ],
  },
]

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug) ?? null
}
