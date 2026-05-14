export type InvoiceStatus = 'Paid' | 'Due' | 'Draft'

export interface Invoice {
  id: number
  label: string
  meta: string
  jobSlug: string
  clientId: string
  amount: string
  amountRaw: number
  status: InvoiceStatus
  date: string
}

export const invoices: Invoice[] = [
  {
    id: 1,
    label: 'Behavioral reward logic sign-off',
    meta: 'Milestone 1 of 4 — reward tier design complete',
    jobSlug: 'volks-bank-loyalty-systems',
    clientId: 'volks-bank',
    amount: '$35,000',
    amountRaw: 35000,
    status: 'Paid',
    date: 'Paid Feb 15',
  },
  {
    id: 2,
    label: 'Merchant API V1 documentation',
    meta: 'Milestone 2 of 4 — API docs and partner specs',
    jobSlug: 'volks-bank-loyalty-systems',
    clientId: 'volks-bank',
    amount: '$45,000',
    amountRaw: 45000,
    status: 'Due',
    date: 'Mar 22',
  },
  {
    id: 3,
    label: 'Funnel diagnostic audit',
    meta: 'Sprint milestone — retention leak mapping complete',
    jobSlug: 't-finance-retention-sprints',
    clientId: 't-finance',
    amount: '$15,000',
    amountRaw: 15000,
    status: 'Paid',
    date: 'Paid Feb 20',
  },
  {
    id: 4,
    label: '12-week growth sprint plan',
    meta: 'Sprint milestone — plan approved by leadership',
    jobSlug: 't-finance-retention-sprints',
    clientId: 't-finance',
    amount: '$25,000',
    amountRaw: 25000,
    status: 'Due',
    date: 'Mar 30',
  },
  {
    id: 5,
    label: 'SME cluster scoping',
    meta: 'Discovery phase sign-off',
    jobSlug: 'gridwell-sme-clusters',
    clientId: 'gridwell',
    amount: '$12,000',
    amountRaw: 12000,
    status: 'Paid',
    date: 'Paid Dec 18',
  },
  {
    id: 6,
    label: 'FCA readiness sprint — final delivery',
    meta: 'Full sprint payment on completion',
    jobSlug: 'volta-pay-uk-compliance',
    clientId: 'volta-pay',
    amount: '$72,000',
    amountRaw: 72000,
    status: 'Paid',
    date: 'Paid Oct 14',
  },
  {
    id: 7,
    label: 'Consumer launch strategy — full engagement',
    meta: 'Final payment on sprint close',
    jobSlug: 'volta-pay-launch-strategy',
    clientId: 'volta-pay',
    amount: '$48,000',
    amountRaw: 48000,
    status: 'Paid',
    date: 'Paid Jul 22',
  },
]
