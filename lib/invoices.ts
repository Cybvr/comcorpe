export type ClientInvoiceStatus = 'Paid' | 'Due' | 'Draft'

export interface ClientInvoice {
  id: number
  label: string
  amount: string
  status: ClientInvoiceStatus
  due: string
  meta: string
}

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
