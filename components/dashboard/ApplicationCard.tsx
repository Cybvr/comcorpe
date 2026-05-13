import { ChevronRight } from 'lucide-react'
import type { Application } from '@/lib/applications'

export default function ApplicationCard({ application }: { application: Application }) {
  return (
    <article className="border border-ink-10 rounded-xl p-4 flex items-center gap-4 bg-paper hover:border-ink-20 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center font-display font-black text-[12px] text-paper shrink-0">
        {application.client[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-text text-xs text-ink-40">{application.date}</span>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-sm">
            {application.status}
          </span>
        </div>
        <div className="font-display font-black text-[15px] tracking-[-0.01em] text-ink leading-tight mt-0.5">
          {application.client}
        </div>
        <div className="font-text text-xs text-ink-60">{application.role}</div>
      </div>
      <ChevronRight size={16} className="text-ink-40 shrink-0" />
    </article>
  )
}
