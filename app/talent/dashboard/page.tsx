'use client'

import Link from 'next/link'
import {
  Briefcase,
  ChevronRight,
  Gift,
  MessageCircle,
  Users,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import JobCard from '@/components/dashboard/JobCard'
import OperatorCard from '@/components/dashboard/OperatorCard'
import GrowthCommunity from '@/components/dashboard/GrowthCommunity'
import SpaceCard from '@/components/dashboard/SpaceCard'
import { useJobs } from '@/lib/jobs'
import { topOperators } from '@/lib/operators'
import { referral } from '@/lib/referrals'
import { spaces } from '@/lib/spaces'
import { useCurrentUser } from '@/lib/user'
import TalentDashboardLoading from './loading'

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
    cta: 'Browse community',
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
  const { jobs, loading: jobsLoading } = useJobs()

  if (userLoading || jobsLoading || !currentUser) {
    return <TalentDashboardLoading />
  }

  const assignedSlugs = currentUser.assignedJobSlugs ?? []
  const assignedJobs = jobs.filter((job) => assignedSlugs.includes(job.slug))

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-none">
          Hi, {currentUser.name}!
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-border rounded-full px-4 py-2 text-sm text-foreground">
            <Zap size={14} strokeWidth={1.5} className="text-primary" />
            <span className="font-mono font-bold text-xs">CCREDITS</span>
            <span className="font-display font-black text-[18px] leading-none">{currentUser.credits}</span>
          </div>
          <Link href="/talent/dashboard/referrals" className="font-text text-sm font-semibold px-4 py-2 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]">
            Refer &amp; earn
          </Link>
        </div>
      </div>

      <section className="bg-foreground rounded-xl p-6 mb-8 dark-inv-section relative overflow-hidden">
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
        <p className="font-mono text-xs text-background/50 uppercase tracking-eyebrow mb-4">Welcome to Comcorpe</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {homeActions.map(({ icon: Icon, title, cta, href }) => (
            <div key={title} className="bg-background/[0.08] rounded-lg p-4 flex flex-col gap-3 border border-background/[0.12] hover:bg-background/[0.14] transition-colors">
              <Icon size={20} strokeWidth={1.5} className="text-primary" />
              <p className="font-display font-black text-[15px] leading-tight text-background">{title}</p>
              <Link href={href} className="font-text text-xs font-semibold px-3 py-1.5 bg-background/[0.12] text-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms] w-fit">
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

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
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">My assigned work</h2>
              <Link href="/talent/dashboard/work" className="font-text text-xs text-primary hover:underline flex items-center gap-1">
                View all work <ChevronRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {assignedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">Spaces you might like</h2>
            </div>
            <div className="flex flex-col gap-3">
              {spaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-4">Get inspired by top operators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topOperators.map((operator) => (
                <OperatorCard key={operator.id} operator={operator} />
              ))}
            </div>
          </section>

          <section className="border border-border rounded-xl p-6 bg-border/40">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div>
                <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-1">Refer Clients &amp; Talent</h2>
                <p className="font-text text-sm text-muted-foreground max-w-[36ch]">
                  Share your link and earn {referral.clientShare} of client billings for every client hired, and {referral.talentShare} of talent earnings for every job landed.
                </p>
                <div className="mt-4 flex flex-col xs:flex-row items-start xs:items-center gap-2">
                  <div className="w-full xs:flex-1 px-3 py-2 bg-background border border-border rounded-lg font-mono text-xs text-muted-foreground truncate">
                    {referral.link}
                  </div>
                  <button className="w-full xs:w-auto font-text text-xs font-semibold px-3 py-2 bg-foreground text-background rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]">
                    Copy
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {referral.channels.map((channel) => (
                    <button key={channel} className="font-mono text-[10px] uppercase tracking-eyebrow px-3 py-1.5 border border-input rounded-full text-muted-foreground hover:border-foreground hover:text-foreground transition-colors">
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
              <Gift size={28} strokeWidth={1.2} className="text-primary shrink-0 mt-1" />
            </div>
          </section>
        </div>

        <GrowthCommunity audience="talent" />
      </div>
    </div>
  )
}
