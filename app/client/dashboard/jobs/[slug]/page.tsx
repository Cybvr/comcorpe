import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Briefcase, Clock, MapPin } from 'lucide-react'
import { pods } from '@/lib/pods'
import { getTalentProfile } from '@/lib/talent'
import { jobs, getJobBySlug } from '@/lib/jobs'

const statusStyles = {
  active: 'bg-green-50 text-green-700 border-green-100',
  completed: 'bg-blue-50 text-blue-700 border-blue-100',
  paused: 'bg-orange-50 text-orange-700 border-orange-100',
  cancelled: 'bg-ink-10 text-ink-40 border-ink-10',
}

export function generateStaticParams() {
  return jobs.map((job) => ({
    slug: job.slug,
  }))
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const job = getJobBySlug(slug)

  if (!job) {
    notFound()
  }

  const primaryPods = pods.slice(0, 2)

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1040px] mx-auto">
      <Link href="/client/dashboard/jobs" className="font-text text-sm text-ink-60 hover:text-blue transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to briefs
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-blue">{job.type}</span>
            <span className="w-1 h-1 bg-ink-20 rounded-full" />
            <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 rounded-sm border ${statusStyles[job.status as keyof typeof statusStyles]}`}>
              {job.status}
            </span>
          </div>
          <h1 className="font-display font-black text-[36px] tracking-[-0.03em] text-ink leading-tight">{job.title}</h1>
          <div className="flex items-center gap-4 mt-3 font-text text-sm text-ink-60">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} strokeWidth={1.5} className="text-ink-40" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} strokeWidth={1.5} className="text-ink-40" />
              Started {job.posted}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-paper border border-ink-10 rounded-full font-text text-sm font-semibold hover:border-ink-20 transition-colors">
            Edit brief
          </button>
          <button className="px-5 py-2.5 bg-ink text-paper rounded-full font-text text-sm font-semibold hover:bg-blue transition-colors duration-[120ms]">
            Manage project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-10">
          <section className="bg-paper border border-ink-10 rounded-2xl p-8">
            <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-ink mb-6">Brief summary</h2>
            <p className="font-text text-[16px] leading-relaxed text-ink-60 mb-8 max-w-[65ch]">
              This project focuses on the strategic rollout of regulated financial services. The objective is to design a scalable go-to-market engine that balances regulatory compliance with rapid customer acquisition and trust-building in emerging markets.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Core outcomes</h3>
                <ul className="space-y-2">
                  {['Regulatory approval roadmap', 'Channel partner architecture', 'Customer trust strategy'].map((item) => (
                    <li key={item} className="flex items-center gap-2 font-text text-sm text-ink-60">
                      <div className="w-1.5 h-1.5 bg-blue rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Key constraints</h3>
                <ul className="space-y-2">
                  {['12-week initial sprint', 'Lagos/Accra priority', 'Compliance-first approach'].map((item) => (
                    <li key={item} className="flex items-center gap-2 font-text text-sm text-ink-60">
                      <div className="w-1.5 h-1.5 bg-ink-10 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-6">Recommended pods</h2>
            <div className="space-y-4">
              {primaryPods.map((pod) => {
                const lead = getTalentProfile(pod.leadId)
                return (
                  <Link key={pod.id} href={`/client/dashboard/search/${pod.slug}`} className="p-6 bg-paper border border-ink-10 rounded-2xl flex items-center gap-4 hover:border-ink-20 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-ink flex items-center justify-center font-display font-black text-[13px] text-paper shrink-0 border border-ink-10 overflow-hidden relative">
                      {lead.image ? (
                        <Image src={lead.image} alt={lead.name} fill className="object-cover" />
                      ) : (
                        lead.initials
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-[18px] text-ink group-hover:text-blue transition-colors leading-tight">{pod.name}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="font-text text-sm text-ink-60">{pod.focus}</span>
                        <span className="w-1 h-1 bg-ink-10 rounded-full" />
                        <span className="font-text text-sm text-blue font-semibold">{pod.fitScore}% Match</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="p-6 bg-ink text-paper rounded-2xl">
            <h3 className="font-display font-black text-[18px] mb-4">Brief context</h3>
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Budget guidance</p>
                <p className="font-display font-black text-lg">$15k - $25k / mo</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Timeline</p>
                <p className="font-display font-black text-lg">Q3 - Q4 2024</p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-ink-10 rounded-2xl">
            <h3 className="font-display font-black text-[16px] text-ink mb-4">Assigned account lead</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue flex items-center justify-center font-display font-black text-[11px] text-paper">
                JP
              </div>
              <div>
                <p className="font-text text-sm font-bold text-ink leading-tight">Jide Pinheiro</p>
                <p className="font-text text-[11px] text-ink-40">Strategic Director</p>
              </div>
            </div>
            <button className="w-full mt-6 py-2.5 border border-ink-10 rounded-lg font-text text-xs font-semibold hover:bg-ink-5 transition-colors">
              Message lead
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
