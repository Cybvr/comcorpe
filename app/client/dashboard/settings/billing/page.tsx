'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { invoices, type InvoiceStatus } from '@/lib/invoices'
import { useJobs } from '@/lib/jobs'
import { getPodBySlug } from '@/lib/pods'
import { useCurrentUser } from '@/lib/user'

const statusStyles: Record<InvoiceStatus, string> = {
  Paid:       'bg-green-50 text-green-700 border-green-200',
  Due:        'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-primary/10 text-primary border-primary/20',
}

export default function ClientBillingPage() {
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { jobs, loading: jobsLoading } = useJobs()
  const [search, setSearch] = useState('')

  if (userLoading || jobsLoading || !currentUser) {
    return <p className="font-text text-sm text-muted-foreground">Loading billing...</p>
  }

  const currentClientId = currentUser.clientId ?? currentUser.id
  const clientInvoices = invoices.filter(i => i.clientId === currentClientId)
  const clientJobs = jobs.filter(j => j.clientId === currentClientId)

  const activeMonthly = clientJobs
    .filter(j => j.status === 'Active')
    .reduce((acc, j) => {
      const match = j.rate.match(/\$(\d+)k/)
      return acc + (match ? parseInt(match[1]) * 1000 : 0)
    }, 0)

  const outstanding = clientInvoices
    .filter(i => i.status === 'Due')
    .reduce((acc, i) => acc + i.amountRaw, 0)

  const paidTotal = clientInvoices
    .filter(i => i.status === 'Paid')
    .reduce((acc, i) => acc + i.amountRaw, 0)

  const filtered = clientInvoices.filter(i =>
    i.label.toLowerCase().includes(search.toLowerCase()) ||
    i.status.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-2">Billing</p>
        <h2 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">Commercial spend</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-foreground text-background rounded-2xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-background/40 mb-3">Active /mo</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] leading-none">
            ${activeMonthly.toLocaleString()}
          </p>
          <p className="font-text text-sm text-background/50 mt-4">{clientJobs.filter(j => j.status === 'Active').length} active engagements</p>
        </div>

        <div className={`border rounded-2xl p-6 bg-background ${outstanding > 0 ? 'border-amber-200' : 'border-border'}`}>
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Outstanding</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">
            ${outstanding.toLocaleString()}
          </p>
          <p className={`font-text text-sm mt-4 ${outstanding > 0 ? 'text-amber-600' : 'text-muted-foreground'}`}>
            {clientInvoices.filter(i => i.status === 'Due').length} milestone{clientInvoices.filter(i => i.status === 'Due').length !== 1 ? 's' : ''} due
          </p>
        </div>

        <div className="border border-border rounded-2xl p-6 bg-background">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Paid to date</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">
            ${paidTotal.toLocaleString()}
          </p>
          <p className="font-text text-sm text-muted-foreground mt-4">
            {clientInvoices.filter(i => i.status === 'Paid').length} milestones cleared
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Filter invoices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl font-text text-sm focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <button className="px-4 py-2.5 border border-border rounded-xl font-text text-sm font-semibold hover:bg-muted transition-colors">
            Export CSV
          </button>
        </div>

        <div className="border border-border rounded-2xl overflow-x-auto bg-background">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Status</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Milestone</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Job</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Pod</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 text-right">Amount</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(invoice => {
                const job = jobs.find(j => j.slug === invoice.jobSlug)
                const pod = job?.podSlug ? getPodBySlug(job.podSlug) : null
                return (
                  <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-[240px]">
                      <p className="font-text text-sm font-semibold text-foreground leading-tight truncate">{invoice.label}</p>
                    </td>
                    <td className="px-5 py-4">
                      {job ? (
                        <Link href={`/client/dashboard/jobs/${job.slug}`} className="font-text text-sm text-primary hover:underline">
                          {job.title}
                        </Link>
                      ) : <span className="text-muted-foreground/70">â€”</span>}
                    </td>
                    <td className="px-5 py-4">
                      {pod ? (
                        <Link href={`/client/dashboard/search/${pod.slug}`} className="font-text text-sm text-primary hover:underline">
                          {pod.name}
                        </Link>
                      ) : <span className="font-text text-sm text-muted-foreground/70">â€”</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono text-sm font-bold text-foreground">{invoice.amount}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-text text-xs text-muted-foreground">{invoice.date}</span>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center font-text text-sm text-muted-foreground/70">No invoices match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
