import Link from 'next/link'
import { Clock, MapPin } from 'lucide-react'
import type { Job, JobType } from '@/lib/jobs'
import { getClientUser } from '@/lib/user'

const badgeColour: Record<JobType, string> = {
  RETAINED: 'bg-primary/10 text-primary border-primary/20',
  PROJECT: 'bg-accent/10 text-accent border-accent/20',
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
    <Link href={`${baseHref}/${job.slug}`} className="block border border-border rounded-xl p-5 hover:border-input hover:shadow-sm transition-all duration-150 bg-background group cursor-pointer">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-border border border-border flex items-center justify-center font-display font-black text-[13px] text-foreground shrink-0">
            {getClientUser(job.clientId).name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${badgeColour[job.type]}`}>
                {job.type}
              </span>
            </div>
            <div className="font-display font-black text-[17px] tracking-[-0.01em] text-foreground group-hover:text-primary transition-colors leading-tight">
              {getClientUser(job.clientId).name}
            </div>
            <div className="font-text text-sm text-muted-foreground mt-0.5 truncate">{job.title}</div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="font-display font-black text-[16px] tracking-[-0.02em] text-foreground">{job.rate}</div>
          <div className="flex items-center gap-1 text-muted-foreground/70 text-xs mt-1 justify-end">
            <MapPin size={10} /> {job.location}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground/70 text-xs mt-0.5 justify-end">
            <Clock size={10} /> {job.time}
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5 flex-wrap">
        {job.tags.map((tag) => (
          <span key={tag} className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground px-2 py-0.5 border border-border rounded-sm">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
