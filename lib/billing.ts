export type PayoutStatus = 'Cleared' | 'Pending' | 'Processing'

export interface TalentPayout {
  id: number
  label: string
  amount: string
  amountRaw: number
  status: PayoutStatus
  date: string
  jobSlug?: string
  client?: string
  note?: string
}

export const ccreditsBalance = 3

export const talentPayouts: TalentPayout[] = [
  {
    id: 1,
    label: 'Diagnostic sprint — milestone 2 of 4',
    amount: '$14,700',
    amountRaw: 14700,
    status: 'Pending',
    date: 'Clears Jan 31',
    jobSlug: 'eazebank-growth-reset',
    client: 'EazeBank',
    note: 'Awaiting client payment',
  },
  {
    id: 2,
    label: 'Pod setup and onboarding',
    amount: '$6,475',
    amountRaw: 6475,
    status: 'Processing',
    date: 'Est. Feb 7',
    jobSlug: 'volta-pay-nigeria-entry',
    client: 'Volta Pay',
    note: 'Invoice pending client approval',
  },
  {
    id: 3,
    label: 'January retainer',
    amount: '$8,750',
    amountRaw: 8750,
    status: 'Cleared',
    date: 'Paid Jan 3',
    jobSlug: 'volta-pay-nigeria-entry',
    client: 'Volta Pay',
  },
  {
    id: 4,
    label: 'SME cluster scoping',
    amount: '$4,200',
    amountRaw: 4200,
    status: 'Cleared',
    date: 'Paid Dec 18',
    jobSlug: 'gridwell-sme-clusters',
    client: 'GridWell',
  },
]
