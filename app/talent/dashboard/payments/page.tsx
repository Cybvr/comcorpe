'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
  type SortKey = 'amount' | 'client' | 'date'
  type SortDir = 'asc' | 'desc'

  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { jobs, loading: jobsLoading } = useJobs()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'All'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown size={11} className="ml-1 inline text-muted-foreground/40" />
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="ml-1 inline text-foreground" />
      : <ChevronDown size={11} className="ml-1 inline text-foreground" />
  }

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

  const filtered = payouts
    .filter((p) => {
      if (statusFilter !== 'All' && p.status !== statusFilter) return false
      const q = search.toLowerCase()
      return (
        p.label.toLowerCase().includes(q) ||
        getClientUser(p.clientId).name.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortKey === 'amount') cmp = a.amountRaw - b.amountRaw
      else if (sortKey === 'client') cmp = getClientUser(a.clientId).name.localeCompare(getClientUser(b.clientId).name)
      else if (sortKey === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div>
        <h1 className="font-display text-[18px] font-black leading-tight tracking-[-0.03em] text-foreground md:text-[20px]">
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
          </div>

          <div className="min-w-[220px] snap-start rounded-2xl border border-border bg-background p-4 md:min-w-0 md:p-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Cleared</p>
            <p className="font-text text-base font-bold leading-none text-foreground">
              ${clearedTotal.toLocaleString()}
            </p>
          </div>

          <div className={`min-w-[220px] snap-start rounded-2xl border bg-background p-4 md:min-w-0 md:p-6 ${nextPayout ? 'border-amber-200' : 'border-border'}`}>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Next payout</p>
            {nextPayout ? (
              <>
                <p className="font-text text-base font-bold leading-none text-foreground">
                  {nextPayout.amount}
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-sm flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search payouts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 font-text text-sm transition-colors focus:border-primary/40 focus:outline-none"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PayoutStatus | 'All')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              <SelectItem value="Cleared">Cleared</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="ml-auto">Export CSV</Button>
        </div>

        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Status</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort('client')} className="flex items-center hover:text-foreground transition-colors">
                    Client <SortIcon col="client" />
                  </button>
                </TableHead>
                <TableHead>Pod</TableHead>
                <TableHead className="text-right">
                  <button type="button" onClick={() => toggleSort('amount')} className="ml-auto flex items-center hover:text-foreground transition-colors">
                    Amount <SortIcon col="amount" />
                  </button>
                </TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort('date')} className="flex items-center hover:text-foreground transition-colors">
                    Date <SortIcon col="date" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((payout) => {
                const job = jobs.find((j) => j.slug === payout.jobSlug)
                const pod = job?.podSlug ? getPodBySlug(job.podSlug) : null
                return (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyles[payout.status]}`}>
                        {payout.status}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      <p className="truncate font-text text-sm font-semibold leading-tight text-foreground">{payout.label}</p>
                      {payout.meta && (
                        <p className="mt-0.5 truncate font-text text-xs text-muted-foreground/70">{payout.meta}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      {job ? (
                        <Link href={`/talent/dashboard/jobs/${job.slug}`} className="font-text text-sm text-primary hover:underline">
                          {getClientUser(payout.clientId).name}
                        </Link>
                      ) : (
                        <span className="font-text text-sm text-muted-foreground">{getClientUser(payout.clientId).name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {pod ? (
                        <Link href={`/talent/dashboard/search/${pod.slug}`} className="font-text text-sm text-primary hover:underline">
                          {pod.name}
                        </Link>
                      ) : (
                        <span className="font-text text-sm text-muted-foreground/70">–</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-sm font-bold text-foreground">{payout.amount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-text text-xs text-muted-foreground">{payout.date}</span>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="py-12 text-center font-text text-sm text-muted-foreground/70">
                    No payouts match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
