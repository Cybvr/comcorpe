import { Globe, Target, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Space, SpaceIcon } from '@/lib/spaces'

const icons: Record<SpaceIcon, LucideIcon> = {
  globe: Globe,
  zap: Zap,
  target: Target,
}

export default function SpaceCard({ space }: { space: Space }) {
  const Icon = icons[space.icon]

  return (
    <article className="border border-ink-10 rounded-xl p-4 flex items-start gap-4 bg-paper hover:border-ink-20 hover:shadow-sm transition-all duration-150">
      <div className="w-10 h-10 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center text-blue shrink-0">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-black text-[15px] tracking-[-0.01em] text-ink leading-tight">{space.name}</div>
        <div className="font-text text-xs text-ink-60 mt-0.5 line-clamp-2">{space.desc}</div>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-mono text-[10px] text-ink-40 uppercase tracking-eyebrow">{space.members} members</span>
          <span className="w-1 h-1 rounded-full bg-ink-20" />
          <span className="font-mono text-[10px] text-ink-40">{space.posts}</span>
        </div>
      </div>
      <button className="font-text text-xs font-semibold px-3 py-1.5 border border-ink-20 rounded-full text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-[120ms] shrink-0">
        Join
      </button>
    </article>
  )
}
