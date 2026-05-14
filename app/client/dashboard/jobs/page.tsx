import Link from 'next/link'
import { ArrowUpRight, Briefcase, Clock, MapPin, Plus } from 'lucide-react'
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
    <div className="px-8 py-8 max-w-[1240px] mx-auto">
      {/* Search & Actions Bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h1 className="font-display font-black text-[24px] tracking-[-0.02em] text-ink">Briefs</h1>
          <span className="px-2 py-0.5 rounded-full bg-ink-5 text-ink-40 font-mono text-[10px] uppercase tracking-wider">
            {jobs.filter(b => b.client === currentUser.company).length} total
          </span>
        </div>
        <Link 
          href="/client/dashboard/jobs/new"
          className="font-text text-sm font-semibold px-5 py-2.5 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms] flex items-center gap-2"
        >
          <Plus size={16} /> New brief
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.filter(b => b.client === currentUser.company).map((brief) => (
          <Link
            key={brief.id}
            href={`/client/dashboard/jobs/${brief.slug}`}
            className="border border-ink-10 rounded-2xl p-6 bg-paper hover:border-ink-20 hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ink-5 border border-ink-10 flex items-center justify-center text-ink-20 group-hover:text-blue transition-colors shrink-0">
                <Briefcase size={20} strokeWidth={1.5} />
              </div>
              <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[brief.status as keyof typeof statusStyles]}`}>
                {brief.status}
              </span>
            </div>
            
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-blue/60 mb-2">{brief.client}</p>
              <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors leading-tight">
                {brief.title}
              </h2>
              <p className="font-text text-[15px] leading-relaxed text-ink-60 mt-4 line-clamp-3">{brief.summary}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-6 mb-8">
              {brief.tags.map((tag) => (
                <span key={tag} className="font-mono text-[9px] uppercase tracking-eyebrow text-ink-40 px-2 py-0.5 border border-ink-5 rounded-sm bg-ink-5/30">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-5 border-t border-ink-5">
              <div className="grid grid-cols-2 gap-4 text-[11px] text-ink-40 mb-4">
                <span className="flex items-center gap-2"><Clock size={12} strokeWidth={1.5} /> {brief.time}</span>
                <span className="flex items-center gap-2"><MapPin size={12} strokeWidth={1.5} /> {brief.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-text text-[10px] text-ink-20 uppercase tracking-widest">{brief.updatedAt}</span>
                <ArrowUpRight size={16} className="text-ink-20 group-hover:text-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
