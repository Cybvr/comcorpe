'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound, usePathname, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft,
  Briefcase,
  Clock,
  MapPin,
  Target,
  LayoutDashboard,
  Users2,
  FileText,
  Upload,
  Send,
  Sparkles,
  BrainCircuit,
  Search,
  Plus,
  X,
  Check,
  CreditCard,
  ShieldCheck,
  Download,
} from 'lucide-react'
import { pods, getPodBySlug, getPodMembers } from '@/lib/pods'
import { getTalentProfile } from '@/lib/user'
import { jobs, getJobBySlug, getJobProgress } from '@/lib/jobs'
import { getJobs, updateJob } from '@/lib/admin/store'
import { invoices, getInvoice } from '@/lib/invoices'
import { contractTerms } from '@/lib/contract'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const statusStyles: Record<string, string> = {
  'Active': 'bg-green-50 text-green-700 border-green-100',
  'Completed': 'bg-primary/10 text-primary border-primary/20',
  'Paused': 'bg-orange-50 text-orange-700 border-orange-100',
  'Scoping': 'bg-border text-muted-foreground border-border',
  'Pod review': 'bg-accent/10 text-accent border-accent/20',
  'Cancelled': 'bg-red-50 text-red-600 border-red-200',
}

const jobTabs = ['brief', 'milestones', 'pod', 'knowledge', 'payments', 'contract'] as const
type JobTab = (typeof jobTabs)[number]

