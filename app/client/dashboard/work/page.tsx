import Link from 'next/link'
import { ArrowUpRight, CalendarDays, CheckCircle2 } from 'lucide-react'
import { jobs } from '@/lib/jobs'
import { currentUser } from '@/lib/user'

const statusStyles = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-blue/10 text-blue border-blue/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-ink-10 text-ink-60 border-ink-20',
  Completed: 'bg-ink-10 text-ink-60 border-ink-20',
}

export default function ProjectsPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1040px] mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Active work</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Live engagements</h1>
        <p className="font-text text-sm text-ink-60 mt-3 max-w-[62ch]">
          Follow current phases, progress, review dates, and the exact inputs needed to keep live work moving.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {jobs.filter(j => j.client === currentUser.company && j.status === 'Active').map((project) => (
          <article key={project.id} className="border border-ink-10 rounded-xl p-6 bg-paper">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[project.status]}`}>
                    {project.status}
                  </span>
                  <span className="font-text text-xs text-ink-40">{project.phase}</span>
                </div>
                <h2 className="font-display font-black text-[24px] tracking-[-0.02em] text-ink leading-tight">{project.title}</h2>
                <p className="font-text text-sm leading-relaxed text-ink-60 mt-3 max-w-[68ch]">{project.summary}</p>
              </div>
              <Link
                href={`/client/dashboard/jobs/${project.slug}`}
                className="font-text text-xs font-semibold px-4 py-2 border border-ink-20 rounded-full text-ink hover:bg-ink hover:text-paper transition-colors duration-[120ms] shrink-0 inline-flex items-center gap-1.5"
              >
                Open brief <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Progress</span>
                <span className="font-display font-black text-[16px] tracking-[-0.02em] text-ink">{project.progress}%</span>
              </div>
              <div className="h-2 bg-ink-10 rounded-full overflow-hidden">
                <div className="h-full bg-blue rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
              <div className="border border-ink-10 rounded-lg p-4">
                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-2">Pod lead</p>
                <div className="font-display font-black text-[16px] tracking-[-0.01em] text-ink">{project.lead}</div>
              </div>
              <div className="border border-ink-10 rounded-lg p-4">
                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-2">Next milestone</p>
                <div className="font-display font-black text-[16px] tracking-[-0.01em] text-ink leading-tight">{project.nextMilestone}</div>
              </div>
              <div className="border border-ink-10 rounded-lg p-4">
                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-2">Review</p>
                <div className="flex items-center gap-2 font-display font-black text-[16px] tracking-[-0.01em] text-ink">
                  <CalendarDays size={14} /> {project.nextReview}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-ink-10">
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-blue mb-3">Latest updates</p>
              <div className="flex flex-col gap-2">
                {(project.updates || []).map((update) => (
                  <div key={update} className="flex items-center gap-2 font-text text-sm text-ink-60">
                    <CheckCircle2 size={13} className="text-blue shrink-0" /> {update}
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
