export type JobType = 'RETAINED' | 'PROJECT' | 'EQUITY'
export type JobStatus = 'Scoping' | 'Pod review' | 'Active' | 'Paused' | 'Completed'

export interface Milestone {
  id: string
  title: string
  amount: string
  date: string
  status: 'pending' | 'in-progress' | 'completed'
  paymentStatus: 'unpaid' | 'paid' | 'processing'
}

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
  podSlug?: string
  lead?: string
  startDate?: string
  endDate?: string
  scope: string[]
  requirements: string[]
  milestones?: Milestone[]
}

export const jobs: Job[] = [
  {
    id: 1,
    slug: 'volks-bank-loyalty-systems',
    title: 'Digital loyalty and rewards ecosystem',
    client: 'Volks Bank',
    type: 'PROJECT',
    status: 'Active',
    podSlug: 'growth_squad',
    summary: 'Reframing the digital banking relationship from utility to loyalty through a behavior-driven rewards engine.',
    rate: '$120k - 180k',
    tags: ['FINTECH', 'REWARDS', 'ACTIVE'],
    location: 'Lagos / Remote',
    time: '24-week engagement',
    updatedAt: 'Updated 2h ago',
    startDate: 'Jan 15',
    endDate: 'Jun 30',
    arena: 'Technology & Fintech',
    owner: 'Product office',
    updates: [
      'Reward logic validated with focus group',
      'Merchant API documentation drafted',
      'V1 dashboard wireframes approved',
    ],
    phase: 'Build phase',
    lead: 'Sarah Chen',
    nextMilestone: 'Merchant API V1 Release',
    nextReview: 'Jan 22',
    scope: [
      'Design behavior-based reward triggers and tiers',
      'Merchant partner onboarding and API integration',
      'End-to-end customer journey for point redemption',
    ],
    requirements: [
      'Experience in loyalty/rewards design for financial services',
      'Technical product management for API-led products',
      'Strong background in behavioral economics',
    ],
    milestones: [
      { id: 'm1', title: 'Behavioral reward logic sign-off', amount: '$35,000', date: 'Feb 15', status: 'completed', paymentStatus: 'paid' },
      { id: 'm2', title: 'Merchant API V1 documentation', amount: '$45,000', date: 'Mar 22', status: 'in-progress', paymentStatus: 'unpaid' },
      { id: 'm3', title: 'Loyalty dashboard MVP release', amount: '$60,000', date: 'May 10', status: 'pending', paymentStatus: 'unpaid' },
      { id: 'm4', title: 'Merchant partner pilot launch', amount: '$40,000', date: 'Jun 30', status: 'pending', paymentStatus: 'unpaid' },
    ],
  },
  {
    id: 2,
    slug: 't-finance-retention-sprints',
    title: 'Growth and retention operating sprint',
    client: 'T-Finance',
    type: 'RETAINED',
    status: 'Active',
    podSlug: 'growth_squad',
    summary: 'Embedded growth pod focused on identifying and closing retention leaks in the core consumer lending funnel.',
    rate: '$15k - 30k/mo',
    tags: ['FINTECH', 'GROWTH', 'ACTIVE'],
    location: 'Nairobi',
    time: '12-week sprint',
    updatedAt: 'Updated 4h ago',
    startDate: 'Jan 12',
    endDate: 'Apr 12',
    arena: 'Technology & Fintech',
    owner: 'Growth office',
    updates: [
      'Diagnostic phase complete',
      'Retention leaks mapped',
      'Sprint cadence established',
    ],
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
    milestones: [
      { id: 'm1', title: 'Funnel diagnostic audit', amount: '$15,000', date: 'Feb 20', status: 'completed', paymentStatus: 'paid' },
      { id: 'm2', title: '12-week growth sprint plan', amount: '$25,000', date: 'Mar 30', status: 'completed', paymentStatus: 'unpaid' },
      { id: 'm3', title: 'Retention experiment execution', amount: '$45,000', date: 'Jul 10', status: 'pending', paymentStatus: 'unpaid' },
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
    startDate: 'Jan 8',
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
    milestones: [
      { id: 'm1', title: 'Strategic opportunity brief', amount: '$10,000', date: 'Jan 25', status: 'pending', paymentStatus: 'unpaid' },
      { id: 'm2', title: 'Demand cluster validation', amount: '$15,000', date: 'Feb 15', status: 'pending', paymentStatus: 'unpaid' },
      { id: 'm3', title: 'Pilot economics model', amount: '$20,000', date: 'Mar 5', status: 'pending', paymentStatus: 'unpaid' },
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
    slug: 'wazobia-brand-lead',
    title: 'Fractional brand and commercial lead',
    client: 'Wazobia Foods',
    type: 'RETAINED',
    status: 'Scoping',
    summary: 'A fast-growing pan-Nigerian packaged food brand needs a single senior operator to own brand positioning, trade marketing, and the commercial relationship with their three key distributors. Not a pod — one person who can hold the room with both the marketing team and the trade floor.',
    rate: '$8k - 14k/mo',
    tags: ['FMCG', 'BRAND', 'SINGLE OPERATOR'],
    location: 'Lagos',
    time: '6-month retainer',
    updatedAt: 'Updated May 14',
    arena: 'Consumer & Brand',
    owner: 'Founder office',
    scope: [
      'Own brand positioning and campaign cadence across trade and consumer channels',
      'Manage commercial relationship with the top three distribution partners',
      'Build a repeatable trade marketing playbook the internal team can operate',
    ],
    requirements: [
      'FMCG brand and trade marketing experience in Nigeria',
      'Comfortable operating as the sole senior commercial voice',
      'Strong distributor and retailer network in Lagos and Southwest Nigeria',
    ],
    milestones: [
      { id: 'm1', title: 'Brand positioning framework', amount: '$4,000', date: 'Jun 15', status: 'pending', paymentStatus: 'unpaid' },
      { id: 'm2', title: 'Distributor scorecard system', amount: '$4,000', date: 'Aug 10', status: 'pending', paymentStatus: 'unpaid' },
      { id: 'm3', title: 'Trade marketing playbook', amount: '$6,000', date: 'Nov 14', status: 'pending', paymentStatus: 'unpaid' },
    ],
  },
  {
    id: 6,
    slug: 'parady-wallet-depth',
    title: 'Wallet depth and financial habit formation',
    client: 'Volta Pay',
    type: 'RETAINED',
    status: 'Scoping',
    summary: 'Parady brand has Nigeria\'s most powerful distribution infrastructure — 150k agents, the largest telco base in the country. The problem is depth, not reach. Users register, top up, send money, and stop. Bill payments, merchant QR, lifestyle spend — flat. OPay and PalmPay are colonising the everyday financial relationship while the wallet sits on an underactivated asset. This pod reframes the commercial motion: from transactional wallet to the primary financial OS for the mass market.',
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
    milestones: [
      { id: 'm1', title: 'Activation leak audit', amount: '$15,000', date: 'Jun 20', status: 'pending', paymentStatus: 'unpaid' },
      { id: 'm2', title: 'Merchant channel playbook', amount: '$20,000', date: 'Aug 15', status: 'pending', paymentStatus: 'unpaid' },
      { id: 'm3', title: '90-day growth sprint delivery', amount: '$35,000', date: 'Sep 30', status: 'pending', paymentStatus: 'unpaid' },
    ],
  },
  {
    id: 7,
    slug: 'volta-pay-uk-compliance',
    title: 'UK regulatory compliance and FCA readiness',
    client: 'Volta Pay',
    type: 'PROJECT',
    status: 'Completed',
    podSlug: 'beachhead',
    summary: 'Structured the FCA authorisation roadmap and compliance operating model ahead of Volta Pay\'s UK launch.',
    rate: '$60k - 90k',
    tags: ['FINTECH', 'COMPLIANCE', 'REGULATORY'],
    location: 'London',
    time: '10-week sprint',
    updatedAt: 'Updated Oct 14',
    startDate: 'Aug 5',
    endDate: 'Oct 14',
    scope: [
      'Map FCA authorisation requirements against current operating model',
      'Design compliance governance and reporting structure',
      'Prepare board-ready regulatory risk register',
    ],
    requirements: [
      'UK regulatory and FCA authorisation experience',
      'Payments and e-money institution compliance background',
    ],
    milestones: [
      { id: 'm1', title: 'FCA authorisation roadmap', amount: '$25,000', date: 'Aug 25', status: 'completed', paymentStatus: 'paid' },
      { id: 'm2', title: 'Compliance governance structure', amount: '$30,000', date: 'Sep 20', status: 'completed', paymentStatus: 'paid' },
      { id: 'm3', title: 'Regulatory risk register', amount: '$20,000', date: 'Oct 14', status: 'completed', paymentStatus: 'paid' },
    ],
  },
  {
    id: 8,
    slug: 'volta-pay-launch-strategy',
    title: 'Consumer launch strategy and channel plan',
    client: 'Volta Pay',
    type: 'PROJECT',
    status: 'Completed',
    podSlug: 'payments_strike',
    summary: 'Defined the go-to-market strategy for Volta Pay\'s consumer product launch across three UK cities.',
    rate: '$40k - 65k',
    tags: ['FINTECH', 'GTM', 'CONSUMER'],
    location: 'London / Remote',
    time: '8-week sprint',
    updatedAt: 'Updated Jul 22',
    startDate: 'Jun 2',
    endDate: 'Jul 22',
    scope: [
      'Define target customer segments and acquisition channels',
      'Build channel economics model and payback analysis',
      'Develop launch messaging and trust-building playbook',
    ],
    requirements: [
      'Consumer fintech go-to-market experience',
      'Channel economics and growth modelling',
    ],
    milestones: [
      { id: 'm1', title: 'Customer segment definition', amount: '$15,000', date: 'Jun 15', status: 'completed', paymentStatus: 'paid' },
      { id: 'm2', title: 'Channel economics model', amount: '$15,000', date: 'Jun 30', status: 'completed', paymentStatus: 'paid' },
      { id: 'm3', title: 'Launch messaging framework', amount: '$20,000', date: 'Jul 22', status: 'completed', paymentStatus: 'paid' },
    ],
  },
]

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug) ?? null
}

export function getJobProgress(job: Job) {
  if (!job.milestones || job.milestones.length === 0) return 0
  const completed = job.milestones.filter(m => m.status === 'completed').length
  return Math.round((completed / job.milestones.length) * 100)
}
