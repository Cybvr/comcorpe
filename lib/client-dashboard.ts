export type ClientBriefStatus = 'Scoping' | 'Pod review' | 'Active' | 'Paused'
export type ClientProjectStatus = 'On track' | 'Needs input' | 'At risk'
export type ClientInvoiceStatus = 'Paid' | 'Due' | 'Draft'
export type DecisionUrgency = 'Today' | 'This week' | 'Next'

export interface ClientBrief {
  id: number
  slug: string
  title: string
  company: string
  arena: string
  status: ClientBriefStatus
  priority: string
  summary: string
  budget: string
  timeline: string
  location: string
  owner: string
  updatedAt: string
  tags: string[]
  outcomes: string[]
  nextSteps: string[]
}

export interface ClientPodRecommendation {
  id: number
  slug: string
  name: string
  focus: string
  fit: string
  availability: string
  lead: string
  leadInitials: string
  summary: string
  members: string[]
  markets: string[]
  evidence: string[]
  nextStep: string
}

export interface ClientProject {
  id: number
  slug: string
  name: string
  briefSlug: string
  status: ClientProjectStatus
  phase: string
  progress: number
  lead: string
  nextMilestone: string
  nextReview: string
  summary: string
  updates: string[]
}

export interface ClientInvoice {
  id: number
  label: string
  amount: string
  status: ClientInvoiceStatus
  due: string
  meta: string
}

export interface ClientDecision {
  id: number
  title: string
  related: string
  urgency: DecisionUrgency
  body: string
  href: string
}

export interface ClientHelpTopic {
  id: number
  title: string
  body: string
}

export const clientMetrics = [
  { label: 'Active briefs', value: '3', meta: '2 ready for pod review' },
  { label: 'Live projects', value: '2', meta: '1 needs input this week' },
  { label: 'Recommended pods', value: '5', meta: 'Across fintech, FMCG, energy' },
  { label: 'Open invoices', value: '$42k', meta: 'Next due Jan 31' },
]

