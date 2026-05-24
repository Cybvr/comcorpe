'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound, useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, CheckCircle2, DollarSign, Globe2, Layers3, ShieldCheck, Users, Check, X } from 'lucide-react'
import { getPods, getTalent, updateJob } from '@/lib/admin/store'
import { useJobs } from '@/lib/jobs'
import { useCurrentUser } from '@/lib/user'
import { type Pod } from '@/lib/pods'
import { type User } from '@/lib/user'
import NetworkAffiliateBadge from '@/components/dashboard/NetworkAffiliateBadge'

export default function TalentPodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()

  const [pod, setPod] = useState<Pod | null | undefined>(undefined)
  const [members, setMembers] = useState<User[]>([])
  const [lead, setLead] = useState<User | null>(null)
  const [showAttach, setShowAttach] = useState(false)
  const [attaching, setAttaching] = useState(false)
  const [attached, setAttached] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const { user: currentUser } = useCurrentUser()
  const { jobs } = useJobs()
  const attachableJobs = jobs.filter(j => j.clientId === currentUser?.clientId && !j.podSlug && j.status !== 'Completed' && j.status !== 'Cancelled')

  async function handleAttach() {
    if (!selectedJobId) return
    const job = attachableJobs.find(j => j.id === selectedJobId)
    if (!job || !pod) return
    setAttaching(true)
    await updateJob(job.id, { podSlug: pod.slug })
    setAttaching(false)
    setAttached(true)
    setTimeout(() => { setShowAttach(false); setAttached(false); setSelectedJobId(null) }, 1400)
  }

  useEffect(() => {
    Promise.all([getPods(), getTalent()]).then(([pods, talent]) => {
      const found = pods.find(p => p.slug === slug) ?? null
      setPod(found)
      if (found) {
        setMembers(found.memberIds.map(id => talent.find(t => t.id === id)).filter((t): t is User => t !== undefined))
        setLead(talent.find(t => t.id === found.leadId) ?? null)
      }
    })
  }, [slug])

  if (pod === undefined) return null
  if (!pod) notFound()

  const fallbackLead: User = lead ?? { id: pod.leadId, name: pod.leadId, initials: pod.leadId.slice(0, 2).toUpperCase(), role: 'talent' }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1040px] mx-auto">
      <button onClick={() => router.back()} className="font-text text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">
        <article className="border border-border rounded-xl p-8 bg-background">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-foreground flex items-center justify-center border border-border overflow-hidden relative shrink-0">
                {fallbackLead.image ? (
                  <Image src={fallbackLead.image} alt={fallbackLead.name} fill className="object-cover" />
                ) : (
                  <span className="font-display font-black text-[15px] text-background">{fallbackLead.initials}</span>
                )}
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-3">{pod.focus}</p>
                <h1 className="font-display font-black text-[40px] tracking-[-0.03em] text-foreground leading-none">{pod.name}</h1>
                <p className="font-text text-[16px] leading-relaxed text-muted-foreground mt-5 max-w-[62ch]">{pod.summary}</p>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-eyebrow px-2 py-1 border border-primary/20 bg-primary/10 text-primary rounded-sm shrink-0">
              {pod.fitScore}% fit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
            <div className="border border-border rounded-xl p-4">
              <Users size={16} strokeWidth={1.5} className="text-primary mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Lead</p>
              <div className="font-display font-black text-[17px] tracking-[-0.01em] text-foreground leading-tight">{fallbackLead.name}</div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <Layers3 size={16} strokeWidth={1.5} className="text-primary mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Availability</p>
              <div className="font-display font-black text-[17px] tracking-[-0.01em] text-foreground leading-tight">{pod.availability}</div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <Globe2 size={16} strokeWidth={1.5} className="text-primary mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Markets</p>
              <div className="font-display font-black text-[17px] tracking-[-0.01em] text-foreground leading-tight">{pod.markets.length} covered</div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <DollarSign size={16} strokeWidth={1.5} className="text-primary mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Pod/hour</p>
              <div className="font-display font-black text-[17px] tracking-[-0.01em] text-foreground leading-tight">{pod.rate}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <section>
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-4">Pod composition</h2>
              <div className="flex flex-col gap-2">
                {members.map((member) => (
                  <Link
                    key={member.id}
                    href={`/client/dashboard/search/talent/${member.id}`}
                    className="border border-border rounded-lg p-3 flex items-center gap-3 font-text text-sm text-muted-foreground bg-border/10 hover:border-input transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center font-display font-black text-[9px] text-background shrink-0 border border-border overflow-hidden relative">
                      {member.image ? (
                        <Image src={member.image} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                        member.initials
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{member.name}</p>
                      <p className="text-[11px] opacity-70">{member.talentRole ?? member.role}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <ShieldCheck size={11} className="text-primary shrink-0" strokeWidth={2.5} />
                        {(member.networkAffiliations ?? []).length > 0 && (
                          <NetworkAffiliateBadge affiliations={member.networkAffiliations!} size={11} />
                        )}
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-input group-hover:text-primary transition-all" />
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-4">Why this pod fits</h2>
              <div className="flex flex-col gap-3">
                {pod.evidence.map((item) => (
                  <div key={item} className="border border-border rounded-lg p-4 font-text text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-1">Recommended next step</p>
              <p className="font-text text-sm text-muted-foreground">{pod.nextStep}</p>
            </div>
            <button className="font-text text-sm font-semibold px-5 py-3 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms] shrink-0">
              Approve intros
            </button>
          </div>
        </article>

        <aside className="border border-border rounded-xl p-5 bg-background space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-4">Market coverage</p>
            <div className="flex flex-col gap-2">
              {pod.markets.map((market) => (
                <div key={market} className="flex items-center gap-2 font-text text-sm text-muted-foreground">
                  <CheckCircle2 size={13} className="text-primary" /> {market}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Attach to brief</p>
            {!showAttach ? (
              <button
                onClick={() => setShowAttach(true)}
                disabled={attachableJobs.length === 0}
                className="w-full inline-flex items-center justify-center gap-1.5 font-text text-xs font-semibold px-4 py-2.5 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {attachableJobs.length === 0 ? 'No open briefs' : <>Select a brief <ArrowUpRight size={12} /></>}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  {attachableJobs.map(job => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => setSelectedJobId(job.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border font-text text-sm transition-colors ${
                        selectedJobId === job.id
                          ? 'border-primary bg-primary/5 text-primary font-semibold'
                          : 'border-border hover:border-input text-foreground'
                      }`}
                    >
                      {job.title}
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 mt-0.5">{job.status}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleAttach}
                    disabled={!selectedJobId || attaching || attached}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-foreground text-background rounded-lg font-text text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40"
                  >
                    {attached ? <><Check size={12} /> Attached</> : attaching ? 'Attaching…' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => { setShowAttach(false); setSelectedJobId(null) }}
                    className="p-2 text-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
