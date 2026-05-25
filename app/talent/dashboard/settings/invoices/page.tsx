'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useCurrentUser, getClientUser } from '@/lib/user'
import { payouts, ccreditsBalance, type PayoutStatus } from '@/lib/payouts'
import { useJobs } from '@/lib/jobs'
import { getPodBySlug } from '@/lib/pods'

const statusStyles: Record<PayoutStatus, string> = {
  Cleared: 'bg-green-50 text-green-700 border-green-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-primary/10 text-primary border-primary/20',
}

export default function TalentInvoicesPage() {
  const { user: currentUser } = useCurrentUser()
  const { jobs } = useJobs()
  const [search, setSearch] = useState('')

  if (!currentUser) {
    return <p className="font-text text-sm text-muted-foreground">Loading...</p>
  }

  const pendingTotal = payouts
    .filter((p) => p.status === 'Pending' || p.status === 'Processing')
    .reduce((a, p) => a + p.amountRaw, 0)
  const clearedTotal = payouts
    .filter((p) => p.status === 'Cleared')
    .reduce((a, p) => a + p.amountRaw, 0)
  const nextPayout = payouts
    .filter((p) => p.status === 'Pending')
    .sort((a, b) => a.id - b.id)[0]

  const filtered = payouts.filter(
    (p) =>
      p.label.toLowerCase().includes(search.toLowerCase()) ||
      getClientUser(p.clientId).name.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-2">Invoices</p>
        <h2 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">
          Your earnings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-foreground text-background rounded-2xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-background/40 mb-3">CCredits</p>
          <p className="font-display font-black text-[48px] tracking-[-0.03em] leading-none">{ccreditsBalance}</p>
          <p className="font-text text-sm text-background/50 mt-4">Apply to priority briefs</p>
        </div>
        <div className="border border-border rounded-2xl p-6 bg-background">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Pending</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">
            ${pendingTotal.toLocaleString()}
          </p>
          <p className="font-text text-sm text-muted-foreground mt-4">
            {payouts.filter((p) => p.status === 'Pending' || p.status === 'Processing').length} in flight
          </p>
        </div>
        <div className="border border-border rounded-2xl p-6 bg-background">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Cleared</p>
          <p className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">
            ${clearedTotal.toLocaleString()}
          </p>
          <p className="font-text text-sm text-muted-foreground mt-4">
            {payouts.filter((p) => p.status === 'Cleared').length} payouts received
          </p>
        </div>
        <div className={`border rounded-2xl p-6 bg-background ${nextPayout ? 'border-amber-200' : 'border-border'}`}>
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Next payout</p>
          {nextPayout ? (
            <>
              <p className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">
                {nextPayout.amount}
              </p>
              <p className="font-text text-sm text-amber-600 mt-4">
                {nextPayout.date} · {getClientUser(nextPayout.clientId).name}
              </p>
            </>
          ) : (
            <p className="font-display font-black text-[28px] tracking-[-0.03em] text-muted-foreground/70 leading-none">
              Nothing due
            </p>
          )}
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
              onChange={(e) => setSearch(e.target.value)}
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
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Client</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Pod</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 text-right">Amount</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((payout) => {
                const job = jobs.find((j) => j.slug === payout.jobSlug)
                const pod = job?.podSlug ? getPodBySlug(job.podSlug) : null
                return (
                  <tr key={payout.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[payout.status]}`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-[260px]">
                      <p className="font-text text-sm font-semibold text-foreground leading-tight truncate">{payout.label}</p>
                      {payout.meta && (
                        <p className="font-text text-xs text-muted-foreground/70 mt-0.5 truncate">{payout.meta}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {job ? (
                        <Link
                          href={`/talent/dashboard/jobs/${job.slug}`}
                          className="font-text text-sm text-primary hover:underline"
                        >
                          {getClientUser(payout.clientId).name}
                        </Link>
                      ) : (
                        <span className="font-text text-sm text-muted-foreground">{getClientUser(payout.clientId).name}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {pod ? (
                        <Link
                          href={`/talent/dashboard/search/${pod.slug}`}
                          className="font-text text-sm text-primary hover:underline"
                        >
                          {pod.name}
                        </Link>
                      ) : (
                        <span className="font-text text-sm text-muted-foreground/70">–</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono text-sm font-bold text-foreground">{payout.amount}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-text text-xs text-muted-foreground">{payout.date}</span>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center font-text text-sm text-muted-foreground/70">
                    No invoices match your search.
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
