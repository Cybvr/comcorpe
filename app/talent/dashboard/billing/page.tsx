'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import { talentPayouts, ccreditsBalance } from '@/lib/billing'

const statusStyles: Record<string, string> = {
  Cleared:    'bg-green-50 text-green-700 border-green-200',
  Pending:    'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
}

export default function TalentBillingPage() {
  const [search, setSearch] = useState('')

  const pendingTotal = talentPayouts
    .filter(p => p.status === 'Pending' || p.status === 'Processing')
    .reduce((acc, p) => acc + p.amountRaw, 0)

  const clearedTotal = talentPayouts
    .filter(p => p.status === 'Cleared')
    .reduce((acc, p) => acc + p.amountRaw, 0)

  const nextPayout = talentPayouts
    .filter(p => p.status === 'Pending')
    .sort((a, b) => a.id - b.id)[0]

  const filtered = talentPayouts.filter(p =>
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    (p.client ?? '').toLowerCase().includes(search.toLowerCase()) ||
    p.status.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1100px] mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Billing</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Credits and earnings</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-ink text-paper rounded-2xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-paper/40 mb-3">CCredits balance</p>
          <p className="font-display font-black text-[48px] tracking-[-0.03em] leading-none">{ccreditsBalance}</p>
          <p className="font-text text-sm text-paper/50 mt-4">Apply to priority briefs</p>
        </div>

        <div className="border border-ink-10 rounded-2xl p-6 bg-paper md:col-span-1">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Pending clearance</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] text-ink leading-none">
            ${pendingTotal.toLocaleString()}
          </p>
          <p className="font-text text-sm text-ink-60 mt-4">
            {talentPayouts.filter(p => p.status === 'Pending' || p.status === 'Processing').length} invoices in flight
          </p>
        </div>

        <div className="border border-ink-10 rounded-2xl p-6 bg-paper">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Total cleared</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] text-ink leading-none">
            ${clearedTotal.toLocaleString()}
          </p>
          <p className="font-text text-sm text-ink-60 mt-4">
            {talentPayouts.filter(p => p.status === 'Cleared').length} payouts received
          </p>
        </div>

        <div className={`border rounded-2xl p-6 bg-paper ${nextPayout ? 'border-amber-200' : 'border-ink-10'}`}>
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Next payout</p>
          {nextPayout ? (
            <>
              <p className="font-display font-black text-[36px] tracking-[-0.03em] text-ink leading-none">{nextPayout.amount}</p>
              <p className="font-text text-sm text-amber-600 mt-4">{nextPayout.date} · {nextPayout.client}</p>
            </>
          ) : (
            <p className="font-display font-black text-[28px] tracking-[-0.03em] text-ink-40 leading-none">Nothing due</p>
          )}
        </div>
      </div>

      {/* Payout ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-40" />
            <input
              type="text"
              placeholder="Filter by project or status..."
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
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Description</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Brief</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 text-right">Your cut</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-10">
              {filtered.map(payout => (
                <tr key={payout.id} className="group hover:bg-ink-5/30 transition-colors">
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[payout.status]}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-text text-sm font-semibold text-ink leading-tight">{payout.label}</p>
                    {payout.note && (
                      <p className="font-text text-xs text-ink-40 mt-0.5">{payout.note}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {payout.jobSlug ? (
                      <Link
                        href={`/talent/dashboard/jobs/${payout.jobSlug}`}
                        className="inline-flex items-center gap-1 font-text text-sm text-blue hover:underline"
                      >
                        {payout.client} <ArrowUpRight size={11} />
                      </Link>
                    ) : (
                      <span className="font-text text-sm text-ink-40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-mono text-sm font-bold text-ink">{payout.amount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-text text-xs text-ink-60">{payout.date}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center font-text text-sm text-ink-40">
                    No payouts match your search.
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
