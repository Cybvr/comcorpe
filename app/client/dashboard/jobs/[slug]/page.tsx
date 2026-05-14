import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Briefcase, Clock, MapPin } from 'lucide-react'
import { pods, getPodBySlug, getPodMembers } from '@/lib/pods'
import { getTalentProfile } from '@/lib/talent'
import { jobs, getJobBySlug } from '@/lib/jobs'

const statusStyles: Record<string, string> = {
  'Active': 'bg-green-50 text-green-700 border-green-100',
  'Completed': 'bg-blue-50 text-blue-700 border-blue-100',
  'Paused': 'bg-orange-50 text-orange-700 border-orange-100',
  'Scoping': 'bg-ink-10 text-ink-60 border-ink-10',
  'Pod review': 'bg-violet/10 text-violet border-violet/20',
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

  const assignedPod = job.podSlug ? getPodBySlug(job.podSlug) : null
  const assignedPodMembers = assignedPod ? getPodMembers(assignedPod) : []
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
          <h1 className="font-display font-black text-[22px] tracking-[-0.02em] text-ink leading-tight">{job.title}</h1>
          <div className="flex items-center gap-4 mt-3 font-text text-sm text-ink-60">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} strokeWidth={1.5} className="text-ink-40" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} strokeWidth={1.5} className="text-ink-40" />
              {job.updatedAt}
            </div>
          </div>
        </div>
        {job.status !== 'Completed' && (
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-paper border border-ink-10 rounded-full font-text text-sm font-semibold hover:border-ink-20 transition-colors">
              Edit brief
            </button>
            {job.status === 'Active' && (
              <button className="px-5 py-2.5 bg-ink text-paper rounded-full font-text text-sm font-semibold hover:bg-blue transition-colors duration-[120ms]">
                Pause engagement
              </button>
            )}
            {job.status === 'Paused' && (
              <button className="px-5 py-2.5 bg-ink text-paper rounded-full font-text text-sm font-semibold hover:bg-blue transition-colors duration-[120ms]">
                Resume
              </button>
            )}
          </div>
        )}
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

          {job.status === 'Active' || job.status === 'Completed' || job.status === 'Paused' ? (
            <section className="space-y-4">
              {job.status === 'Active' && (
                <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Project tracking</h2>
              )}

              {/* Progress bar — Active only */}
              {job.status === 'Active' && (
                <div className="bg-paper border border-ink-10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Overall progress</span>
                    <span className="font-display font-black text-[20px] text-ink">{job.progress ?? 0}%</span>
                  </div>
                  <div className="h-2 bg-ink-10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue rounded-full transition-all duration-500" style={{ width: `${job.progress ?? 0}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-eyebrow text-ink-40 mb-0.5">Current phase</p>
                      <p className="font-text text-sm font-semibold text-ink">{job.phase ?? '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[9px] uppercase tracking-eyebrow text-ink-40 mb-0.5">Next review</p>
                      <p className="font-text text-sm font-semibold text-ink">{job.nextReview ?? '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Next milestone */}
              {job.nextMilestone && (
                <div className="bg-blue/5 border border-blue/15 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue/10 rounded-full flex items-center justify-center shrink-0">
                    <Briefcase size={14} className="text-blue" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow text-blue/60 mb-0.5">Next milestone</p>
                    <p className="font-text text-sm font-semibold text-ink">{job.nextMilestone}</p>
                  </div>
                </div>
              )}

              {/* Recent updates */}
              {job.updates && job.updates.length > 0 && (
                <div className="bg-paper border border-ink-10 rounded-2xl p-6">
                  <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-4">Recent updates</h3>
                  <ul className="space-y-3">
                    {job.updates.map((update, i) => (
                      <li key={i} className="flex items-start gap-3 font-text text-sm text-ink-60">
                        <div className="w-1.5 h-1.5 bg-blue rounded-full mt-1.5 shrink-0" />
                        {update}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next steps */}
              {job.nextSteps && job.nextSteps.length > 0 && (
                <div className="bg-paper border border-ink-10 rounded-2xl p-6">
                  <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-4">Actions needed</h3>
                  <ul className="space-y-3">
                    {job.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-4 h-4 border border-ink-20 rounded-sm mt-0.5 shrink-0" />
                        <span className="font-text text-sm text-ink">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Assigned pod */}
              {assignedPod && (
                <div className="bg-paper border border-ink-10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Assigned pod</h3>
                    <Link href={`/client/dashboard/search/${assignedPod.slug}`} className="font-text text-xs text-blue hover:underline">
                      View pod →
                    </Link>
                  </div>
                  <p className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-1">{assignedPod.name}</p>
                  <p className="font-text text-sm text-ink-60 mb-5">{assignedPod.focus}</p>
                  <div className="flex flex-wrap gap-3">
                    {assignedPodMembers.map(member => (
                      <Link key={member.id} href={`/client/dashboard/search/talent/${member.id}`} className="flex items-center gap-2.5 group">
                        <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-display font-black text-[11px] text-paper overflow-hidden relative ${member.color || 'bg-ink'}`}>
                          {member.image ? (
                            <Image src={member.image} alt={member.name} fill className="object-cover" />
                          ) : member.initials}
                        </div>
                        <div>
                          <p className="font-text text-[12px] font-semibold text-ink group-hover:text-blue transition-colors leading-tight">{member.name.split(' ')[0]}</p>
                          <p className="font-text text-[10px] text-ink-40 leading-tight">{member.role.split(' ')[0]}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ) : (
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
          )}
        </div>

        <aside className="space-y-6">
          <div className="p-6 bg-ink text-paper rounded-2xl">
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Budget</p>
                <p className="font-display font-black text-lg">{job.rate}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Timeline</p>
                <p className="font-display font-black text-lg">{job.time}</p>
              </div>
              {job.lead && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Pod lead</p>
                  <p className="font-display font-black text-lg">{job.lead}</p>
                </div>
              )}
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
