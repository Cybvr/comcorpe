import Link from 'next/link'
import {
  Briefcase,
  ChevronRight,
  Gift,
  MessageCircle,
  RotateCcw,
  Users,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ApplicationCard from '@/components/dashboard/ApplicationCard'
import DashboardPostComposer from '@/components/dashboard/DashboardPostComposer'
import JobCard from '@/components/dashboard/JobCard'
import OperatorCard from '@/components/dashboard/OperatorCard'
import PostCard from '@/components/dashboard/PostCard'
import SpaceCard from '@/components/dashboard/SpaceCard'
import { applications } from '@/lib/applications'
import { jobs } from '@/lib/jobs'
import { topOperators } from '@/lib/operators'
import { posts } from '@/lib/posts'
import { referral } from '@/lib/referrals'
import { spaces } from '@/lib/spaces'
import { currentUser } from '@/lib/user'

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
  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">
          Hi, {currentUser.name}!
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-ink-10 rounded-full px-4 py-2 text-sm text-ink">
            <Zap size={14} strokeWidth={1.5} className="text-blue" />
            <span className="font-mono font-bold text-xs">CCREDITS</span>
            <span className="font-display font-black text-[18px] leading-none">{currentUser.credits}</span>
          </div>
          <Link href="/talent/dashboard/referrals" className="font-text text-sm font-semibold px-4 py-2 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]">
            Refer &amp; earn
          </Link>
        </div>
      </div>

      <section className="bg-ink rounded-xl p-6 mb-8 dark-inv-section relative overflow-hidden">
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
        <p className="font-mono text-xs text-paper/50 uppercase tracking-eyebrow mb-4">Welcome to Comcorpe</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {homeActions.map(({ icon: Icon, title, cta, href }) => (
            <div key={title} className="bg-paper/[0.08] rounded-lg p-4 flex flex-col gap-3 border border-paper/[0.12] hover:bg-paper/[0.14] transition-colors">
              <Icon size={20} strokeWidth={1.5} className="text-blue" />
              <p className="font-display font-black text-[15px] leading-tight text-paper">{title}</p>
              <Link href={href} className="font-text text-xs font-semibold px-3 py-1.5 bg-paper/[0.12] text-paper rounded-full hover:bg-blue transition-colors duration-[120ms] w-fit">
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Your newest matches</h2>
              <Link href="/talent/dashboard/jobs" className="font-text text-xs text-blue hover:underline flex items-center gap-1">
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
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">I&apos;ve submitted to</h2>
              <Link href="/talent/dashboard/work" className="font-text text-xs text-blue hover:underline flex items-center gap-1">
                View all applications <ChevronRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Spaces you might like</h2>
            </div>
            <div className="flex flex-col gap-3">
              {spaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-4">Get inspired by top operators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topOperators.map((operator) => (
                <OperatorCard key={operator.id} operator={operator} />
              ))}
            </div>
          </section>

          <section className="border border-ink-10 rounded-xl p-6 bg-ink-10/40">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div>
                <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-1">Refer Clients &amp; Talent</h2>
                <p className="font-text text-sm text-ink-60 max-w-[36ch]">
                  Share your link and earn {referral.clientShare} of client billings for every client hired, and {referral.talentShare} of talent earnings for every job landed.
                </p>
                <div className="mt-4 flex flex-col xs:flex-row items-start xs:items-center gap-2">
                  <div className="w-full xs:flex-1 px-3 py-2 bg-paper border border-ink-10 rounded-lg font-mono text-xs text-ink-60 truncate">
                    {referral.link}
                  </div>
                  <button className="w-full xs:w-auto font-text text-xs font-semibold px-3 py-2 bg-ink text-paper rounded-lg hover:bg-blue transition-colors duration-[120ms]">
                    Copy
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {referral.channels.map((channel) => (
                    <button key={channel} className="font-mono text-[10px] uppercase tracking-eyebrow px-3 py-1.5 border border-ink-20 rounded-full text-ink-60 hover:border-ink hover:text-ink transition-colors">
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
              <Gift size={28} strokeWidth={1.2} className="text-blue shrink-0 mt-1" />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Growth community</h2>
            <Link href="/talent/dashboard/community" className="font-text text-xs text-blue hover:underline">View all posts</Link>
          </div>

          <DashboardPostComposer />

          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <button className="font-text text-sm text-ink-60 hover:text-ink transition-colors flex items-center gap-2 justify-center py-3 border border-ink-10 rounded-xl hover:border-ink-20">
            <RotateCcw size={13} /> Load more posts
          </button>
        </div>
      </div>
    </div>
  )
}
