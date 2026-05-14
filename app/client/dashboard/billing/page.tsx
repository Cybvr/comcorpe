'use client'

import { useState } from 'react'
import { CreditCard, FileText, Search, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { clientInvoices } from '@/lib/invoices'
import { currentUser } from '@/lib/user'

const invoiceStatusStyles = {
  Paid: 'bg-green-50 text-green-700 border-green-200',
  Due: 'bg-amber-50 text-amber-700 border-amber-200',
  Draft: 'bg-ink-5 text-ink-60 border-ink-10',
}

export default function BillingPage() {
  const [search, setSearch] = useState('')
  
  // In a real app we'd filter by company, for the mock we'll show all or a subset
  const myInvoices = clientInvoices.filter(i => 
    i.label.toLowerCase().includes(search.toLowerCase()) || 
    i.status.toLowerCase().includes(search.toLowerCase())
  )

  const openTotal = clientInvoices
    .filter((invoice) => invoice.status === 'Due')
    .reduce((acc, inv) => acc + Number(inv.amount.replace(/[^0-9.-]+/g, "")), 0)

  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Billing</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Invoices</h1>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <article className="border border-ink-10 rounded-2xl p-6 bg-paper shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Open balance</p>
          <div className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">
            ${openTotal.toLocaleString()}
          </div>
          <p className="font-text text-sm text-ink-60 mt-4">Requires finance approval</p>
        </article>
        <article className="border border-ink-10 rounded-2xl p-6 bg-paper shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Draft charges</p>
          <div className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">
            {clientInvoices.filter((invoice) => invoice.status === 'Draft').length}
          </div>
          <p className="font-text text-sm text-ink-60 mt-4">Issued after client approval</p>
        </article>
        <article className="border border-ink-10 rounded-2xl p-6 bg-paper shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Paid retainers</p>
          <div className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">
            {clientInvoices.filter((invoice) => invoice.status === 'Paid').length}
          </div>
          <p className="font-text text-sm text-ink-60 mt-4">Cleared by finance</p>
        </article>
      </section>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-40" size={16} />
            <input
              type="text"
              placeholder="Filter invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-paper border border-ink-10 rounded-lg font-text text-sm focus:outline-none focus:border-blue transition-colors"
            />
          </div>
          <button className="px-4 py-2 border border-ink-10 rounded-lg font-text text-sm font-semibold hover:bg-ink-5 transition-colors">
            Export CSV
          </button>
        </div>

        <div className="border border-ink-10 rounded-xl overflow-hidden bg-paper shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink-10 bg-ink-5/50">
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-40 font-semibold">
                  <button className="flex items-center gap-2 hover:text-ink transition-colors">
                    Status <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-40 font-semibold">Label</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-40 font-semibold text-right">
                  <button className="ml-auto flex items-center gap-2 hover:text-ink transition-colors">
                    Amount <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-40 font-semibold">Due date</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-40 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-10">
              {myInvoices.map((invoice) => (
                <tr key={invoice.id} className="group hover:bg-ink-5/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${invoiceStatusStyles[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-text text-sm font-bold text-ink group-hover:text-blue transition-colors">
                        {invoice.label}
                      </span>
                      <span className="font-text text-xs text-ink-40 mt-0.5">
                        {invoice.meta}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-sm font-bold text-ink">
                      {invoice.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-text text-xs text-ink-60">
                      {invoice.due}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-ink-10 rounded-md transition-colors text-ink-40 hover:text-ink">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {myInvoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="font-text text-sm text-ink-40 italic">No invoices found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

