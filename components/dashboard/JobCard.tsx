import Link from 'next/link'
import { Clock, MapPin } from 'lucide-react'
import type { Job, JobType } from '@/lib/jobs'

const badgeColour: Record<JobType, string> = {
  RETAINED: 'bg-blue/10 text-blue border-blue/20',
  PROJECT: 'bg-violet/10 text-violet border-violet/20',
  EQUITY: 'bg-green-600/10 text-green-700 border-green-600/20',
}

export default function JobCard({
  job,
  baseHref = '/talent/dashboard/jobs',
}: {
  job: Job
  baseHref?: string
}) {
  return (
    <Link href={`${baseHref}/${job.slug}`} className="block border border-ink-10 rounded-xl p-5 hover:border-ink-20 hover:shadow-sm transition-all duration-150 bg-paper group cursor-pointer">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-ink-10 border border-ink-10 flex items-center justify-center font-display font-black text-[13px] text-ink shrink-0">
            {job.client[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${badgeColour[job.type]}`}>
                {job.type}
              </span>
            </div>
            <div className="font-display font-black text-[17px] tracking-[-0.01em] text-ink group-hover:text-blue transition-colors leading-tight">
              {job.client}
            </div>
            <div className="font-text text-sm text-ink-60 mt-0.5 truncate">{job.role}</div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="font-display font-black text-[16px] tracking-[-0.02em] text-ink">{job.rate}</div>
          <div className="flex items-center gap-1 text-ink-40 text-xs mt-1 justify-end">
            <MapPin size={10} /> {job.location}
          </div>
          <div className="flex items-center gap-1 text-ink-40 text-xs mt-0.5 justify-end">
            <Clock size={10} /> {job.time}
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5 flex-wrap">
        {job.tags.map((tag) => (
          <span key={tag} className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-60 px-2 py-0.5 border border-ink-10 rounded-sm">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
