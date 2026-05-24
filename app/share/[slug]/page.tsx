'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaLinkedin } from 'react-icons/fa'
import { MapPin, Clock, Tag, CheckCircle2, ExternalLink, Target, LayoutDashboard, Users2, Stethoscope, FileText, Download, DollarSign, ShieldCheck, Link2, Check } from 'lucide-react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Job } from '@/lib/jobs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePods } from '@/lib/pods'
import { useTreatmentPlan } from '@/lib/treatment-plan'
import NetworkAffiliateBadge from '@/components/dashboard/NetworkAffiliateBadge'
import SLABadge from '@/components/dashboard/SLABadge'
import { getTalentProfile, useUsers } from '@/lib/user'

const statusStyles: Record<string, string> = {
  'Active':     'bg-green-50 text-green-700 border-green-100',
  'Completed':  'bg-primary/10 text-primary border-primary/20',
  'Paused':     'bg-orange-50 text-orange-700 border-orange-100',
  'Scoping':    'bg-border text-muted-foreground border-border',
  'Pod review': 'bg-accent/10 text-accent border-accent/20',
  'Cancelled':  'bg-red-50 text-red-600 border-red-200',
}

const milestoneStyles: Record<string, string> = {
  completed:   'bg-primary/10 text-primary border-primary/20',
  'in-progress': 'bg-accent/5 text-accent border-accent/20',
  pending:     'bg-border text-muted-foreground/70 border-input',
}