function isJobTab(value: string | null): value is JobTab {
  return value !== null && (jobTabs as readonly string[]).includes(value)
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const job = getJobBySlug(slug)

  if (!job) {
    notFound()
  }

  const assignedPod = job.podSlug ? getPodBySlug(job.podSlug) : null
  const assignedPodMembers = assignedPod ? getPodMembers(assignedPod) : []
  const primaryPods = pods.slice(0, 2)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeTab = isJobTab(requestedTab) ? requestedTab : 'brief'

  function tabHref(tab: JobTab) {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'brief') {
      params.delete('tab')
    } else {
      params.set('tab', tab)
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const liveJob = getJobs().find(j => j.id === job.id)
  const [jobStatus, setJobStatus] = useState(liveJob?.status ?? job.status)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const handlePause = () => {
    updateJob(job.id, { status: 'Paused' })
    setJobStatus('Paused')
  }

  const handleResume = () => {
    updateJob(job.id, { status: 'Active' })
    setJobStatus('Active')
  }

  const handleCancel = () => {
    updateJob(job.id, { status: 'Cancelled' })
    setJobStatus('Cancelled')
    setConfirmCancel(false)
  }

  // Local state for milestones
  const [localMilestones, setLocalMilestones] = useState(job.milestones || [])
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '', amount: '' })

  // Knowledge Tab States
  const [chatQuery, setChatQuery] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([])
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Technical_Requirements_V1.pdf', size: '2.4MB', date: '2 days ago' },
    { name: 'Brand_Guidelines_2025.pdf', size: '1.8MB', date: '5 days ago' }
  ])

  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.date) return
    const id = `m_custom_${Date.now()}`
    const rawAmount = newMilestone.amount.replace(/[^0-9.]/g, '')
    const formattedAmount = rawAmount
      ? `$${parseInt(rawAmount).toLocaleString()}`
      : '—'
    const [y, m, d] = newMilestone.date.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const formattedDate = y && m && d ? `${parseInt(d)} ${months[parseInt(m)-1]} ${y}` : newMilestone.date
    const ms: any = {
      id,
      title: newMilestone.title,
      date: formattedDate,
      status: 'pending',
      amount: formattedAmount,
    }
    setLocalMilestones([...localMilestones, ms])
    setNewMilestone({ title: '', date: '', amount: '' })
    setIsAddingMilestone(false)
  }

  const handleDeleteMilestone = (id: string) => {
    setLocalMilestones(prev => prev.filter(m => m.id !== id))
  }

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatQuery) return
    const newHistory = [...chatHistory, { role: 'user' as const, content: chatQuery }]
    setChatHistory(newHistory)
    setChatQuery('')
    setIsAsking(true)

    setTimeout(() => {
      setChatHistory([...newHistory, { 
        role: 'assistant', 
        content: `Based on your technical requirements and the recent brand updates, I recommend focusing on the Merchant API authentication flow first. It appears to be the primary blocker for the 'Loyalty Dashboard' milestone scheduled for next month.` 
      }])
      setIsAsking(false)
    }, 1500)
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1040px] mx-auto">
      <Link href="/client/dashboard/jobs" className="font-text text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to briefs
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 rounded-sm border ${statusStyles[jobStatus as keyof typeof statusStyles]}`}>
              {jobStatus}
            </span>
          </div>
          <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">{job.title}</h1>
          <div className="flex items-center gap-4 mt-3 font-text text-[13px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} strokeWidth={1.5} className="text-muted-foreground/70" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} strokeWidth={1.5} className="text-muted-foreground/70" />
              {job.updatedAt}
            </div>
          </div>
        </div>
        {jobStatus !== 'Completed' && jobStatus !== 'Cancelled' && (
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-background border border-border rounded-full font-text text-sm font-semibold hover:border-input transition-colors">
              Edit brief
            </button>
            {jobStatus === 'Active' && (
              <button
                onClick={handlePause}
                className="px-5 py-2.5 bg-foreground text-background rounded-full font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]"
              >
                Pause engagement
              </button>
            )}
            {jobStatus === 'Paused' && (
              <button
                onClick={handleResume}
                className="px-5 py-2.5 bg-orange-500 text-white rounded-full font-text text-sm font-semibold hover:bg-orange-600 transition-colors duration-[120ms]"
              >
                Resume engagement
              </button>
            )}
            {(jobStatus === 'Active' || jobStatus === 'Paused') && !confirmCancel && (
              <button
                onClick={() => setConfirmCancel(true)}
                className="px-5 py-2.5 bg-background border border-red-200 text-red-500 rounded-full font-text text-sm font-semibold hover:bg-red-50 transition-colors duration-[120ms]"
              >
                Cancel
              </button>
            )}
            {confirmCancel && (
              <div className="flex items-center gap-2">
                <span className="font-text text-sm text-muted-foreground">Are you sure?</span>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-full font-text text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Yes, cancel
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="px-4 py-2 border border-border rounded-full font-text text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Keep it
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Tabs value={activeTab} className="w-full">
        <div className="mb-8 w-full overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="w-max">
            <TabsTrigger value="brief" className="flex items-center gap-2" asChild>
              <Link href={tabHref('brief')} scroll={false}>
                <Target size={14} /> Brief
              </Link>
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex items-center gap-2" asChild>
              <Link href={tabHref('milestones')} scroll={false}>
                <LayoutDashboard size={14} /> Milestones
              </Link>
            </TabsTrigger>
            <TabsTrigger value="pod" className="flex items-center gap-2" asChild>
              <Link href={tabHref('pod')} scroll={false}>
                <Users2 size={14} /> Pod
              </Link>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2" asChild>
              <Link href={tabHref('knowledge')} scroll={false}>
                <FileText size={14} /> Knowledge
              </Link>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2" asChild>
              <Link href={tabHref('payments')} scroll={false}>
                <CreditCard size={14} /> Payments
              </Link>
            </TabsTrigger>
            <TabsTrigger value="contract" className="flex items-center gap-2" asChild>
              <Link href={tabHref('contract')} scroll={false}>
                <ShieldCheck size={14} /> Contract
              </Link>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="space-y-8">
            <TabsContent value="brief" className="mt-0">
              <section className="py-2 border-t border-border">
                <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6 mt-4">Brief summary</h2>
                <p className="font-text text-[16px] leading-relaxed text-muted-foreground mb-8 max-w-[70ch]">
                  {job.summary}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/50 pt-6">
                  <div>
                    <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Engagement scope</h3>
                    <ul className="space-y-2">
                      {job.scope.map((item) => (
                        <li key={item} className="flex items-start gap-2 font-text text-[13px] text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Success requirements</h3>
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

            <TabsContent value="milestones" className="mt-0 space-y-8">
              <section className="border-t border-border">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Milestones</h2>
                    <button 
                      onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                      className="p-1 hover:bg-muted rounded-sm text-primary transition-colors flex items-center gap-1 font-mono text-[9px] uppercase tracking-tight"
                    >
                      {isAddingMilestone ? <X size={12} /> : <Plus size={12} />}
                      {isAddingMilestone ? 'Cancel' : 'Add milestone'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70">{getJobProgress({...job, milestones: localMilestones})}% Velocity</span>
                  </div>
                </div>
                
                <div className="border border-border overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[120px]">Milestone Status</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[100px]">Payment</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold">Milestone</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[100px]">Due</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold text-right w-[100px]">Amount</th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isAddingMilestone && (
                        <tr className="bg-primary/5">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider bg-border text-muted-foreground/70 border-input">
                              PENDING
                            </span>
                          </td>
                          <td className="px-4 py-3">
                             <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider bg-muted text-muted-foreground/70 border-border">
                                UNSET
                             </span>
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text"
                              placeholder="Milestone title..."
                              autoFocus
                              className="w-full bg-transparent border-none focus:ring-0 font-text text-sm font-bold text-foreground placeholder:text-input p-0"
                              value={newMilestone.title}
                              onChange={e => setNewMilestone({...newMilestone, title: e.target.value})}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="date"
                              className="w-full bg-transparent border-none focus:ring-0 font-text text-[10px] text-muted-foreground/70 uppercase tracking-tight p-0"
                              value={newMilestone.date}
                              onChange={e => setNewMilestone({...newMilestone, date: e.target.value})}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <input
                                type="text"
                                placeholder="$0"
                                className="w-16 bg-transparent border-none focus:ring-0 font-mono text-[11px] font-bold text-foreground placeholder:text-input p-0 text-right"
                                value={newMilestone.amount}
                                onChange={e => setNewMilestone({...newMilestone, amount: e.target.value})}
                              />
                              <button
                                onClick={handleAddMilestone}
                                disabled={!newMilestone.title || !newMilestone.date}
                                className="p-1 bg-foreground text-background rounded-sm hover:bg-primary hover:text-primary-foreground disabled:opacity-30 transition-all"
                              >
                                <Check size={12} />
                              </button>
                            </div>
                          </td>
                          <td />
                        </tr>
                      )}
                      {localMilestones.map((ms) => {
                        const inv = getInvoice(job.slug, ms.id)
                        return (
                          <tr key={ms.id} className="group hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${
                                ms.status === 'completed'  ? 'bg-primary/10 text-primary border-primary/20' :
                                ms.status === 'in-progress' ? 'bg-accent/5 text-accent border-accent/20' :
                                'bg-border text-muted-foreground/70 border-input'
                              }`}>
                                {ms.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {inv && (
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${
                                  inv.status === 'Paid'       ? 'bg-green-50 text-green-700 border-green-200' :
                                  inv.status === 'Processing' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  'bg-muted text-muted-foreground/70 border-border'
                                }`}>
                                  {inv.status}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-text text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                {ms.title}
                              </p>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p className="font-text text-[10px] text-muted-foreground/70 uppercase tracking-tight">{ms.date}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-mono text-[11px] font-bold text-foreground">
                                {inv?.amount ?? (ms.id.startsWith('m_custom_') ? (ms as any).amount : '—')}
                              </span>
                            </td>
                            <td className="pr-3 py-3 text-right">
                              <button
                                onClick={() => handleDeleteMilestone(ms.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground/50 hover:text-red-500 transition-all"
                              >
                                <X size={12} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Recent updates */}
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

            <TabsContent value="pod" className="mt-0">
              {assignedPod ? (
                <section className="border-t border-border">
                  <div className="flex items-center justify-between py-4">
                    <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Assigned pod</h3>
                    <Link href={`/client/dashboard/search/${assignedPod.slug}?returnTo=${encodeURIComponent(tabHref('pod'))}`} className="font-mono text-[9px] uppercase tracking-eyebrow text-primary hover:underline">
                      View profile
                    </Link>
                  </div>
                  
                  <p className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground mb-2">{assignedPod.name}</p>
                  <p className="font-text text-sm text-muted-foreground mb-5 leading-relaxed max-w-[65ch]">{assignedPod.focus}</p>

                  <div className="mb-8 inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-background">
                    <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70">Pod/hour</span>
                    <span className="font-display font-black text-[15px] tracking-[-0.01em] text-foreground">{assignedPod.rate}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border overflow-hidden">
                    {assignedPodMembers.map(member => (
                      <Link key={member.id} href={`/client/dashboard/search/talent/${member.id}`} className="flex items-center gap-3 p-4 bg-background hover:bg-muted transition-all group">
                        <div className={`w-10 h-10 rounded-sm shrink-0 flex items-center justify-center font-display font-black text-[11px] text-background overflow-hidden relative ${member.color || 'bg-foreground'}`}>
                          {member.image ? (
                            <Image src={member.image} alt={member.name} fill className="object-cover" />
                          ) : member.initials}
                        </div>
                        <div>
                          <p className="font-text text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{member.name}</p>
                          <p className="font-text text-[11px] text-muted-foreground/70 leading-tight mt-0.5">{member.talentRole ?? member.role}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="border-t border-border">
                  <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4 mt-4">Recommended pods</h2>
                  <div className="grid grid-cols-1 gap-px bg-border border border-border overflow-hidden">
                    {primaryPods.map((pod) => {
                      const lead = getTalentProfile(pod.leadId)
                      return (
                        <Link key={pod.id} href={`/client/dashboard/search/${pod.slug}?returnTo=${encodeURIComponent(tabHref('pod'))}`} className="p-4 bg-background flex items-center gap-4 hover:bg-muted transition-all group">
                          <div className="w-10 h-10 rounded-sm bg-foreground flex items-center justify-center font-display font-black text-[11px] text-background shrink-0 border border-border overflow-hidden relative">
                            {lead.image ? (
                              <Image src={lead.image} alt={lead.name} fill className="object-cover" />
                            ) : (
                              lead.initials
                            )}
                          </div>
                          <div>
                            <h3 className="font-display font-black text-[15px] text-foreground group-hover:text-primary transition-colors leading-tight">{pod.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="font-text text-[12px] text-muted-foreground">{pod.focus}</span>
                              <span className="w-1 h-1 bg-border rounded-full" />
                              <span className="font-text text-[12px] text-primary font-semibold">{pod.fitScore}%</span>
                              <span className="w-1 h-1 bg-border rounded-full" />
                              <span className="font-text text-[12px] text-foreground font-semibold">{pod.rate}</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )}
            </TabsContent>

            <TabsContent value="knowledge" className="mt-0">
              <section className="py-2 border-t border-border">
                <div className="flex flex-col md:flex-row gap-8 mt-4">
                  {/* File List / Upload Area */}
                  <div className="md:w-[280px] shrink-0 space-y-6">
                    <div>
                      <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Engagement Context</h3>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg group">
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText size={16} className="text-primary/70 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-text text-xs font-bold text-foreground truncate">{file.name}</p>
                                <p className="font-text text-[9px] text-muted-foreground/70">{file.size} · {file.date}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center group hover:border-primary/30 transition-all cursor-pointer">
                      <Upload size={24} className="text-muted-foreground/40 mb-2 group-hover:text-primary/60" />
                      <p className="font-text text-[11px] font-bold text-foreground">Upload context</p>
                      <p className="font-text text-[9px] text-muted-foreground/70 mt-1 uppercase tracking-wider">PDF, CSV, JSON</p>
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className="flex-1 flex flex-col bg-muted/30 rounded-2xl border border-border overflow-hidden h-[500px]">
                    <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" />
                        <span className="font-mono text-[10px] uppercase tracking-widest font-black text-foreground">Ask the Documents</span>
                      </div>
                      <span className="font-mono text-[8px] text-muted-foreground uppercase">Claude 3.5 Active</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatHistory.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-8">
                          <BrainCircuit size={32} className="text-muted-foreground/20 mb-4" />
                          <p className="font-text text-sm text-muted-foreground font-medium">Ask Claude anything about this engagement&apos;s files.</p>
                          <p className="font-text text-[11px] text-muted-foreground/60 mt-2 max-w-[240px]">&quot;What are the main blockers mentioned in the technical reqs?&quot;</p>
                        </div>
                      ) : (
                        chatHistory.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl font-text text-[13px] leading-relaxed ${
                              msg.role === 'user' 
                                ? 'bg-foreground text-background' 
                                : 'bg-background border border-border text-foreground shadow-sm'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                      {isAsking && (
                        <div className="flex justify-start">
                          <div className="bg-background border border-border p-4 rounded-2xl flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-75" />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-150" />
                          </div>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleAsk} className="p-3 bg-background border-t border-border">
                      <div className="relative">
                        <input 
                          type="text"
                          value={chatQuery}
                          onChange={e => setChatQuery(e.target.value)}
                          placeholder="Ask a question..."
                          className="w-full pl-4 pr-12 py-3 bg-muted/50 border border-border rounded-xl font-text text-[13px] focus:outline-none focus:border-primary/30 transition-all"
                        />
                        <button 
                          type="submit"
                          disabled={isAsking || !chatQuery}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-foreground text-background rounded-lg hover:bg-primary transition-all disabled:opacity-20"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="payments" className="mt-0">
              {(() => {
                const jobInvoices = invoices.filter(i => i.jobSlug === job.slug)
                const paid = jobInvoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.amountRaw, 0)
                const due = jobInvoices.filter(i => i.status === 'Due').reduce((a, i) => a + i.amountRaw, 0)
                const invoiceStatusStyles: Record<string, string> = {
                  Paid:       'bg-green-50 text-green-700 border-green-200',
                  Due:        'bg-amber-50 text-amber-700 border-amber-200',
                  Processing: 'bg-primary/10 text-primary border-primary/20',
                }
                return (
                  <section className="border-t border-border">
                    <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6 mt-4">Payment schedule</h2>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-foreground text-background rounded-2xl p-5">
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-2">Total invoiced</p>
                        <p className="font-display font-black text-[28px] tracking-[-0.03em] leading-none">
                          ${jobInvoices.reduce((a, i) => a + i.amountRaw, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="border border-border rounded-2xl p-5 bg-background">
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-2">Paid</p>
                        <p className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-none">${paid.toLocaleString()}</p>
                      </div>
                      <div className={`border rounded-2xl p-5 bg-background ${due > 0 ? 'border-amber-200' : 'border-border'}`}>
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-2">Outstanding</p>
                        <p className={`font-display font-black text-[28px] tracking-[-0.03em] leading-none ${due > 0 ? 'text-amber-600' : 'text-foreground'}`}>${due.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="border border-border overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Status</th>
                            <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Milestone</th>
                            <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 text-right">Amount</th>
                            <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {jobInvoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${invoiceStatusStyles[inv.status]}`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-text text-sm font-semibold text-foreground">{inv.label}</p>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-mono text-[11px] font-bold text-foreground">{inv.amount}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-text text-xs text-muted-foreground">{inv.date}</span>
                              </td>
                            </tr>
                          ))}
                          {jobInvoices.length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-10 text-center font-text text-sm text-muted-foreground/70">No invoices yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-text text-[11px] text-muted-foreground/50 mt-3">Payments are processed by Comcorpe and held in escrow until milestone sign-off.</p>
                  </section>
                )
              })()}
            </TabsContent>

            <TabsContent value="contract" className="mt-0">
              <section className="border-t border-border">
                <div className="flex items-center justify-between py-4 mb-2">
                  <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Engagement Letter</h3>
                  <button className="font-mono text-[9px] uppercase tracking-eyebrow text-primary hover:underline flex items-center gap-1.5">
                    <Download size={12} /> Export PDF
                  </button>
                </div>

                <div className="h-[calc(100vh-220px)] min-h-[480px] overflow-y-auto rounded-sm border border-border bg-muted/20 p-3 md:p-4 [scrollbar-gutter:stable]">
                  <div className="bg-[#fcfcfc] border border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-sm mx-auto max-w-[800px] p-10 md:p-14 relative overflow-hidden text-slate-900">
                    {/* Compact Letterhead */}
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
                      <div>
                        <p className="font-display font-black text-xl tracking-tighter">COMCORPE</p>
                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-400 leading-none">London · Lagos · Nairobi</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] text-slate-400 uppercase tracking-wider leading-none mb-1">
                          <span className="text-primary font-bold">Jan 12, 2025</span>
                        </p>
                        <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                          REF: <span className="text-primary">{job.slug.toUpperCase()}</span>/LOE-042
                        </p>
                      </div>
                    </div>

                    {/* Body with Full Terms */}
                    <div className="font-text text-[13px] leading-relaxed space-y-6 text-slate-800">
                      <p>Dear Partners,</p>
                      <p>This Letter of Engagement confirms the terms upon which Comcorpe Ltd (&quot;the Partner&quot;) will provide strategic services to <strong className="text-primary">{job.clientId.replace(/-/g, ' ').toUpperCase()}</strong> (&quot;the Client&quot;) for the project <em className="text-primary font-bold">&quot;{job.title}&quot;</em>.</p>
                      
                      <div className="space-y-6">
                        {contractTerms.map((term) => (
                          <section key={term.id}>
                            <h3 className="font-display font-bold uppercase text-[10px] tracking-widest text-slate-900 mb-1.5">
                              {term.id}. {term.title}
                            </h3>
                            <p className="text-slate-600 leading-[1.6]">
                              {term.content.split(/(Commercial Structure|Brief|Milestones|estimated at|Job Title)/g).map((part, i) => {
                                if (part === 'estimated at') return <span key={i} className="text-primary font-bold">estimated at {job.rate}</span>
                                return part
                              })}
                            </p>
                          </section>
                        ))}
                      </div>

                      <p className="pt-4">We look forward to a successful collaboration and are committed to delivering exceptional value through this strategic engagement.</p>
                    </div>

                    {/* Compact Signature Section */}
                    <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-2 gap-12">
                      <div className="space-y-3">
                        <div className="h-10 flex items-end">
                          <span className="font-display italic text-xl text-primary/40 pb-1 border-b border-slate-200 block w-full underline decoration-primary/20">Jide Pinheiro</span>
                        </div>
                        <div>
                          <p className="font-display font-bold text-[11px] text-primary uppercase tracking-tight">Jide Pinheiro</p>
                          <p className="font-mono text-[8px] text-slate-400 uppercase tracking-widest leading-none">Partner, Comcorpe</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-right">
                        <div className="h-10 flex items-end justify-end">
                          <span className="font-display italic text-xl text-primary/40 pb-1 border-b border-slate-200 block w-full underline decoration-primary/20">/s/ Authorized Signatory</span>
                        </div>
                        <div>
                          <p className="font-display font-bold text-[11px] text-primary uppercase tracking-tight">{job.clientId.split('-')[0].toUpperCase()} REPRESENTATIVE</p>
                          <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest leading-none">Client Signatory</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>
          </div>

          <aside className="space-y-6">
            <div className="p-6 bg-foreground text-background rounded-lg shadow-sm">
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Commercial structure</p>
                  <p className="font-display font-black text-lg">{job.rate}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Expected duration</p>
                  <p className="font-display font-black text-lg">{job.time}</p>
                </div>
                {job.startDate && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Engagement dates</p>
                    <p className="font-display font-black text-lg tracking-tight">{job.startDate} — {job.endDate || 'Present'}</p>
                  </div>
                )}
                {job.lead && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Strategic pod lead</p>
                    <p className="font-display font-black text-lg">{job.lead}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Comcorpe partner</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-black text-[11px] text-primary-foreground">
                  JP
                </div>
                <div>
                  <p className="font-text text-[13px] font-bold text-foreground leading-tight">Jide Pinheiro</p>
                  <p className="font-text text-[11px] text-muted-foreground/70 mt-0.5">Strategic Director</p>
                </div>
              </div>
              <button className="w-full mt-6 py-2 bg-foreground text-background rounded-sm font-text text-[11px] font-semibold hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-wider">
                Direct message
              </button>
            </div>
          </aside>
        </div>
      </Tabs>
    </div>
  )
}
