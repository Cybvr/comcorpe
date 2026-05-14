export type JobType = 'RETAINED' | 'PROJECT' | 'EQUITY'
export type JobStatus = 'Scoping' | 'Pod review' | 'Active' | 'Paused' | 'Completed'

export interface Job {
  id: number
  slug: string
  title: string
  client: string // Company name
  type: JobType
  status: JobStatus
  summary: string
  rate: string // Budget
  location: string
  time: string // Timeline
  tags: string[]
  updatedAt: string
  arena?: string
  owner?: string
  updates?: string[]
  // Meta data for the dashboard (mostly for Active projects)
  progress?: number
  phase?: string
  nextMilestone?: string
  nextReview?: string
  lead?: string
  // Detail pages
  scope: string[]
  requirements: string[]
  outcomes?: string[]
  nextSteps?: string[]
}

export const jobs: Job[] = [
  {
    id: 1,
    slug: 'volta-pay-nigeria-entry',
    title: 'Team needed for Nigeria market-entry operating project',
    client: 'Volta Pay',
    type: 'RETAINED',
    status: 'Pod review',
    summary: 'Define the Lagos entry sequence, partner route, trust signals, and first commercial operating rhythm for a UK payments platform.',
    rate: '$15k - 30k/mo',
    tags: ['FINTECH', 'PAYMENTS', 'MARKET ENTRY'],
    location: 'Lagos / London',
    time: '12-week sprint',
    updatedAt: 'Updated Jan 12',
    arena: 'Technology & Fintech',
    owner: 'Jide Pinheiro',
    progress: 36,
    phase: 'Pod assembly',
    lead: 'Tobi Adeyemi',
    nextMilestone: 'Client approves final pod',
    nextReview: 'Jan 16',
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
    outcomes: [
      'Validated launch sequence for Lagos merchant acquisition',
      'Shortlist of local distribution and trust-carrier partners',
      'Board-ready operating cadence for first 90 days',
    ],
    nextSteps: [
      'Approve pod composition',
      'Confirm target merchant segments',
      'Share regulatory counsel notes',
    ],
  },
  {
    id: 2,
    slug: 'eazebank-growth-reset',
    title: 'Acquisition and activation reset',
    client: 'EazeBank',
    type: 'PROJECT',
    status: 'Active',
    summary: 'Diagnose stalled growth and turn the funnel reset into a 12-week operating sprint across acquisition, activation, and retention.',
    rate: '$75k - 150k',
    tags: ['FINTECH', 'GROWTH', 'RETENTION'],
    location: 'Nigeria / Remote',
    time: '3 - 6 months',
    updatedAt: 'Updated Jan 10',
    arena: 'Technology & Fintech',
    owner: 'Commercial team',
    updates: [
      'Diagnostic phase complete',
      'Retention leaks mapped',
      'Sprint cadence established',
    ],
    progress: 58,
    phase: 'Diagnostic playback',
    lead: 'Daniel Osei',
    nextMilestone: 'Approve 12-week sprint plan',
    nextReview: 'Jan 18',
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
    outcomes: [
      'Channel and activation leak audit',
      'Weekly leadership scorecard',
      'Retention experiments and ownership map',
    ],
    nextSteps: [
      'Review diagnostic findings',
      'Select retention test markets',
      'Approve sprint governance',
    ],
  },
  {
    id: 3,
    slug: 'gridwell-sme-clusters',
    title: 'SME cluster demand creation',
    client: 'GridWell',
    type: 'PROJECT',
    status: 'Scoping',
    summary: 'Originate and package a repeatable growth lane for distributed energy adoption in underserved SME clusters.',
    rate: '$45k - 90k',
    tags: ['ENERGY', 'SME', 'OPPORTUNITY BRIEF'],
    location: 'West Africa',
    time: '8-week opportunity build',
    updatedAt: 'Updated Jan 8',
    arena: 'Public Infrastructure',
    owner: 'Strategy office',
    scope: [
      'Strategic opportunity brief',
      'Two validated demand clusters',
      'Pilot economics and governance model',
    ],
    requirements: [
      'Infrastructure finance analyst',
      'B2B sales operator',
      'Public-sector liaison',
      'Product strategist',
    ],
    outcomes: [
      'Strategic opportunity brief',
      'Two validated demand clusters',
      'Pilot economics and governance model',
    ],
    nextSteps: [
      'Confirm cluster selection criteria',
      'Share historic tender pipeline',
      'Approve validation interview list',
    ],
  },
  {
    id: 4,
    slug: 'stealth-consumer-brand-ecosystem',
    title: 'Consumer Brand Ecosystem Build',
    client: 'Stealth Co.',
    type: 'EQUITY',
    status: 'Scoping',
    summary: 'A consumer venture is building a brand ecosystem and needs senior commercial and brand systems support.',
    rate: '$25k - 75k + equity',
    tags: ['FMCG', 'BRAND'],
    location: 'Pan-Africa',
    time: 'Long-term',
    updatedAt: 'Updated Jan 5',
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
  {
    id: 5,
    slug: 'mtn-momo-wallet-depth',
    title: 'Wallet depth and financial habit formation',
    client: 'MTN MoMo',
    type: 'RETAINED',
    status: 'Scoping',
    summary: 'MoMo has Nigeria\'s most powerful distribution infrastructure — 150k agents, the largest telco base in the country. The problem is depth, not reach. Users register, top up, send money, and stop. Bill payments, merchant QR, lifestyle spend — flat. OPay and PalmPay are colonising the everyday financial relationship while MoMo sits on an underactivated asset. This pod reframes the commercial motion: from transactional wallet to the primary financial OS for the mass market.',
    rate: '$55k - 85k/mo',
    tags: ['FINTECH', 'CONSUMER', 'ACTIVATION'],
    location: 'Nigeria',
    time: '16-week sprint + retainer option',
    updatedAt: 'Updated May 14',
    arena: 'Technology & Fintech',
    owner: 'Growth office',
    scope: [
      'Diagnose the activation gap — where users drop off after registration and why',
      'Map the merchant and bill-payment opportunity by cluster and channel',
      'Build the consumer trust and habit-formation playbook for PSB-regulated context',
      'Design the commercial operating rhythm for agent-to-digital migration',
      'Deliver a 90-day growth sprint with weekly leadership scorecard',
    ],
    requirements: [
      'Deep fintech consumer activation experience in Nigeria',
      'Familiarity with CBN PSB regulations and USSD-first markets',
      'Ability to work between board-level strategy and weekly execution',
      'Experience building merchant network depth in mass-market contexts',
    ],
    outcomes: [
      'Activation leak audit across registration, first transaction, and repeat use',
      'Merchant and bill-payment channel playbook for Lagos and tier-2 cities',
      'Trust signal and habit formation framework for unbanked segments',
      'Board-ready 90-day commercial operating plan',
    ],
    nextSteps: [
      'Align on activation KPIs with MoMo growth leadership',
      'Access anonymised cohort data for registration-to-use funnel',
      'Confirm priority merchant segments for first sprint',
    ],
  },
]

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug) ?? null
}
