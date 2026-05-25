'use client'

import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import ClientAvatar from '@/components/dashboard/ClientAvatar'
import { type JobStatus, getJobProgress, useJobs } from '@/lib/jobs'
import { useCurrentUser } from '@/lib/user'
import ClientDashboardLoading from './loading'
import SLABadge from '@/components/dashboard/SLABadge'

const statusStyles: Record<JobStatus, string> = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-primary/10 text-primary border-primary/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-border text-muted-foreground border-input',
  Completed: 'bg-border text-muted-foreground border-input',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
}

export default function ClientDashboardHome() {
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { jobs, loading: jobsLoading } = useJobs()

  if (userLoading || jobsLoading || !currentUser) {
    return <ClientDashboardLoading />
  }

  const companyJobs = jobs
    .filter(j => j.clientId === currentUser.clientId)
    .sort((a, b) => {
      const order: JobStatus[] = ['Active', 'Pod review', 'Scoping', 'Paused', 'Completed', 'Cancelled']
      return order.indexOf(a.status) - order.indexOf(b.status)
    })

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1040px] mx-auto">

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-muted-foreground/60 mb-2">
              {currentUser.company ?? 'Dashboard'}
            </p>
            <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">
              Good morning, {currentUser.name.split(' ')[0]}
            </h1>
          </div>
          <Link
            href="/client/dashboard/jobs/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
          >
            New job <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>

      {/* Pending approvals banner */}
      {currentUser.approverRole && (() => {
        const pendingCount = jobs.filter(j => j.approvalStatus === 'pending-approval').length
        return pendingCount > 0 ? (
          <div className="mb-8 flex items-center justify-between gap-4 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full shrink-0 animate-pulse" />
              <p className="font-text text-sm font-semibold text-amber-800">
                {pendingCount} brief{pendingCount !== 1 ? 's' : ''} awaiting your approval
              </p>
            </div>
            <Link
              href="/client/dashboard/jobs"
              className="font-text text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors underline underline-offset-2"
            >
              Review now
            </Link>
          </div>
        ) : null
      })()}

      {/* Jobs */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">
            My Jobs
            {companyJobs.length > 0 && (
              <span className="ml-2 font-mono text-[12px] font-bold text-muted-foreground/50 tracking-normal">
                {companyJobs.length}
              </span>
            )}
          </h2>
          {companyJobs.length > 0 && (
            <Link href="/client/dashboard/jobs" className="font-text text-xs text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          )}
        </div>

        {companyJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {companyJobs.map((job) => {
              const progress = getJobProgress(job)
              const nextMilestone = job.milestones?.find(m => m.status !== 'completed')?.title ?? job.nextMilestone ?? 'Scope review'

              return (
                <Link
                  key={job.id}
                  href={`/client/dashboard/jobs/${job.slug}`}
                  className="group border border-border rounded-2xl p-5 bg-background hover:border-input hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <ClientAvatar client={currentUser} sizeClass="w-11 h-11" iconSize={19} />
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 border border-border rounded-sm text-muted-foreground">
                        {job.type}
                      </span>
                      <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[job.status]}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-black text-[19px] tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors leading-tight">
                      {job.title}
                    </h3>
                    <p className="font-text text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {job.summary}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-[11px] text-muted-foreground/70">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <MapPin size={12} strokeWidth={1.5} className="shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </span>
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Clock size={12} strokeWidth={1.5} className="shrink-0" />
                      <span className="truncate">{job.time}</span>
                    </span>
                    <span className="flex items-center gap-1.5 min-w-0">
                      <CalendarDays size={12} strokeWidth={1.5} className="shrink-0" />
                      <span className="truncate">{job.updatedAt}</span>
                    </span>
                  </div>

                  <div className="mt-5 pt-4 border-t border-muted">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="font-text text-xs text-muted-foreground truncate">{nextMilestone}</p>
                      <span className="font-mono text-[10px] font-bold text-foreground shrink-0">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-2xl p-10 bg-background text-center">
            <Briefcase size={24} strokeWidth={1.5} className="mx-auto text-primary mb-3" />
            <h3 className="font-display font-black text-[18px] tracking-[-0.02em] text-foreground">No jobs yet</h3>
            <p className="font-text text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Create your first brief to start matching with the right operators and pods.
            </p>
            <Link
              href="/client/dashboard/jobs/new"
              className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Create new job <ArrowUpRight size={14} />
            </Link>
            <div className="mt-5 flex justify-center">
              <SLABadge variant="banner" className="max-w-sm" />
            </div>
          </div>
        )}
      </section>

    </div>
  )
}