export default function PublicJobPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const { pods, loading: podsLoading } = usePods()
  const { users } = useUsers()
  const { plan, loading: planLoading } = useTreatmentPlan(slug)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'jobs', slug),
      (snap) => {
        setJob(snap.exists() ? (snap.data() as Job) : null)
        setLoading(false)
      },
      () => {
        setJob(null)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [slug])

  const milestones = job?.milestones ?? []
  const assignedPod = job?.podSlug ? (pods.find((pod) => pod.slug === job.podSlug) ?? null) : null
  const hasAssignedPod = Boolean(job?.podSlug)
  const podMembers = assignedPod
    ? assignedPod.memberIds.map((id) => users.find((user) => user.id === id) ?? getTalentProfile(id))
    : []
  const hasKnowledge = (job?.documents ?? []).length > 0

  async function handleCopyLink() {
    if (typeof window === 'undefined') return
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!job || !job.sharedPublicly) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-display font-black text-2xl text-foreground">This brief is private</p>
        <p className="font-text text-sm text-muted-foreground max-w-xs">
          The owner hasn&apos;t enabled public sharing for this engagement.
        </p>
        <Link href="/" className="font-text text-sm font-semibold text-primary hover:underline">
          Go to Comcorpe →
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-[860px] mx-auto flex items-center justify-between">
          <Image
            src="/images/comcorpe.png"
            alt="Comcorpe"
            width={118}
            height={24}
            className="h-6 w-auto object-contain dark:invert"
            priority
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-full font-text text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              {copied ? <Check size={11} /> : <Link2 size={11} />}
              {copied ? 'Copied' : 'Share'}
            </button>
            <a
              href="mailto:hello@comcorpe.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background rounded-full font-text text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Get in touch <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-10">
        {/* Title block */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 rounded-sm border ${statusStyles[job.status] ?? statusStyles['Scoping']}`}>
              {job.status}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/50">
              {job.type}
            </span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl tracking-[-0.03em] text-foreground leading-tight mb-5">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground/70">
            {job.location && (
              <span className="flex items-center gap-1.5 font-text text-sm">
                <MapPin size={13} /> {job.location}
              </span>
            )}
            {job.time && (
              <span className="flex items-center gap-1.5 font-text text-sm">
                <Clock size={13} /> {job.time}
              </span>
            )}
            {job.tags.length > 0 && (
              <span className="flex items-center gap-1.5 font-text text-sm">
                <Tag size={13} /> {job.tags.join(' · ')}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="brief" className="w-full">
          <div className="mb-8 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex w-max min-w-full justify-start">
              <TabsTrigger value="brief" className="flex items-center gap-2">
                <Target size={14} /> Brief
              </TabsTrigger>
              {milestones.length > 0 && (
                <TabsTrigger value="milestones" className="flex items-center gap-2">
                  <LayoutDashboard size={14} /> Milestones
                </TabsTrigger>
              )}
              {hasAssignedPod && (
                <TabsTrigger value="pod" className="flex items-center gap-2">
                  <Users2 size={14} /> Pod
                </TabsTrigger>
              )}
              <TabsTrigger value="plan" className="flex items-center gap-2">
                <Stethoscope size={14} /> Plan
              </TabsTrigger>
              {hasKnowledge && (
                <TabsTrigger value="knowledge" className="flex items-center gap-2">
                  <FileText size={14} /> Knowledge
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Brief */}
          <TabsContent value="brief" className="mt-0 space-y-10">
            <section className="border-t border-border pt-6">
              <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Overview</h2>
              <p className="font-text text-base leading-relaxed text-muted-foreground max-w-[70ch]">
                {job.summary}
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
              <div>
                <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Scope of work</h2>
                <ul className="space-y-3">
                  {job.scope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                      <span className="font-text text-sm text-foreground leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                      <span className="font-text text-sm text-muted-foreground leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-display font-black text-lg tracking-tight text-foreground">Interested in this engagement?</p>
                <p className="font-text text-sm text-muted-foreground mt-1">Reach out to the Comcorpe team to start a conversation.</p>
              </div>
              <a
                href="mailto:hello@comcorpe.com"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Get in touch
              </a>
            </section>
          </TabsContent>

          {/* Milestones */}
          <TabsContent value="milestones" className="mt-0">
            <section className="border-t border-border pt-6">
              <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6">Engagement milestones</h2>
              <div className="border border-border overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[120px]">Status</th>
                      <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold">Milestone</th>
                      <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[120px]">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {milestones.map((ms) => (
                      <tr key={ms.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${milestoneStyles[ms.status] ?? milestoneStyles.pending}`}>
                            {ms.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-text text-sm font-bold text-foreground">{ms.title}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="font-text text-[10px] text-muted-foreground/70 uppercase tracking-tight">{ms.date}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="pod" className="mt-0">
            <section className="border-t border-border pt-6 space-y-6">
              <div>
                <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Assigned pod</h2>
                {podsLoading ? (
                  <p className="font-text text-sm text-muted-foreground">Loading pod...</p>
                ) : assignedPod ? (
                  <div className="border border-border rounded-xl p-6 bg-background">
                    <p className="font-display font-black text-xl text-foreground">{assignedPod.name}</p>
                    <p className="font-text text-sm text-muted-foreground mt-2 max-w-[70ch]">{assignedPod.summary || assignedPod.focus}</p>
                    <div className="flex flex-wrap gap-3 mt-4 text-sm text-muted-foreground">
                      {assignedPod.focus && <span>{assignedPod.focus}</span>}
                      {assignedPod.availability && <span>{assignedPod.availability}</span>}
                      {assignedPod.rate && <span>{assignedPod.rate}</span>}
                    </div>
                  </div>
                ) : hasAssignedPod ? (
                  <p className="font-text text-sm text-muted-foreground">
                    Pod details are attached to this brief, but they aren&apos;t available in this public view right now.
                  </p>
                ) : (
                  <p className="font-text text-sm text-muted-foreground">No pod assigned.</p>
                )}
              </div>

              {podMembers.length > 0 && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Pod members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {podMembers.map((member) => (
                      <article key={member.id} className="border border-border rounded-xl p-5 bg-background flex flex-col">
                        <div className="mb-4">
                          <div className={`w-14 h-14 rounded-xl border border-border overflow-hidden relative flex items-center justify-center ${member.color || 'bg-foreground'} font-display font-black text-[16px] text-background`}>
                            {member.image ? (
                              <Image src={member.image} alt={member.name} fill className="object-cover" />
                            ) : (
                              member.initials
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-display font-black text-[18px] tracking-[-0.01em] text-foreground leading-tight pr-6">
                            {member.name}
                          </h3>
                          <p className="font-mono text-[9px] uppercase tracking-eyebrow text-primary/60 mt-1">{member.talentRole ?? member.role}</p>
                        </div>

                        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                          <ShieldCheck size={12} className="text-primary shrink-0" strokeWidth={2.5} />
                          {(member.networkAffiliations ?? []).length > 0 && (
                            <NetworkAffiliateBadge affiliations={member.networkAffiliations!} size={12} />
                          )}
                          <span aria-label="LinkedIn" className="inline-flex items-center justify-center text-[#0A66C2]">
                            <FaLinkedin size={12} aria-hidden="true" />
                          </span>
                          {member.ndaSigned && (
                            <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full">
                              NDA
                            </span>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-muted flex items-center justify-between gap-2 text-muted-foreground font-text text-[11px]">
                          <div className="flex items-center gap-2 truncate">
                            <MapPin size={10} className="text-input" />
                            <span className="truncate">{member.bg}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <SLABadge variant="chip" />
                            <span className="flex items-center gap-1 font-semibold text-foreground">
                              <DollarSign size={10} className="text-input" />
                              {member.rate}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="plan" className="mt-0">
            <section className="border-t border-border pt-6">
              <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6">Diagnosis / treatment plan</h2>
              {planLoading ? (
                <p className="font-text text-sm text-muted-foreground">Loading plan...</p>
              ) : plan?.content ? (
                <div className="border border-border rounded-xl p-6 bg-background">
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/50 mb-4">
                    {new Date(plan.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <div
                    className="font-text text-sm leading-relaxed prose prose-sm max-w-none prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-h2:text-base prose-h2:mt-6 prose-h2:mb-2 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground"
                    dangerouslySetInnerHTML={{ __html: plan.content }}
                  />
                </div>
              ) : (
                <p className="font-text text-sm text-muted-foreground">No treatment plan has been shared yet.</p>
              )}
            </section>
          </TabsContent>

          <TabsContent value="knowledge" className="mt-0">
            <section className="border-t border-border pt-6">
              <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6">Shared documents</h2>
              {(job.documents ?? []).length > 0 ? (
                <div className="space-y-3">
                  {(job.documents ?? []).map((file, i) => (
                    <a
                      key={`${file.storagePath}-${i}`}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 border border-border rounded-xl p-4 bg-background hover:bg-muted/30 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-text text-sm font-semibold text-foreground truncate">{file.name}</p>
                        <p className="font-text text-xs text-muted-foreground mt-1">{file.size} · {file.uploadedAt}</p>
                      </div>
                      <Download size={16} className="text-muted-foreground/70 shrink-0" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="font-text text-sm text-muted-foreground">No documents have been shared yet.</p>
              )}
            </section>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="border-t border-border mt-16 pt-8 flex items-center justify-between">
          <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/40">
            Powered by Comcorpe
          </p>
          <Link href="/" className="font-text text-xs text-muted-foreground/50 hover:text-foreground transition-colors">
            comcorpe.com
          </Link>
        </footer>
      </main>
    </div>
  )
}
