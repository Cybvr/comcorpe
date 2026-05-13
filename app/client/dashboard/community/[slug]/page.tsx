import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Globe2, Layers3, Users } from 'lucide-react'
import {
  clientPodRecommendations,
  getClientPodBySlug,
} from '@/lib/client-dashboard'

export function generateStaticParams() {
  return clientPodRecommendations.map((pod) => ({
    slug: pod.slug,
  }))
}

export default async function TalentPodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pod = getClientPodBySlug(slug)

  if (!pod) {
    notFound()
  }

  return (
    <div className="px-8 py-8 max-w-[1040px] mx-auto">
      <Link href="/client/dashboard/community" className="font-text text-sm text-ink-60 hover:text-blue transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to talent pods
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">
        <article className="border border-ink-10 rounded-xl p-8 bg-paper">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center font-display font-black text-[15px] text-paper shrink-0">
                {pod.leadInitials}
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-3">{pod.focus}</p>
                <h1 className="font-display font-black text-[40px] tracking-[-0.03em] text-ink leading-none">{pod.name}</h1>
                <p className="font-text text-[16px] leading-relaxed text-ink-60 mt-5 max-w-[62ch]">{pod.summary}</p>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-eyebrow px-2 py-1 border border-blue/20 bg-blue/10 text-blue rounded-sm shrink-0">
              {pod.fit}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
            <div className="border border-ink-10 rounded-xl p-4">
              <Users size={16} strokeWidth={1.5} className="text-blue mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-1">Lead</p>
              <div className="font-display font-black text-[17px] tracking-[-0.01em] text-ink leading-tight">{pod.lead}</div>
            </div>
            <div className="border border-ink-10 rounded-xl p-4">
              <Layers3 size={16} strokeWidth={1.5} className="text-blue mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-1">Availability</p>
              <div className="font-display font-black text-[17px] tracking-[-0.01em] text-ink leading-tight">{pod.availability}</div>
            </div>
            <div className="border border-ink-10 rounded-xl p-4">
              <Globe2 size={16} strokeWidth={1.5} className="text-blue mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-1">Markets</p>
              <div className="font-display font-black text-[17px] tracking-[-0.01em] text-ink leading-tight">{pod.markets.length} covered</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <section>
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-4">Pod composition</h2>
              <div className="flex flex-col gap-3">
                {pod.members.map((member) => (
                  <div key={member} className="border border-ink-10 rounded-lg p-4 font-text text-sm text-ink-60">
                    {member}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-4">Why this pod fits</h2>
              <div className="flex flex-col gap-3">
                {pod.evidence.map((item) => (
                  <div key={item} className="border border-ink-10 rounded-lg p-4 font-text text-sm text-ink-60">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-ink-10 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-blue mb-1">Recommended next step</p>
              <p className="font-text text-sm text-ink-60">{pod.nextStep}</p>
            </div>
            <button className="font-text text-sm font-semibold px-5 py-3 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms] shrink-0">
              Approve intros
            </button>
          </div>
        </article>

        <aside className="border border-ink-10 rounded-xl p-5 bg-paper">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-blue mb-4">Market coverage</p>
          <div className="flex flex-col gap-2">
            {pod.markets.map((market) => (
              <div key={market} className="flex items-center gap-2 font-text text-sm text-ink-60">
                <CheckCircle2 size={13} className="text-blue" /> {market}
              </div>
            ))}
          </div>
          <Link
            href="/client/dashboard/jobs"
            className="mt-6 inline-flex items-center gap-1.5 font-text text-xs font-semibold px-4 py-2 bg-ink text-paper hover:bg-blue transition-colors duration-[120ms] rounded-full"
          >
            Match to a brief <ArrowUpRight size={12} />
          </Link>
        </aside>
      </div>
    </div>
  )
}
