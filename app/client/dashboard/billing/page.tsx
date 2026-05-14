'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { clientInvoices } from '@/lib/invoices'
import { jobs } from '@/lib/jobs'
import { currentClient } from '@/lib/session'

const jobStatusStyles: Record<string, string> = {
  Active:       'bg-green-50 text-green-700 border-green-200',
  Scoping:      'bg-ink-5 text-ink-60 border-ink-10',
  'Pod review': 'bg-violet/10 text-violet border-violet/20',
  Paused:       'bg-orange-50 text-orange-700 border-orange-100',
  Completed:    'bg-blue-50 text-blue-700 border-blue-100',
}

const paymentStatusStyles: Record<string, string> = {
  Paid:    'bg-green-50 text-green-700 border-green-200',
  Due:     'bg-amber-50 text-amber-700 border-amber-200',
  Draft:   'bg-ink-5 text-ink-60 border-ink-10',
  None:    'bg-ink-5 text-ink-40 border-ink-10',
}

export default function ClientBillingPage() {
  const [search, setSearch] = useState('')

  const clientJobs = jobs.filter(j => j.client === currentClient)
  const clientInvoiceList = clientInvoices.filter(i => i.jobClient === currentClient)

  const activeMonthly = clientJobs
    .filter(j => j.status === 'Active')
    .reduce((acc, j) => {
      const match = j.rate.match(/\$(\d+)k/)
      return acc + (match ? parseInt(match[1]) * 1000 : 0)
    }, 0)

  const outstanding = clientInvoiceList
    .filter(i => i.status === 'Due')
    .reduce((acc, i) => acc + i.amountRaw, 0)

  const paidTotal = clientInvoiceList
    .filter(i => i.status === 'Paid')
    .reduce((acc, i) => acc + i.amountRaw, 0)

  const billedByJob = clientInvoiceList.reduce<Record<string, number>>((acc, i) => {
    if (i.jobSlug) acc[i.jobSlug] = (acc[i.jobSlug] ?? 0) + i.amountRaw
    return acc
  }, {})

  const paymentStatusByJob = clientInvoiceList.reduce<Record<string, string>>((acc, i) => {
    if (!i.jobSlug) return acc
    const current = acc[i.jobSlug]
    if (!current || i.status === 'Due') acc[i.jobSlug] = i.status
    return acc
  }, {})

  const filtered = clientJobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.status.toLowerCase().includes(search.toLowerCase()) ||
    j.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1100px] mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Billing</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Commercial spend</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-ink text-paper rounded-2xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-paper/40 mb-3">Active /mo</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] leading-none">
            ${activeMonthly.toLocaleString()}
          </p>
          <p className="font-text text-sm text-paper/50 mt-4">{clientJobs.filter(j => j.status === 'Active').length} active engagements</p>
        </div>

        <div className={`border rounded-2xl p-6 bg-paper ${outstanding > 0 ? 'border-amber-200' : 'border-ink-10'}`}>
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Outstanding</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] text-ink leading-none">
            ${outstanding.toLocaleString()}
          </p>
          <p className={`font-text text-sm mt-4 ${outstanding > 0 ? 'text-amber-600' : 'text-ink-60'}`}>
            {clientInvoiceList.filter(i => i.status === 'Due').length} invoice{clientInvoiceList.filter(i => i.status === 'Due').length !== 1 ? 's' : ''} due
          </p>
        </div>

        <div className="border border-ink-10 rounded-2xl p-6 bg-paper">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Paid to date</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] text-ink leading-none">
            ${paidTotal.toLocaleString()}
          </p>
          <p className="font-text text-sm text-ink-60 mt-4">
            {clientInvoiceList.filter(i => i.status === 'Paid').length} invoices cleared
          </p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Commercial Activity</h2>
          <div className="flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-40" />
              <input
                type="text"
                placeholder="Search invoices or projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-paper border border-ink-10 rounded-xl font-text text-xs focus:outline-none focus:border-blue/40 transition-colors"
              />
            </div>
            <button className="px-3 py-2 border border-ink-10 rounded-xl font-text text-xs font-semibold hover:bg-ink-5 transition-colors">
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="border border-ink-10 rounded-2xl overflow-hidden bg-paper shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink-10 bg-ink-5/50">
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 font-bold">Invoice & Description</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 font-bold">Status</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 font-bold">Project</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 font-bold text-right">Amount</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 font-bold">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-10">
              {clientInvoiceList
                .filter(i => 
                  i.label.toLowerCase().includes(search.toLowerCase()) || 
                  (jobs.find(j => j.slug === i.jobSlug)?.title.toLowerCase().includes(search.toLowerCase()))
                )
                .map((invoice) => {
                  const job = jobs.find(j => j.slug === invoice.jobSlug)
                  return (
                    <tr key={invoice.id} className="hover:bg-ink-5/20 transition-colors group">
                      <td className="px-5 py-4">
                        <p className="font-text text-sm font-bold text-ink leading-tight group-hover:text-blue transition-colors">{invoice.label}</p>
                        <p className="font-text text-[10px] text-ink-40 mt-1 leading-relaxed">{invoice.meta}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${paymentStatusStyles[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {job ? (
                          <Link href={`/client/dashboard/jobs/${job.slug}`} className="font-text text-xs text-ink-60 hover:text-blue hover:underline decoration-blue/30 font-semibold">
                            {job.title}
                          </Link>
                        ) : (
                          <span className="text-ink-20">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-mono text-sm font-black text-ink">{invoice.amount}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-text text-xs text-ink-40 font-medium">{invoice.due}</span>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
