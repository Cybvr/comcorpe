'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, CalendarDays, Users, Flag, Banknote } from 'lucide-react'
import ClientAvatar from '@/components/dashboard/ClientAvatar'
import { getJobProgress } from '@/lib/jobs'
import { useJobs } from '@/lib/jobs'
import { useCurrentUser } from '@/lib/user'
import { Button } from '@/components/ui/button'

const statusStyles = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-primary/10 text-primary border-primary/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-border text-muted-foreground border-input',
}

export default function JobsPage() {
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { jobs, loading: jobsLoading } = useJobs()
  const [filter, setFilter] = useState<'all' | 'active'>('all')

  if (userLoading || jobsLoading || !currentUser) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1240px] mx-auto">
        <p className="font-text text-sm text-muted-foreground">Loading jobs...</p>
      </div>
    )
  }
  
  const clientJobs = jobs.filter(j => j.clientId === currentUser.clientId)
  const displayJobs = filter === 'active' ? clientJobs.filter(j => j.status === 'Active') : clientJobs

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1240px] mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 mb-12">
        {/* Title row — aligned with New job button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-none">My Jobs</h1>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground/70 font-mono text-[10px] uppercase tracking-wider">
              {clientJobs.length} total
            </span>
          </div>
          <Link
            href="/client/dashboard/jobs/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-text text-xs font-bold shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Plus size={14} /> New job
          </Link>
        </div>

        {/* Filters row */}
        <div className="inline-flex p-1 bg-muted rounded-lg w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-md font-text text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/70 hover:text-foreground'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-1.5 rounded-md font-text text-xs font-semibold transition-all flex items-center gap-2 ${
              filter === 'active' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground/70 hover:text-foreground'
            }`}
          >
            Active
            {clientJobs.filter(j => j.status === 'Active').length > 0 && (
              <span className={`w-1.5 h-1.5 rounded-full ${filter === 'active' ? 'bg-primary' : 'bg-input'}`} />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-[1040px]">
        {displayJobs.map((job) => {
          return (
          <Link
            key={`${job.clientId}-${job.slug}`}
            href={`/client/dashboard/jobs/${job.slug}`}
            className="group block border border-border rounded-2xl p-6 bg-background hover:border-input hover:shadow-xl transition-all flex flex-col gap-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <ClientAvatar client={currentUser} sizeClass="w-12 h-12" iconSize={20} />
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[job.status as keyof typeof statusStyles]}`}>
                      {job.status}
                    </span>
                    {job.phase && <span className="font-text text-xs text-muted-foreground/70">{job.phase}</span>}
                  </div>
                  <h2 className="font-display font-black text-[16px] tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors leading-tight">
                    {job.title}
                  </h2>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display font-black text-[20px] text-foreground leading-none">{getJobProgress(job)}%</div>
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mt-1">Progress</div>
              </div>
            </div>

            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${getJobProgress(job)}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-1 border-t border-muted">
              <div className="flex items-center gap-1.5">
                <Users size={12} strokeWidth={1.5} className="text-muted-foreground/70 shrink-0" />
                <span className="font-text text-[11px] text-muted-foreground/70">{job.lead || 'TBD'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flag size={12} strokeWidth={1.5} className="text-muted-foreground/70 shrink-0" />
                <span className="font-text text-[11px] text-muted-foreground/70">
                  {job.milestones?.find(m => m.status === 'pending')?.title || 'Scoping phase'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays size={12} strokeWidth={1.5} className="text-muted-foreground/70 shrink-0" />
                <span className="font-text text-[11px] text-muted-foreground/70">{job.nextReview || 'TBD'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Banknote size={12} strokeWidth={1.5} className="text-muted-foreground/70 shrink-0" />
                <span className="font-text text-[11px] text-muted-foreground/70">{job.rate}</span>
              </div>
              <span className="ml-auto font-text text-[10px] text-input uppercase tracking-widest">{job.updatedAt}</span>
            </div>
          </Link>
        )})}
      </div>
      
      {displayJobs.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="font-text text-muted-foreground/70">No {filter} jobs found.</p>
        </div>
      )}
    </div>
  )
}
