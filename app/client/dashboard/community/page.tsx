import Link from 'next/link'
import { ArrowUpRight, Layers3, Users } from 'lucide-react'
import { clientPodRecommendations } from '@/lib/client-dashboard'

export default function TalentPodsPage() {
  return (
    <div className="px-8 py-8 max-w-[1120px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Talent pods</p>
          <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Recommended specialist pods</h1>
          <p className="font-text text-sm text-ink-60 mt-3 max-w-[62ch]">
            Compare configured teams by fit, lead operator, market coverage, availability, and evidence before approving introductions.
          </p>
        </div>
        <Link
          href="/talent"
          className="font-text text-sm font-semibold px-4 py-2 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms] shrink-0"
        >
          Browse talent
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {clientPodRecommendations.map((pod) => (
          <Link
            key={pod.id}
            href={`/client/dashboard/community/${pod.slug}`}
            className="border border-ink-10 rounded-xl p-5 bg-paper hover:border-ink-20 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center font-display font-black text-[13px] text-paper shrink-0">
                {pod.leadInitials}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border border-blue/20 bg-blue/10 text-blue rounded-sm">
                {pod.fit}
              </span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-2">{pod.focus}</p>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors leading-tight">
              {pod.name}
            </h2>
            <p className="font-text text-sm leading-relaxed text-ink-60 mt-3 line-clamp-4">{pod.summary}</p>

            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-text text-xs text-ink-60">
                <Users size={12} /> Lead: {pod.lead}
              </div>
              <div className="flex items-center gap-2 font-text text-xs text-ink-60">
                <Layers3 size={12} /> {pod.availability}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-ink-10 flex items-center justify-between gap-3">
              <span className="font-text text-xs text-ink-40">{pod.members.length} specialists</span>
              <ArrowUpRight size={14} className="text-ink-40 group-hover:text-blue transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
