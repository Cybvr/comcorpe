'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Briefcase,
  ChevronRight,
  Gift,
  MessageCircle,
  Pencil,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { User } from '@/lib/user'
import JobCard from '@/components/dashboard/JobCard'
import GrowthCommunity from '@/components/dashboard/GrowthCommunity'
import { useJobs } from '@/lib/jobs'
import { referral } from '@/lib/referrals'
import { resolveClientUser, useCurrentUser, useUsers } from '@/lib/user'
import TalentDashboardLoading from './loading'

function TalentProfileCard({ user }: { user: User }) {
  const fields = [user.talentRole, user.desc, user.rate, user.availability, user.location, user.image, user.yearsExp, user.linkedinUrl]
  const pct = Math.round((fields.filter(Boolean).length / fields.length) * 100)

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center px-5 pt-6 pb-5 border-b border-border">
        <div className="w-16 h-16 bg-foreground shrink-0 overflow-hidden relative mb-3">
          {user.image
            ? <Image src={user.image} alt={user.name} fill className="object-cover" />
            : <div className="w-full h-full flex items-center justify-center font-display font-black text-[22px] text-background">{user.initials}</div>
          }
        </div>
        <Link href="/talent/dashboard/settings" className="font-display font-black text-[17px] tracking-[-0.02em] text-foreground hover:text-primary underline underline-offset-2 leading-tight">
          {user.name}
        </Link>
        {user.talentRole && (
          <p className="font-text text-sm text-muted-foreground mt-0.5 line-clamp-1">{user.talentRole}</p>
        )}
      </div>

      {/* Profile completeness */}
      <div className="px-5 py-4 border-b border-border bg-muted/40">
        <div className="flex items-center justify-between mb-2">
          <span className="font-text text-sm font-semibold text-foreground">Profile Completeness</span>
          <span className="font-mono text-xs text-muted-foreground">{pct}%</span>
        </div>
        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {pct < 100 && (
          <Link href="/talent/dashboard/settings" className="font-text text-xs text-primary mt-2 inline-block hover:underline">
            Complete your profile →
          </Link>
        )}
      </div>

      {/* Stat rows */}
      <div className="divide-y divide-border">
        {[
          { label: 'Availability', value: user.availability },
          { label: 'Rate', value: user.rate },
          { label: 'Location', value: user.location },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-text text-sm font-medium text-foreground">{label}</p>
              <p className="font-text text-sm text-muted-foreground mt-0.5">
                {value || <span className="italic opacity-50">Not set</span>}
              </p>
            </div>
            <Link href="/talent/dashboard/settings" className="text-muted-foreground hover:text-foreground transition-colors">
              <Pencil size={14} />
            </Link>
          </div>
        ))}
      </div>

      {/* Disciplines */}
      {user.disciplines && user.disciplines.length > 0 && (
        <div className="px-5 py-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="font-text text-sm font-semibold text-foreground">My Categories</p>
            <Link href="/talent/dashboard/settings" className="text-muted-foreground hover:text-foreground transition-colors">
              <Pencil size={14} />
            </Link>
          </div>
          <div className="flex flex-col gap-1.5">
            {user.disciplines.map(d => (
              <span key={d} className="font-text text-sm text-primary">{d}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type HomeAction = {
  icon: LucideIcon
  title: string
  cta: string
  href: string
}

const homeActions: HomeAction[] = [
  {
    icon: Briefcase,
    title: 'Find your next job',
    cta: 'Browse jobs',
    href: '/talent/dashboard/jobs',
  },
  {
    icon: MessageCircle,
    title: 'Get growth strategy help',
    cta: 'Browse articles',
    href: '/talent/dashboard/community',
  },
  {
    icon: Users,
    title: 'Refer a client or talent',
    cta: 'Start referring',
    href: '/talent/dashboard/referrals',
  },
]

export default function DashboardPage() {
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { users } = useUsers()
  const { jobs, loading: jobsLoading } = useJobs()
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 8
  const totalPages = Math.ceil(jobs.length / itemsPerPage)
  const paginatedJobs = jobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (userLoading || jobsLoading || !currentUser) {
    return <TalentDashboardLoading />
  }

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <h1 className="font-display font-black text-[18px] tracking-[-0.03em] text-foreground leading-none md:text-[20px]">
          Hi, {currentUser.name}!
        </h1>
        <div className="flex items-center gap-3">
          <Link href="/talent/dashboard/referrals" className="font-text text-sm font-semibold px-4 py-2 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]">
            Refer &amp; earn
          </Link>
        </div>
      </div>

      <section className="bg-foreground rounded-xl p-4 mb-6 dark-inv-section relative overflow-hidden">
        <div
          className="absolute -top-8 -right-8 font-display font-black text-[120px] leading-none tracking-[-0.06em] italic select-none pointer-events-none"
          style={{
            background: 'linear-gradient(180deg,rgba(31,77,255,0.25) 0%,rgba(123,59,255,0.08) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          e
        </div>
        <p className="font-mono text-xs text-background/50 uppercase tracking-eyebrow mb-3">Welcome to Comcorpe</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
          {homeActions.map(({ icon: Icon, title, cta, href }) => (
            <div key={title} className="bg-background/[0.08] rounded-xl p-3 flex items-center justify-between border border-background/[0.12] hover:bg-background/[0.14] transition-colors gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={16} strokeWidth={1.5} className="text-primary shrink-0" />
                <p className="font-display font-black text-[13px] leading-tight text-background truncate">{title}</p>
              </div>
              <Link href={href} className="font-text text-[10px] font-semibold px-2.5 py-1.5 bg-background/[0.12] text-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms] shrink-0 whitespace-nowrap">
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile-only profile card — shown between welcome and job matches */}
      <div className="xl:hidden mb-6">
        <TalentProfileCard user={currentUser} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">Your newest matches</h2>
              <Link href="/talent/dashboard/jobs" className="font-text text-xs text-primary hover:underline flex items-center gap-1">
                View all jobs <ChevronRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {paginatedJobs.map((job) => (
                <JobCard key={job.id} job={job} client={resolveClientUser(job.clientId, users)} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs font-semibold rounded-md border border-border disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs font-mono text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-xs font-semibold rounded-md border border-border disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>

        <div className="hidden xl:flex flex-col gap-4">
          <TalentProfileCard user={currentUser} />
          <GrowthCommunity audience="talent" />
        </div>
      </div>
    </div>
  )
}
