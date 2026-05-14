import { getTalentProfile, type User } from './user'

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
    slug: 'payments_strike',
    name: 'Payments Strike',
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
    slug: 'beachhead',
    name: 'Beachhead',
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
  {
    id: 'p-3',
    slug: 'frequency',
    name: 'Frequency',
    focus: 'Wallet depth & financial habit formation',
    summary: 'Built for mass-market fintech products with distribution but without depth. Frequency turns registered users into repeat customers — mapping activation leaks, building merchant channel plays, and designing the consumer trust signals that shift behaviour from occasional transaction to primary financial relationship.',
    leadId: 'kemi-adaora',
    memberIds: ['kemi-adaora', 'tobi-adeyemi', 'james-k', 'amira-h'],
    markets: ['Nigeria', 'Ghana', 'Kenya'],
    evidence: [
      'Led consumer trust mapping across four African markets',
      'Built activation and retention sprints for two PSB-regulated products',
      'Deep experience in USSD-first and agent-network-led growth contexts',
    ],
    availability: 'Ready in 7 days',
    fitScore: 94,
    nextStep: 'Align on activation KPIs with MoMo growth team',
    rate: '$55k - $85k/mo',
  },
]

export function getPodBySlug(slug: string): Pod | null {
  return pods.find((p) => p.slug === slug) ?? null
}

export function getPodMembers(pod: Pod): User[] {
  return pod.memberIds.map((id) => getTalentProfile(id))
}
