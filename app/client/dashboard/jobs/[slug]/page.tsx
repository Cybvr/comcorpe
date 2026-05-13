import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Briefcase, Clock, MapPin, UserRound } from 'lucide-react'
import {
  clientBriefs,
  clientPodRecommendations,
  getClientBriefBySlug,
} from '@/lib/client-dashboard'

const statusStyles = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-blue/10 text-blue border-blue/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-ink-10 text-ink-60 border-ink-20',
}

const podByBrief = {
  'volta-pay-nigeria-entry': 'fintech-market-entry-pod',
  'eazebank-growth-reset': 'consumer-trust-pod',
  'gridwell-sme-clusters': 'sme-infrastructure-pod',
}

export function generateStaticParams() {
  return clientBriefs.map((brief) => ({
    slug: brief.slug,
  }))
}

export default async function BriefDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const brief = getClientBriefBySlug(slug)

  if (!brief) {
    notFound()
  }

  const podSlug = podByBrief[brief.slug as keyof typeof podByBrief]
  const pod = clientPodRecommendations.find((recommendation) => recommendation.slug === podSlug)

  return (
    <div className="px-8 py-8 max-w-[1040px] mx-auto">
      <Link href="/client/dashboard/jobs" className="font-text text-sm text-ink-60 hover:text-blue transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to briefs
      </Link>

      <div className="border border-ink-10 rounded-xl p-8 bg-paper">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-3">{brief.arena}</p>
            <h1 className="font-display font-black text-[40px] tracking-[-0.03em] text-ink leading-none">{brief.company}</h1>
            <p className="font-display font-black text-[24px] tracking-[-0.02em] text-ink mt-3">{brief.title}</p>
            <p className="font-text text-[16px] leading-relaxed text-ink-60 mt-5 max-w-[62ch]">{brief.summary}</p>
          </div>

          <aside className="shrink-0 min-w-[240px] border border-ink-10 rounded-xl p-5">
            <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-1 border rounded-sm ${statusStyles[brief.status]}`}>
              {brief.status}
            </span>
            <div className="font-display font-black text-[24px] tracking-[-0.02em] text-ink mt-5">{brief.budget}</div>
            <div className="flex items-center gap-2 text-ink-60 text-sm mt-4">
              <Clock size={14} /> {brief.timeline}
            </div>
            <div className="flex items-center gap-2 text-ink-60 text-sm mt-2">
              <MapPin size={14} /> {brief.location}
            </div>
            <div className="flex items-center gap-2 text-ink-60 text-sm mt-2">
              <UserRound size={14} /> {brief.owner}
            </div>
          </aside>
        </div>

        <div className="flex gap-2 flex-wrap mt-6">
          {brief.tags.map((tag) => (
            <span key={tag} className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-60 px-2 py-1 border border-ink-10 rounded-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <section>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-4">Target outcomes</h2>
            <div className="flex flex-col gap-3">
              {brief.outcomes.map((item) => (
                <div key={item} className="border border-ink-10 rounded-lg p-4 font-text text-sm text-ink-60">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-4">Client next steps</h2>
            <div className="flex flex-col gap-3">
              {brief.nextSteps.map((item) => (
                <div key={item} className="border border-ink-10 rounded-lg p-4 font-text text-sm text-ink-60">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        {pod && (
          <section className="mt-10 border border-ink-10 rounded-xl p-5 bg-ink-10/40">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center font-display font-black text-[12px] text-paper shrink-0">
                  {pod.leadInitials}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-eyebrow text-blue mb-1">Recommended pod</p>
                  <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink leading-tight">{pod.name}</h2>
                  <p className="font-text text-sm text-ink-60 mt-2 max-w-[62ch]">{pod.summary}</p>
                </div>
              </div>
              <Link
                href={`/client/dashboard/community/${pod.slug}`}
                className="font-text text-xs font-semibold px-4 py-2 bg-ink text-paper rounded-full hover:bg-blue transition-colors duration-[120ms] shrink-0 inline-flex items-center gap-1.5"
              >
                Review pod <ArrowUpRight size={12} />
              </Link>
            </div>
          </section>
        )}

        <div className="mt-10 pt-6 border-t border-ink-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-ink-60">
            <Briefcase size={14} /> {brief.updatedAt}
          </div>
          <button className="font-text text-sm font-semibold px-5 py-3 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]">
            Approve next step
          </button>
        </div>
      </div>
    </div>
  )
}
