export type PayoutStatus = 'Cleared' | 'Pending' | 'Processing'

export interface Payout {
  id: number
  label: string
  meta: string
  jobSlug: string
  clientId: string
  amount: string
  amountRaw: number
  status: PayoutStatus
  date: string
  note?: string
}

export const ccreditsBalance = 3

export const payouts: Payout[] = [
  {
    id: 1,
    label: 'Behavioral reward logic sign-off',
    meta: 'Milestone 1 of 4',
    jobSlug: 'volks-bank-loyalty-systems',
    clientId: 'volks-bank',
    amount: '$12,250',
    amountRaw: 12250,
    status: 'Cleared',
    date: 'Paid Feb 18',
  },
  {
    id: 2,
    label: 'Merchant API V1 documentation',
    meta: 'Milestone 2 of 4',
    jobSlug: 'volks-bank-loyalty-systems',
    clientId: 'volks-bank',
    amount: '$15,750',
    amountRaw: 15750,
    status: 'Pending',
    date: 'Clears Mar 25',
    note: 'Awaiting client payment',
  },
  {
    id: 3,
    label: 'Funnel diagnostic audit',
    meta: 'Sprint milestone',
    jobSlug: 't-finance-retention-sprints',
    clientId: 't-finance',
    amount: '$5,250',
    amountRaw: 5250,
    status: 'Cleared',
    date: 'Paid Feb 22',
  },
  {
    id: 4,
    label: '12-week growth sprint plan',
    meta: 'Sprint milestone',
    jobSlug: 't-finance-retention-sprints',
    clientId: 't-finance',
    amount: '$8,750',
    amountRaw: 8750,
    status: 'Pending',
    date: 'Clears Apr 2',
    note: 'Awaiting client payment',
  },
  {
    id: 5,
    label: 'SME cluster scoping',
    meta: 'Discovery phase',
    jobSlug: 'gridwell-sme-clusters',
    clientId: 'gridwell',
    amount: '$4,200',
    amountRaw: 4200,
    status: 'Cleared',
    date: 'Paid Dec 20',
  },
  {
    id: 6,
    label: 'FCA readiness sprint — final delivery',
    meta: 'Full sprint completion',
    jobSlug: 'volta-pay-uk-compliance',
    clientId: 'volta-pay',
    amount: '$25,200',
    amountRaw: 25200,
    status: 'Cleared',
    date: 'Paid Oct 16',
  },
  {
    id: 7,
    label: 'Consumer launch strategy — full engagement',
    meta: 'Sprint close',
    jobSlug: 'volta-pay-launch-strategy',
    clientId: 'volta-pay',
    amount: '$16,800',
    amountRaw: 16800,
    status: 'Cleared',
    date: 'Paid Jul 24',
  },
]
