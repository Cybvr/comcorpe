import Link from 'next/link'
import { Clock, MapPin } from 'lucide-react'
import ClientAvatar from '@/components/dashboard/ClientAvatar'
import type { Job, JobType } from '@/lib/jobs'
import type { User } from '@/lib/user'

const badgeColour: Record<JobType, string> = {
  RETAINED: 'bg-primary/10 text-primary border-primary/20',
  PROJECT: 'bg-accent/10 text-accent border-accent/20',
  EQUITY: 'bg-green-600/10 text-green-700 border-green-600/20',
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <ClientAvatar client={client} sizeClass="w-8 h-8" iconSize={14} roundedClass="rounded-lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 border rounded-sm ${badgeColour[job.type]}`}>
                {job.type}
              </span>
            </div>
            <div className="font-display font-black text-[15px] tracking-[-0.01em] text-foreground group-hover:text-primary transition-colors leading-tight">
              {client.name}
            </div>
            <div className="font-text text-xs text-muted-foreground mt-0.5 truncate">{job.title}</div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="font-display font-black text-[14px] tracking-[-0.02em] text-foreground">{job.rate}</div>
          <div className="flex items-center gap-1 text-muted-foreground/70 text-[10px] mt-1 justify-end">
            <MapPin size={9} /> {job.location}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground/70 text-[10px] mt-0.5 justify-end">
            <Clock size={9} /> {job.time}
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex gap-1.5 flex-wrap">
        {job.tags.map((tag) => (
          <span key={tag} className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground px-1.5 py-0.5 border border-border rounded-sm">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
