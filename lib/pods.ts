import { getTalentProfile, type TalentProfile } from './talent'

export interface Pod {
  id: string
  slug: string
  name: string
  focus: string
  summary: string
  leadId: string
  memberIds: string[]
  markets: string[]
  evidence: string[]
  availability: string
  fitScore?: number
  nextStep?: string
  rate: string
}

export const pods: Pod[] = [
  {
    id: 'p-1',
    slug: 'fintech-market-entry-pod',
    name: 'Fintech market-entry pod',
    focus: 'Payments launch sequencing',
    summary: 'A compact pod for regulated payments entry: commercial lead, partnerships operator, trust strategist, and performance acquisition support.',
    leadId: 'tobi-adeyemi',
    memberIds: ['tobi-adeyemi', 'sarah-m', 'tunde-a', 'david-o'],
    markets: ['Nigeria', 'Ghana', 'UK corridor'],
    evidence: [
      'Built merchant acquisition motion for two African fintech launches',
      'Strong Lagos banking and network',
      'Can operate between board strategy and weekly execution',
    ],
    availability: 'Ready in 5 days',
    fitScore: 96,
    nextStep: 'Approve pod interview sequence',
    rate: '$45k - $60k/mo'
  },
  {
    id: 'p-2',
    slug: 'consumer-trust-pod',
    name: 'Consumer trust and retention pod',
    focus: 'Activation and repeat usage',
    summary: 'Brand, lifecycle, and route-to-market specialists for products where trust, habit, and local conversion cues drive growth.',
    leadId: 'kemi-adaora',
    memberIds: ['kemi-adaora', 'sarah-m', 'amira-h', 'james-k'],
    markets: ['Nigeria', 'Kenya', 'South Africa'],
    evidence: [
      'Mapped trust signals across four African consumer markets',
      'Useful for EazeBank activation and GridWell demand creation',
      'Pairs research discipline with live campaign execution',
    ],
    availability: 'Ready in 9 days',
    fitScore: 91,
    nextStep: 'Shortlist for EazeBank sprint',
    rate: '$38k - $52k/mo'
  },
]

export function getPodBySlug(slug: string): Pod | null {
  return pods.find((p) => p.slug === slug) ?? null
}

export function getPodMembers(pod: Pod): TalentProfile[] {
  return pod.memberIds.map((id) => getTalentProfile(id))
}
