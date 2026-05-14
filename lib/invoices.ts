export type ClientInvoiceStatus = 'Paid' | 'Due' | 'Draft'

export interface ClientInvoice {
  id: number
  label: string
  amount: string
  amountRaw: number
  status: ClientInvoiceStatus
  due: string
  meta: string
  jobSlug?: string
  jobClient?: string
}

export const clientInvoices: ClientInvoice[] = [
  {
    id: 1,
    label: 'Diagnostic sprint — milestone 2 of 4',
    amount: '$42,000',
    amountRaw: 42000,
    status: 'Due',
    due: 'Jan 31',
    meta: 'Retention leak audit and sprint plan',
    jobSlug: 'eazebank-growth-reset',
    jobClient: 'EazeBank',
  },
  {
    id: 2,
    label: 'Pod setup and onboarding',
    amount: '$18,500',
    amountRaw: 18500,
    status: 'Draft',
    due: 'Pending approval',
    meta: 'Issued after pod kickoff call',
    jobSlug: 'volta-pay-nigeria-entry',
    jobClient: 'Volta Pay',
  },
  {
    id: 3,
    label: 'January retainer',
    amount: '$25,000',
    amountRaw: 25000,
    status: 'Paid',
    due: 'Paid Jan 3',
    meta: 'Advisory retainer cleared by finance',
    jobSlug: 'volta-pay-nigeria-entry',
    jobClient: 'Volta Pay',
  },
  {
    id: 4,
    label: 'SME cluster scoping',
    amount: '$12,000',
    amountRaw: 12000,
    status: 'Paid',
    due: 'Paid Dec 18',
    meta: 'Discovery phase sign-off',
    jobSlug: 'gridwell-sme-clusters',
    jobClient: 'GridWell',
  },
  {
    id: 5,
    label: 'FCA readiness sprint — final delivery',
    amount: '$72,000',
    amountRaw: 72000,
    status: 'Paid',
    due: 'Paid Oct 14',
    meta: 'Full sprint payment on completion',
    jobSlug: 'volta-pay-uk-compliance',
    jobClient: 'Volta Pay',
  },
  {
    id: 6,
    label: 'Consumer launch strategy — full engagement',
    amount: '$48,000',
    amountRaw: 48000,
    status: 'Paid',
    due: 'Paid Jul 22',
    meta: 'Final payment on sprint close',
    jobSlug: 'volta-pay-launch-strategy',
    jobClient: 'Volta Pay',
  },
]
