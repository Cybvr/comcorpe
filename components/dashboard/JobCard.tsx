import Link from 'next/link'
import { Clock, MapPin } from 'lucide-react'
import ClientAvatar from '@/components/dashboard/ClientAvatar'
import type { Job, JobStatus } from '@/lib/jobs'
import type { User } from '@/lib/user'

const stageBadgeColour: Record<JobStatus, string> = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-primary/10 text-primary border-primary/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-border text-muted-foreground border-input',
  Completed: 'bg-border text-muted-foreground border-input',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
}

export default function JobCard({
  job,
  baseHref = '/talent/dashboard/jobs',
  client,
}: {
  job: Job
  baseHref?: string
  client: User
}) {
  return (
    <Link href={`${baseHref}/${job.slug}`} className="block border border-border rounded-xl p-3.5 hover:border-input hover:shadow-sm transition-all duration-150 bg-background group cursor-pointer">
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <ClientAvatar client={client} sizeClass="w-8 h-8" iconSize={14} roundedClass="rounded-lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 border rounded-sm text-muted-foreground border-border bg-muted/30">
                {client.name}
              </span>
            </div>
            <div className="font-display font-black text-[15px] tracking-[-0.01em] text-foreground group-hover:text-primary transition-colors leading-tight">
              {job.title}
            </div>
          </div>
        </div>
        <span className={`shrink-0 font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 border rounded-sm ${stageBadgeColour[job.status]}`}>
          {job.status}
        </span>
      </div>

      <div className="mt-2.5 flex gap-1.5 flex-wrap">
        <span className="font-mono text-[9px] uppercase tracking-eyebrow text-foreground px-1.5 py-0.5 border border-border rounded-sm bg-muted/20">
          {job.rate}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground px-1.5 py-0.5 border border-border rounded-sm">
          <MapPin size={9} className="shrink-0" />
          <span>{job.location}</span>
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground px-1.5 py-0.5 border border-border rounded-sm">
          <Clock size={9} className="shrink-0" />
          <span>{job.time}</span>
        </span>
        {job.tags.map((tag) => (
          <span key={tag} className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground px-1.5 py-0.5 border border-border rounded-sm">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
