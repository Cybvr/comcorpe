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

export const invoices: Invoice[] = [
  // volks-bank-loyalty-systems
  { id: 1,  jobSlug: 'volks-bank-loyalty-systems',  milestoneId: 'm1', clientId: 'volks-bank',    label: 'Behavioral reward logic sign-off',   amount: '$35,000', amountRaw: 35000, status: 'Paid',       date: '15 Feb 2026' },
  { id: 2,  jobSlug: 'volks-bank-loyalty-systems',  milestoneId: 'm2', clientId: 'volks-bank',    label: 'Merchant API V1 documentation',      amount: '$45,000', amountRaw: 45000, status: 'Due',        date: '22 Mar 2026' },
  { id: 3,  jobSlug: 'volks-bank-loyalty-systems',  milestoneId: 'm3', clientId: 'volks-bank',    label: 'Loyalty dashboard MVP release',       amount: '$60,000', amountRaw: 60000, status: 'Due',        date: '10 May 2026' },
  { id: 4,  jobSlug: 'volks-bank-loyalty-systems',  milestoneId: 'm4', clientId: 'volks-bank',    label: 'Merchant partner pilot launch',       amount: '$40,000', amountRaw: 40000, status: 'Due',        date: '30 Jun 2026' },
  // t-finance-retention-sprints
  { id: 5,  jobSlug: 't-finance-retention-sprints', milestoneId: 'm1', clientId: 't-finance',     label: 'Funnel diagnostic audit',             amount: '$15,000', amountRaw: 15000, status: 'Paid',       date: '20 Feb 2026' },
  { id: 6,  jobSlug: 't-finance-retention-sprints', milestoneId: 'm2', clientId: 't-finance',     label: '12-week growth sprint plan',          amount: '$25,000', amountRaw: 25000, status: 'Due',        date: '30 Mar 2026' },
  { id: 7,  jobSlug: 't-finance-retention-sprints', milestoneId: 'm3', clientId: 't-finance',     label: 'Retention experiment execution',      amount: '$45,000', amountRaw: 45000, status: 'Due',        date: '10 Jul 2026' },
  // gridwell-sme-clusters
  { id: 8,  jobSlug: 'gridwell-sme-clusters',       milestoneId: 'm1', clientId: 'gridwell',      label: 'Strategic opportunity brief',         amount: '$10,000', amountRaw: 10000, status: 'Due',        date: '25 Jan 2026' },
  { id: 9,  jobSlug: 'gridwell-sme-clusters',       milestoneId: 'm2', clientId: 'gridwell',      label: 'Demand cluster validation',           amount: '$15,000', amountRaw: 15000, status: 'Due',        date: '15 Feb 2026' },
  { id: 10, jobSlug: 'gridwell-sme-clusters',       milestoneId: 'm3', clientId: 'gridwell',      label: 'Pilot economics model',               amount: '$20,000', amountRaw: 20000, status: 'Due',        date: '05 Mar 2026' },
  // wazobia-brand-lead
  { id: 11, jobSlug: 'wazobia-brand-lead',          milestoneId: 'm1', clientId: 'wazobia-foods',  label: 'Brand positioning framework',         amount: '$4,000',  amountRaw: 4000,  status: 'Due',        date: '15 Jun 2026' },
  { id: 12, jobSlug: 'wazobia-brand-lead',          milestoneId: 'm2', clientId: 'wazobia-foods',  label: 'Distributor scorecard system',        amount: '$4,000',  amountRaw: 4000,  status: 'Due',        date: '10 Aug 2026' },
  { id: 13, jobSlug: 'wazobia-brand-lead',          milestoneId: 'm3', clientId: 'wazobia-foods',  label: 'Trade marketing playbook',            amount: '$6,000',  amountRaw: 6000,  status: 'Due',        date: '14 Nov 2026' },
  // parady-wallet-depth
  { id: 14, jobSlug: 'parady-wallet-depth',         milestoneId: 'm1', clientId: 'volta-pay',     label: 'Activation leak audit',               amount: '$15,000', amountRaw: 15000, status: 'Due',        date: '20 Jun 2026' },
  { id: 15, jobSlug: 'parady-wallet-depth',         milestoneId: 'm2', clientId: 'volta-pay',     label: 'Merchant channel playbook',           amount: '$20,000', amountRaw: 20000, status: 'Due',        date: '15 Aug 2026' },
  { id: 16, jobSlug: 'parady-wallet-depth',         milestoneId: 'm3', clientId: 'volta-pay',     label: '90-day growth sprint delivery',       amount: '$35,000', amountRaw: 35000, status: 'Due',        date: '30 Sep 2026' },
  // volta-pay-uk-compliance
  { id: 17, jobSlug: 'volta-pay-uk-compliance',     milestoneId: 'm1', clientId: 'volta-pay',     label: 'FCA authorisation roadmap',           amount: '$25,000', amountRaw: 25000, status: 'Paid',       date: '25 Aug 2025' },
  { id: 18, jobSlug: 'volta-pay-uk-compliance',     milestoneId: 'm2', clientId: 'volta-pay',     label: 'Compliance governance structure',     amount: '$30,000', amountRaw: 30000, status: 'Paid',       date: '20 Sep 2025' },
  { id: 19, jobSlug: 'volta-pay-uk-compliance',     milestoneId: 'm3', clientId: 'volta-pay',     label: 'Regulatory risk register',            amount: '$20,000', amountRaw: 20000, status: 'Paid',       date: '14 Oct 2025' },
  // volta-pay-launch-strategy
  { id: 20, jobSlug: 'volta-pay-launch-strategy',   milestoneId: 'm1', clientId: 'volta-pay',     label: 'Customer segment definition',         amount: '$15,000', amountRaw: 15000, status: 'Paid',       date: '15 Jun 2025' },
  { id: 21, jobSlug: 'volta-pay-launch-strategy',   milestoneId: 'm2', clientId: 'volta-pay',     label: 'Channel economics model',             amount: '$15,000', amountRaw: 15000, status: 'Paid',       date: '30 Jun 2025' },
  { id: 22, jobSlug: 'volta-pay-launch-strategy',   milestoneId: 'm3', clientId: 'volta-pay',     label: 'Launch messaging framework',          amount: '$20,000', amountRaw: 20000, status: 'Paid',       date: '22 Jul 2025' },
  // volta-pay-nigeria-entry
  { id: 23, jobSlug: 'volta-pay-nigeria-entry',     milestoneId: 'm1', clientId: 'volta-pay',     label: 'Regulatory roadmap sign-off',         amount: '$15,000', amountRaw: 15000, status: 'Paid',       date: '30 Jan 2026' },
  { id: 24, jobSlug: 'volta-pay-nigeria-entry',     milestoneId: 'm2', clientId: 'volta-pay',     label: 'Merchant ecosystem audit',            amount: '$20,000', amountRaw: 20000, status: 'Due',        date: '15 Mar 2026' },
]
