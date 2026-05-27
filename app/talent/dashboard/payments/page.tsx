'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser, getClientUser } from '@/lib/user'
import { payouts, type PayoutStatus } from '@/lib/payouts'
import { useJobs } from '@/lib/jobs'
import { getPodBySlug } from '@/lib/pods'

const statusStyles: Record<PayoutStatus, string> = {
  Cleared: 'bg-green-50 text-green-700 border-green-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-primary/10 text-primary border-primary/20',
}

export default function TalentPaymentsPage() {
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { jobs, loading: jobsLoading } = useJobs()
  const [search, setSearch] = useState('')

  if (userLoading || jobsLoading || !currentUser) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div>
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-9 w-52" />
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 hide-scrollbar md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex gap-3 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="min-w-[220px] snap-start rounded-2xl border border-border bg-background p-4 md:min-w-0 md:p-6">
                <Skeleton className="mb-3 h-3 w-20" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="mt-3 h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-11 max-w-sm flex-1 rounded-xl" />
            <Skeleton className="h-11 w-28 rounded-xl" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <div className="border-b border-border bg-muted/50 px-5 py-3.5">
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="space-y-0">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="hidden h-4 w-24 md:block" />
                  <Skeleton className="hidden h-4 w-20 md:block" />
                  <Skeleton className="h-4 w-18" />
                  <Skeleton className="hidden h-4 w-16 md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
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
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-eyebrow text-primary">Payments</p>
        <h1 className="font-display text-[32px] font-black leading-tight tracking-[-0.03em] text-foreground">
          Your earnings
        </h1>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 hide-scrollbar md:mx-0 md:overflow-visible md:px-0 md:pb-0">
        <div className="flex gap-3 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-4">
          <div className="min-w-[220px] snap-start rounded-2xl border border-border bg-background p-4 md:min-w-0 md:p-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Pending</p>
            <p className="font-text text-base font-bold leading-none text-foreground">
              ${pendingTotal.toLocaleString()}
            </p>
            <p className="mt-3 font-text text-xs text-muted-foreground md:mt-4 md:text-sm">
              {payouts.filter((p) => p.status === 'Pending' || p.status === 'Processing').length} in flight
            </p>
          </div>

          <div className="min-w-[220px] snap-start rounded-2xl border border-border bg-background p-4 md:min-w-0 md:p-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Cleared</p>
            <p className="font-text text-base font-bold leading-none text-foreground">
              ${clearedTotal.toLocaleString()}
            </p>
            <p className="mt-3 font-text text-xs text-muted-foreground md:mt-4 md:text-sm">
              {payouts.filter((p) => p.status === 'Cleared').length} payouts received
            </p>
          </div>

          <div className={`min-w-[220px] snap-start rounded-2xl border bg-background p-4 md:min-w-0 md:p-6 ${nextPayout ? 'border-amber-200' : 'border-border'}`}>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Next payout</p>
            {nextPayout ? (
              <>
                <p className="font-text text-base font-bold leading-none text-foreground">
                  {nextPayout.amount}
                </p>
                <p className="mt-3 font-text text-xs text-amber-600 md:mt-4 md:text-sm">
                  {nextPayout.date} - {getClientUser(nextPayout.clientId).name}
                </p>
              </>
            ) : (
              <p className="font-text text-base font-bold leading-none text-muted-foreground/70">
                Nothing due
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Filter payouts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 font-text text-sm transition-colors focus:border-primary/40 focus:outline-none"
            />
          </div>
          <button className="rounded-xl border border-border px-4 py-2.5 font-text text-sm font-semibold transition-colors hover:bg-muted">
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Status</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Milestone</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Client</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Pod</th>
                <th className="px-5 py-3.5 text-right font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Amount</th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((payout) => {
                const job = jobs.find((j) => j.slug === payout.jobSlug)
                const pod = job?.podSlug ? getPodBySlug(job.podSlug) : null

                return (
                  <tr key={payout.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyles[payout.status]}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="max-w-[260px] px-5 py-4">
                      <p className="truncate font-text text-sm font-semibold leading-tight text-foreground">{payout.label}</p>
                      {payout.meta && (
                        <p className="mt-0.5 truncate font-text text-xs text-muted-foreground/70">{payout.meta}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {job ? (
                        <Link href={`/talent/dashboard/jobs/${job.slug}`} className="font-text text-sm text-primary hover:underline">
                          {getClientUser(payout.clientId).name}
                        </Link>
                      ) : (
                        <span className="font-text text-sm text-muted-foreground">{getClientUser(payout.clientId).name}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {pod ? (
                        <Link href={`/talent/dashboard/search/${pod.slug}`} className="font-text text-sm text-primary hover:underline">
                          {pod.name}
                        </Link>
                      ) : (
                        <span className="font-text text-sm text-muted-foreground/70">-</span>
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