export const clientBriefs: ClientBrief[] = [
  {
    id: 1,
    slug: 'volta-pay-nigeria-entry',
    title: 'Nigeria market-entry operating brief',
    company: 'Volta Pay',
    arena: 'Technology & Fintech',
    status: 'Pod review',
    priority: 'High',
    summary: 'Define the Lagos entry sequence, partner route, trust signals, and first commercial operating rhythm for a UK payments platform.',
    budget: '$15k - 30k/mo',
    timeline: '12-week sprint',
    location: 'Lagos / London',
    owner: 'Jide Pinheiro',
    updatedAt: 'Updated Jan 12',
    tags: ['FINTECH', 'PAYMENTS', 'MARKET ENTRY'],
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
    company: 'EazeBank',
    arena: 'Technology & Fintech',
    status: 'Active',
    priority: 'Medium',
    summary: 'Diagnose stalled growth and turn the funnel reset into a 12-week operating sprint across acquisition, activation, and retention.',
    budget: '$75k - 150k',
    timeline: '3 - 6 months',
    location: 'Nigeria / Remote',
    owner: 'Commercial team',
    updatedAt: 'Updated Jan 10',
    tags: ['FINTECH', 'GROWTH', 'RETENTION'],
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
    company: 'GridWell',
    arena: 'Public Infrastructure',
    status: 'Scoping',
    priority: 'Medium',
    summary: 'Originate and package a repeatable growth lane for distributed energy adoption in underserved SME clusters.',
    budget: '$45k - 90k',
    timeline: '8-week opportunity build',
    location: 'West Africa',
    owner: 'Strategy office',
    updatedAt: 'Updated Jan 8',
    tags: ['ENERGY', 'SME', 'OPPORTUNITY BRIEF'],
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
]

export const clientPodRecommendations: ClientPodRecommendation[] = [
  {
    id: 1,
    slug: 'fintech-market-entry-pod',
    name: 'Fintech market-entry pod',
    focus: 'Payments launch sequencing',
    fit: '96% fit',
    availability: 'Ready in 5 days',
    lead: 'Tobi Adeyemi',
    leadInitials: 'TA',
    summary: 'A compact pod for regulated payments entry: commercial lead, partnerships operator, trust strategist, and performance acquisition support.',
    members: ['Commercial lead', 'Partnerships operator', 'Regulatory affairs operator', 'Performance marketer'],
    markets: ['Nigeria', 'Ghana', 'UK corridor'],
    evidence: [
      'Built merchant acquisition motion for two African fintech launches',
      'Strong Lagos banking and aggregator network',
      'Can operate between board strategy and weekly execution',
    ],
    nextStep: 'Approve pod interview sequence',
  },
  {
    id: 2,
    slug: 'consumer-trust-pod',
    name: 'Consumer trust and retention pod',
    focus: 'Activation and repeat usage',
    fit: '91% fit',
    availability: 'Ready in 9 days',
    lead: 'Kemi Adaora',
    leadInitials: 'KA',
    summary: 'Brand, lifecycle, and route-to-market specialists for products where trust, habit, and local conversion cues drive growth.',
    members: ['Brand strategist', 'Lifecycle marketer', 'Field insight analyst', 'Retail comms designer'],
    markets: ['Nigeria', 'Kenya', 'South Africa'],
    evidence: [
      'Mapped trust signals across four African consumer markets',
      'Useful for EazeBank activation and GridWell demand creation',
      'Pairs research discipline with live campaign execution',
    ],
    nextStep: 'Shortlist for EazeBank sprint',
  },
  {
    id: 3,
    slug: 'sme-infrastructure-pod',
    name: 'SME infrastructure demand pod',
    focus: 'Cluster validation and pilot packaging',
    fit: '88% fit',
    availability: 'Ready in 2 weeks',
    lead: 'Amara Nwosu',
    leadInitials: 'AN',
    summary: 'Infrastructure finance, B2B sales, and public-sector navigation support for demand creation around physical infrastructure plays.',
    members: ['Infrastructure finance analyst', 'B2B sales operator', 'Public-sector liaison', 'Product strategist'],
    markets: ['Nigeria', 'Ghana', 'Francophone West Africa'],
    evidence: [
      'Designed board-ready opportunity briefs for infrastructure clients',
      'Experienced with public-private stakeholder mapping',
      'Strong fit for first-pilot economics and governance design',
    ],
    nextStep: 'Validate cluster assumptions',
  },
]

export const clientProjects: ClientProject[] = [
  {
    id: 1,
    slug: 'eazebank-growth-reset',
    name: 'EazeBank growth reset',
    briefSlug: 'eazebank-growth-reset',
    status: 'Needs input',
    phase: 'Diagnostic playback',
    progress: 58,
    lead: 'Daniel Osei',
    nextMilestone: 'Approve 12-week sprint plan',
    nextReview: 'Jan 18',
    summary: 'The pod has completed acquisition and activation diagnostics and needs client agreement on the first retention experiments.',
    updates: [
      'Channel audit complete',
      'Activation leak map ready for review',
      'Retention tests waiting on market selection',
    ],
  },
  {
    id: 2,
    slug: 'volta-pay-entry-pod-review',
    name: 'Volta Pay entry setup',
    briefSlug: 'volta-pay-nigeria-entry',
    status: 'On track',
    phase: 'Pod assembly',
    progress: 36,
    lead: 'Tobi Adeyemi',
    nextMilestone: 'Client approves final pod',
    nextReview: 'Jan 16',
    summary: 'Three operator profiles are ready for client review, with partner mapping queued after pod approval.',
    updates: [
      'Operator shortlist prepared',
      'Partner map scaffolded',
      'Launch-risk notes requested from counsel',
    ],
  },
]

export const clientDecisions: ClientDecision[] = [
  {
    id: 1,
    title: 'Approve Volta Pay pod composition',
    related: 'Volta Pay entry setup',
    urgency: 'Today',
    body: 'The recommended market-entry pod is ready. Approval unlocks intro calls and partner mapping.',
    href: '/client/dashboard/community/fintech-market-entry-pod',
  },
  {
    id: 2,
    title: 'Choose EazeBank retention test markets',
    related: 'EazeBank growth reset',
    urgency: 'This week',
    body: 'The growth pod needs two priority markets before finalizing the 12-week experiment calendar.',
    href: '/client/dashboard/work',
  },
  {
    id: 3,
    title: 'Confirm GridWell cluster criteria',
    related: 'SME cluster demand creation',
    urgency: 'Next',
    body: 'A short criteria review will keep the validation interviews focused on the highest-value clusters.',
    href: '/client/dashboard/jobs/gridwell-sme-clusters',
  },
]

export const clientInvoices: ClientInvoice[] = [
  {
    id: 1,
    label: 'EazeBank diagnostic sprint',
    amount: '$42,000',
    status: 'Due',
    due: 'Due Jan 31',
    meta: 'Milestone 2 of 4',
  },
  {
    id: 2,
    label: 'Volta Pay pod setup',
    amount: '$18,500',
    status: 'Draft',
    due: 'Pending approval',
    meta: 'Issued after pod kickoff',
  },
  {
    id: 3,
    label: 'December advisory retainer',
    amount: '$25,000',
    status: 'Paid',
    due: 'Paid Jan 3',
    meta: 'Cleared by finance',
  },
]

export const clientHelpTopics: ClientHelpTopic[] = [
  {
    id: 1,
    title: 'Submitting a brief',
    body: 'Turn a growth problem into a clear operating brief with outcomes, constraints, timeline, and approval owners.',
  },
  {
    id: 2,
    title: 'Reviewing pod recommendations',
    body: 'Compare recommended operators by fit, market evidence, availability, and the decisions needed before kickoff.',
  },
  {
    id: 3,
    title: 'Managing active projects',
    body: 'Track phases, milestones, client inputs, and the next review point for every live Comcorpe engagement.',
  },
  {
    id: 4,
    title: 'Billing and approvals',
    body: 'See open invoices, draft charges, paid retainers, and milestone context before finance signs off.',
  },
]

export const clientReferral = {
  link: 'https://app.comcorpe.e/client/r/jide...',
  channels: ['Email', 'LinkedIn', 'Board channel'],
  clientShare: '3%',
  talentShare: '1%',
  summary: 'Introduce another company or a senior operator and track rewards when referred work closes.',
}

export function getClientBriefBySlug(slug: string) {
  return clientBriefs.find((brief) => brief.slug === slug) ?? null
}

export function getClientPodBySlug(slug: string) {
  return clientPodRecommendations.find((pod) => pod.slug === slug) ?? null
}
