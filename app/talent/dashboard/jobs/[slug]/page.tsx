'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Download, FileText, MapPin, Target, LayoutDashboard, Users2, CreditCard, Share2, Check } from 'lucide-react'
import { pods, getPodBySlug, getPodMembers } from '@/lib/pods'
import { getTalentProfile, getClientUser } from '@/lib/user'
import { getJobProgress, useJobBySlug } from '@/lib/jobs'
import { payouts } from '@/lib/payouts'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const statusStyles: Record<string, string> = {
  'Active': 'bg-green-50 text-green-700 border-green-100',
  'Completed': 'bg-primary/10 text-primary border-primary/20',
  'Paused': 'bg-orange-50 text-orange-700 border-orange-100',
  'Scoping': 'bg-border text-muted-foreground border-border',
  'Pod review': 'bg-accent/10 text-accent border-accent/20',
}

export default function TalentJobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { job, loading } = useJobBySlug(slug)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: job!.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-[1040px] mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded mb-8" />
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-8 w-72 bg-muted rounded" />
            <div className="h-3 w-48 bg-muted rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-muted rounded-full" />
            <div className="h-10 w-32 bg-muted rounded-full" />
          </div>
        </div>
        <div className="h-10 w-full bg-muted rounded mb-8" />
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-8">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-4/6 bg-muted rounded" />
          </div>
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  if (!job) {
    notFound()
  }

  const assignedPod = job.podSlug ? getPodBySlug(job.podSlug) : null
  const assignedPodMembers = assignedPod ? getPodMembers(assignedPod) : []
  const jobMilestones = job.milestones ?? []
  const jobDocuments = job.documents ?? []

  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8 overflow-x-hidden">
      <Link href="/talent/dashboard/jobs" className="font-text text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to jobs
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 rounded-sm border ${statusStyles[job.status as keyof typeof statusStyles]}`}>
              {job.status}
            </span>
          </div>
          <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">{job.title}</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-background border border-border rounded-full font-text text-sm font-semibold hover:border-input transition-colors"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
            {copied ? 'Copied!' : 'Share'}
          </button>
          <button className="px-5 py-2.5 bg-foreground text-background rounded-full font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]">
            Submit interest
          </button>
        </div>
      </div>

      <Tabs defaultValue="job" className="w-full min-w-0">
        <div className="mb-8 w-full overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="job" className="flex min-w-0 items-center justify-center gap-2">
              <Target size={14} /> Job
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex min-w-0 items-center justify-center gap-2">
              <LayoutDashboard size={14} /> Milestones
            </TabsTrigger>
            <TabsTrigger value="pod" className="flex min-w-0 items-center justify-center gap-2">
              <Users2 size={14} /> Team
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex min-w-0 items-center justify-center gap-2">
              <FileText size={14} /> Knowledge
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex min-w-0 items-center justify-center gap-2">
              <CreditCard size={14} /> Payments
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="grid min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
          <div className="min-w-0 max-w-full min-h-[calc(100vh-220px)] space-y-8">
            <TabsContent value="job" className="mt-0 min-w-0 max-w-full overflow-hidden">
              <section className="py-2 border-t border-border">
                <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6 mt-4">Job summary</h2>
                <p className="font-text text-[16px] leading-relaxed text-muted-foreground mb-8 max-w-[70ch]">
                  {job.summary}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/50 pt-6">
                  <div>
                    <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Scope of work</h3>
                    <ul className="space-y-2">
                      {job.scope.map((item) => (
                        <li key={item} className="flex items-start gap-2 font-text text-[13px] text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {job.requirements.map((item) => (
                        <li key={item} className="flex items-start gap-2 font-text text-sm text-muted-foreground">
                          <div className="w-1 h-1 bg-input rounded-full mt-1.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="milestones" className="mt-0 min-w-0 max-w-full space-y-8 overflow-hidden">
              <section className="border-t border-border">
                <div className="flex items-center justify-between py-4">
                  <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Milestones</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70">{getJobProgress(job)}% Velocity</span>
                  </div>
                </div>

                {jobMilestones.length > 0 ? (
                  <div className="max-w-full overflow-x-auto border border-border">
                    <table className="w-full table-fixed text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="w-[112px] px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold">Status</th>
                          <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold">Milestone</th>
                          <th className="w-[104px] px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold">Due</th>
                          <th className="w-[104px] px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {jobMilestones.map(ms => (
                          <tr key={ms.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${
                                ms.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20' :
                                ms.status === 'in-progress' ? 'bg-accent/5 text-accent border-accent/20' :
                                'bg-border text-muted-foreground/70 border-input'
                              }`}>
                                {ms.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-text text-sm font-bold text-foreground truncate">{ms.title}</p>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p className="font-text text-[10px] text-muted-foreground/70 uppercase tracking-tight">{ms.date}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-mono text-[11px] font-bold text-foreground">{ms.amount ?? '-'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center border border-dashed border-border rounded-xl">
                    <p className="font-text text-muted-foreground/70 text-sm">No milestones yet.</p>
                  </div>
                )}
              </section>

              {job.updates && job.updates.length > 0 && (
                <section className="border-t border-border">
                  <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4 mt-4">Pulse updates</h3>
                  <ul className="space-y-3">
                    {job.updates.map((update, i) => (
                      <li key={i} className="flex items-start gap-3 font-text text-sm text-muted-foreground leading-relaxed">
                        <div className="w-1 h-1 bg-primary/30 rounded-full mt-2 shrink-0" />
                        {update}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </TabsContent>

            <TabsContent value="pod" className="mt-0 min-w-0 max-w-full overflow-hidden">
              <section className="border-t border-border">
                <div className="flex items-center justify-between py-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Project Team</h3>
                </div>
                
                {assignedPod ? (
                  <>
                    <p className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground mb-2">{assignedPod.name}</p>
                    <p className="font-text text-sm text-muted-foreground mb-8 leading-relaxed max-w-[65ch]">{assignedPod.focus}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border overflow-hidden">
                      {assignedPodMembers.map(member => (
                        <div key={member.id} className="flex items-center gap-3 p-4 bg-background group">
                          <div className={`w-10 h-10 rounded-sm shrink-0 flex items-center justify-center font-display font-black text-[11px] text-background overflow-hidden relative ${member.color || 'bg-foreground'}`}>
                            {member.image ? (
                              <Image src={member.image} alt={member.name} fill className="object-cover" />
                            ) : member.initials}
                          </div>
                          <div>
                            <p className="font-text text-sm font-bold text-foreground leading-tight">{member.name}</p>
                            <p className="font-text text-[11px] text-muted-foreground/70 leading-tight mt-0.5">{member.talentRole ?? member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center border border-dashed border-border rounded-xl">
                    <p className="font-text text-muted-foreground/70 text-sm">Team selection in progress</p>
                  </div>
                )}
              </section>
            </TabsContent>

            <TabsContent value="knowledge" className="mt-0 min-w-0 max-w-full overflow-hidden">
              <section className="py-2 border-t border-border">
                <div className="mt-4 space-y-3">
                  <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70">Engagement documents</h3>

                  {jobDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {jobDocuments.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg group">
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                            <FileText size={16} className="text-primary/70 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-text text-xs font-bold text-foreground truncate">{file.name}</p>
                              <p className="font-text text-[9px] text-muted-foreground/70">{file.size} · {file.uploadedAt}</p>
                            </div>
                          </a>
                          <a href={file.url} download={file.name} className="p-1.5 text-muted-foreground/50 hover:text-foreground rounded-sm transition-all shrink-0 ml-2" aria-label={`Download ${file.name}`}>
                            <Download size={13} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center border border-dashed border-border rounded-xl">
                      <p className="font-text text-muted-foreground/70 text-sm">No documents have been shared yet.</p>
                    </div>
                  )}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="payments" className="mt-0 min-w-0 max-w-full overflow-hidden">
              {(() => {
                const jobPayouts = payouts.filter(p => p.jobSlug === job.slug)
                const cleared = jobPayouts.filter(p => p.status === 'Cleared').reduce((a, p) => a + p.amountRaw, 0)
                const pending = jobPayouts.filter(p => p.status === 'Pending' || p.status === 'Processing').reduce((a, p) => a + p.amountRaw, 0)
                const nextPayout = jobPayouts.filter(p => p.status === 'Pending').sort((a, b) => a.id - b.id)[0]
                const payoutStatusStyles: Record<string, string> = {
                  Cleared:    'bg-green-50 text-green-700 border-green-200',
                  Pending:    'bg-amber-50 text-amber-700 border-amber-200',
                  Processing: 'bg-primary/10 text-primary border-primary/20',
                }
                return (
                  <section className="border-t border-border">
                    <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6 mt-4">Your earnings</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="bg-foreground text-background rounded-2xl p-5">
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-2">Cleared</p>
                        <p className="font-display font-black text-[28px] tracking-[-0.03em] leading-none">${cleared.toLocaleString()}</p>
                      </div>
                      <div className={`border rounded-2xl p-5 bg-background ${pending > 0 ? 'border-amber-200' : 'border-border'}`}>
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-2">Pending</p>
                        <p className={`font-display font-black text-[28px] tracking-[-0.03em] leading-none ${pending > 0 ? 'text-amber-600' : 'text-foreground'}`}>${pending.toLocaleString()}</p>
                      </div>
                      <div className="border border-border rounded-2xl p-5 bg-background">
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-2">Next payout</p>
                        {nextPayout ? (
                          <p className="font-display font-black text-[22px] tracking-[-0.03em] text-foreground leading-none">{nextPayout.amount}</p>
                        ) : (
                          <p className="font-display font-black text-[18px] tracking-[-0.02em] text-muted-foreground/50 leading-none">Nothing due</p>
                        )}
                      </div>
                    </div>
                    <div className="max-w-full overflow-x-auto border border-border">
                      <table className="w-full table-fixed text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="w-[104px] px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Status</th>
                            <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Milestone</th>
                            <th className="w-[104px] px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 text-right">Amount</th>
                            <th className="w-[104px] px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {jobPayouts.map(p => (
                            <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${payoutStatusStyles[p.status]}`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-text text-sm font-semibold text-foreground truncate">{p.label}</p>
                                <p className="font-text text-[10px] text-muted-foreground/60 mt-0.5 truncate">{p.meta}</p>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-mono text-[11px] font-bold text-foreground">{p.amount}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-text text-xs text-muted-foreground">{p.date}</span>
                              </td>
                            </tr>
                          ))}
                          {jobPayouts.length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-10 text-center font-text text-sm text-muted-foreground/70">No payouts yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-text text-[11px] text-muted-foreground/50 mt-3">Comcorpe holds client payments in escrow and releases to you on milestone sign-off.</p>
                  </section>
                )
              })()}
            </TabsContent>
          </div>

          <aside className="space-y-6">
            <div className="p-6 text-foreground border border-border rounded-lg">
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Client</p>
                  <p className="font-display font-black text-lg">{getClientUser(job.clientId).name}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Commercial structure</p>
                  <p className="font-display font-black text-lg">{job.rate}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Expected duration</p>
                  <p className="font-display font-black text-lg">{job.time}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Location</p>
                  <p className="font-display font-black text-lg flex items-center gap-2">
                    <MapPin size={15} strokeWidth={1.5} className="text-muted-foreground/70" />
                    {job.location}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Updated</p>
                  <p className="font-display font-black text-lg flex items-center gap-2">
                    <Clock size={15} strokeWidth={1.5} className="text-muted-foreground/70" />
                    {job.updatedAt}
                  </p>
                </div>
                {job.startDate && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Engagement dates</p>
                    <p className="font-display font-black text-lg tracking-tight">{job.startDate}{' — '}{job.endDate || 'Present'}</p>
                  </div>
                )}
                {job.lead && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Strategic pod lead</p>
                    <p className="font-display font-black text-lg">{job.lead}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Comcorpe support</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-black text-[11px] text-primary-foreground">
                  JP
                </div>
                <div>
                  <p className="font-text text-[13px] font-bold text-foreground leading-tight">Jide Pinheiro</p>
                  <p className="font-text text-[11px] text-muted-foreground/70 mt-0.5">Strategic Director</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Tabs>
    </div>
  )
}
