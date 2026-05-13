import Link from 'next/link'
import { ArrowUpRight, Briefcase, Clock, MapPin } from 'lucide-react'
import { jobs } from '@/lib/jobs'
import { currentUser } from '@/lib/user'

const statusStyles = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-blue/10 text-blue border-blue/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-ink-10 text-ink-60 border-ink-20',
}

export default function BriefsPage() {
  return (
    <div className="px-8 py-8 max-w-[1120px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Briefs</p>
          <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Active client briefs</h1>
          <p className="font-text text-sm text-ink-60 mt-3 max-w-[62ch]">
            Track every live or developing brief, what outcome it is meant to unlock, and what the Comcorpe pod needs next.
          </p>
        </div>
        <button className="font-text text-sm font-semibold px-4 py-2 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms] shrink-0">
          New brief
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {jobs.filter(b => b.client === currentUser.company).map((brief) => (
          <Link
            key={brief.id}
            href={`/client/dashboard/jobs/${brief.slug}`}
            className="border border-ink-10 rounded-xl p-5 bg-paper hover:border-ink-20 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center text-blue shrink-0">
                <Briefcase size={18} strokeWidth={1.5} />
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[brief.status]}`}>
                {brief.status}
              </span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-2">{brief.client}</p>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors leading-tight">
              {brief.title}
            </h2>
            <p className="font-text text-sm leading-relaxed text-ink-60 mt-3 line-clamp-4">{brief.summary}</p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {brief.tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-60 px-2 py-0.5 border border-ink-10 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-ink-10 grid grid-cols-2 gap-3 text-xs text-ink-40">
              <span className="flex items-center gap-1.5"><Clock size={11} /> {brief.timeline}</span>
              <span className="flex items-center gap-1.5"><MapPin size={11} /> {brief.location}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="font-text text-xs text-ink-40">{brief.updatedAt}</span>
              <ArrowUpRight size={14} className="text-ink-40 group-hover:text-blue transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
