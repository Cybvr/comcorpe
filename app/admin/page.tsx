'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTalent, getClients, getJobs } from '@/lib/admin/store'
import type { Job } from '@/lib/jobs'
import type { User } from '@/lib/user'

const STATUS_COLOR: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Scoping: 'bg-primary/10 text-primary',
  Completed: 'bg-border text-muted-foreground',
  Paused: 'bg-yellow-100 text-yellow-700',
  'Pod review': 'bg-accent/10 text-accent',
}

export default function AdminOverviewPage() {
  const [talent, setTalent] = useState<User[]>([])
  const [clients, setClients] = useState<User[]>([])
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    ;(async () => {
      setTalent(await getTalent())
      setClients(await getClients())
      setJobs(await getJobs())
    })()
  }, [])

  const activeJobs = jobs.filter(j => j.status === 'Active').length
  const scopingJobs = jobs.filter(j => j.status === 'Scoping').length

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-[32px] tracking-hero text-foreground leading-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage platform data stored in Firestore.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Talent', value: talent.length, href: '/admin/talent' },
          { label: 'Clients', value: clients.length, href: '/admin/clients' },
          { label: 'Active Jobs', value: activeJobs, href: '/admin/jobs' },
          { label: 'Scoping Jobs', value: scopingJobs, href: '/admin/jobs' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-border p-5 hover:border-foreground transition-colors duration-100 group"
          >
            <p className="font-display text-[36px] leading-none text-foreground group-hover:text-primary transition-colors duration-100">
              {stat.value}
            </p>
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground/70 mt-2">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl tracking-h3 text-foreground">Recent Jobs</h2>
          <Link href="/admin/jobs" className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground/70 hover:text-foreground transition-colors duration-100">
            View all →
          </Link>
        </div>
        <div className="border border-border divide-y divide-border">
          {jobs.slice(0, 5).map(job => (
            <div key={job.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-text text-sm font-semibold text-foreground truncate">{job.title}</p>
                <p className="font-mono text-[11px] text-muted-foreground/70 mt-0.5">{job.clientId} · {job.type}</p>
              </div>
              <span className={`shrink-0 font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 ${STATUS_COLOR[job.status] ?? 'bg-border text-muted-foreground'}`}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/admin/talent/new', label: 'Add talent operator' },
          { href: '/admin/jobs/new', label: 'Post a new job' },
          { href: '/admin/clients/new', label: 'Add a client' },
        ].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="border border-border px-5 py-4 font-text text-sm font-semibold text-foreground hover:bg-foreground hover:text-background transition-colors duration-100"
          >
            + {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
