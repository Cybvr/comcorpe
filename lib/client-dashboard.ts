export type DecisionUrgency = 'Today' | 'This week' | 'Next'

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
      'Strong Lagos banking and network',
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
]

export const clientDecisions: ClientDecision[] = [
  {
    id: 1,
    title: 'Approve Volta Pay pod composition',
    related: 'Nigeria market-entry operating brief',
    urgency: 'Today',
    body: 'The recommended market-entry pod is ready. Approval unlocks intro calls and partner mapping.',
    href: '/client/dashboard/community/fintech-market-entry-pod',
  },
  {
    id: 2,
    title: 'Choose EazeBank retention test markets',
    related: 'Acquisition and activation reset',
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

export function getClientPodBySlug(slug: string) {
  return clientPodRecommendations.find((pod) => pod.slug === slug) ?? null
}
