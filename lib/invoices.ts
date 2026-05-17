export type InvoiceStatus = 'Paid' | 'Due' | 'Processing'

export interface Invoice {
  id: number
  jobSlug: string
  milestoneId: string
  clientId: string
  label: string
  amount: string
  amountRaw: number
  status: InvoiceStatus
  date: string
}

export function getInvoice(jobSlug: string, milestoneId: string): Invoice | undefined {
  return invoices.find(i => i.jobSlug === jobSlug && i.milestoneId === milestoneId)
}

export const invoices: Invoice[] = []
