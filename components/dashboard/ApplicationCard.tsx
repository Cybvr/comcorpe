import { ChevronRight } from 'lucide-react'
import type { Application } from '@/lib/applications'

export default function ApplicationCard({ application }: { application: Application }) {
  return (
    <article className="border border-border rounded-xl p-4 flex items-center gap-4 bg-background hover:border-input transition-colors">
      <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center font-display font-black text-[12px] text-background shrink-0">
        {application.client[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-text text-xs text-muted-foreground/70">{application.date}</span>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-sm">
            {application.status}
          </span>
        </div>
        <div className="font-display font-black text-[15px] tracking-[-0.01em] text-foreground leading-tight mt-0.5">
          {application.client}
        </div>
        <div className="font-text text-xs text-muted-foreground">{application.role}</div>
      </div>
      <ChevronRight size={16} className="text-muted-foreground/70 shrink-0" />
    </article>
  )
}
