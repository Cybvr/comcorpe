'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { invoices, type InvoiceStatus } from '@/lib/invoices'
import { jobs } from '@/lib/jobs'
import { currentClientId } from '@/lib/session'

const statusStyles: Record<InvoiceStatus, string> = {
  Paid:  'bg-green-50 text-green-700 border-green-200',
  Due:   'bg-amber-50 text-amber-700 border-amber-200',
  Draft: 'bg-ink-5 text-ink-60 border-ink-10',
}

export default function ClientBillingPage() {
  const [search, setSearch] = useState('')

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
    i.meta.toLowerCase().includes(search.toLowerCase()) ||
    i.status.toLowerCase().includes(search.toLowerCase())
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
            {clientInvoices.filter(i => i.status === 'Due').length} invoice{clientInvoices.filter(i => i.status === 'Due').length !== 1 ? 's' : ''} due
          </p>
        </div>

        <div className="border border-ink-10 rounded-2xl p-6 bg-paper">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Paid to date</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] text-ink leading-none">
            ${paidTotal.toLocaleString()}
          </p>
          <p className="font-text text-sm text-ink-60 mt-4">
            {clientInvoices.filter(i => i.status === 'Paid').length} invoices cleared
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-40" />
            <input
              type="text"
              placeholder="Filter invoices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-paper border border-ink-10 rounded-xl font-text text-sm focus:outline-none focus:border-blue/40 transition-colors"
            />
          </div>
          <button className="px-4 py-2.5 border border-ink-10 rounded-xl font-text text-sm font-semibold hover:bg-ink-5 transition-colors">
            Export CSV
          </button>
        </div>

        <div className="border border-ink-10 rounded-2xl overflow-hidden bg-paper">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink-10 bg-ink-5/50">
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Status</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Invoice</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Job</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 text-right">Amount</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-10">
              {filtered.map(invoice => {
                const job = jobs.find(j => j.slug === invoice.jobSlug)
                return (
                  <tr key={invoice.id} className="hover:bg-ink-5/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-text text-sm font-semibold text-ink leading-tight">{invoice.label}</p>
                      <p className="font-text text-xs text-ink-40 mt-0.5">{invoice.meta}</p>
                    </td>
                    <td className="px-5 py-4">
                      {job ? (
                        <Link href={`/client/dashboard/jobs/${job.slug}`} className="font-text text-sm text-blue hover:underline">
                          {job.title}
                        </Link>
                      ) : <span className="text-ink-40">—</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono text-sm font-bold text-ink">{invoice.amount}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-text text-xs text-ink-60">{invoice.date}</span>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center font-text text-sm text-ink-40">No invoices match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
