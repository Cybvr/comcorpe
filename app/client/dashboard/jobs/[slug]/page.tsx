'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Briefcase, Clock, MapPin, Target, LayoutDashboard, Users2 } from 'lucide-react'
import { pods, getPodBySlug, getPodMembers } from '@/lib/pods'
import { getTalentProfile } from '@/lib/user'
import { jobs, getJobBySlug, getJobProgress } from '@/lib/jobs'
import { getInvoice } from '@/lib/invoices'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Check } from 'lucide-react'

const statusStyles: Record<string, string> = {
  'Active': 'bg-green-50 text-green-700 border-green-100',
  'Completed': 'bg-blue-50 text-blue-700 border-blue-100',
  'Paused': 'bg-orange-50 text-orange-700 border-orange-100',
  'Scoping': 'bg-ink-10 text-ink-60 border-ink-10',
  'Pod review': 'bg-violet/10 text-violet border-violet/20',
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

  // Local state for milestones
  const [localMilestones, setLocalMilestones] = useState(job.milestones || [])
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '', amount: '' })

  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.date) return

    const id = `m_custom_${Date.now()}`
    const ms: any = {
      id,
      title: newMilestone.title,
      date: newMilestone.date,
      status: 'pending',
      amount: newMilestone.amount || '—'
    }

    setLocalMilestones([...localMilestones, ms])
    setNewMilestone({ title: '', date: '', amount: '' })
    setIsAddingMilestone(false)
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1040px] mx-auto">
      <Link href="/client/dashboard/jobs" className="font-text text-sm text-ink-60 hover:text-blue transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to briefs
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 rounded-sm border ${statusStyles[job.status as keyof typeof statusStyles]}`}>
              {job.status}
            </span>
          </div>
          <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-ink leading-tight">{job.title}</h1>
          <div className="flex items-center gap-4 mt-3 font-text text-[13px] text-ink-60">
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
          </div>
        )}
      </div>

      <Tabs defaultValue="brief" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="brief" className="flex items-center gap-2">
            <Target size={14} /> Brief
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <LayoutDashboard size={14} /> Milestones
          </TabsTrigger>
          <TabsTrigger value="pod" className="flex items-center gap-2">
            <Users2 size={14} /> Pod
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="space-y-8">
            <TabsContent value="brief" className="mt-0">
              <section className="py-2 border-t border-ink-10">
                <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-6 mt-4">Brief summary</h2>
                <p className="font-text text-[16px] leading-relaxed text-ink-60 mb-8 max-w-[70ch]">
                  {job.summary}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-ink-10/50 pt-6">
                  <div>
                    <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-ink-40 mb-3">Engagement scope</h3>
                    <ul className="space-y-2">
                      {job.scope.map((item) => (
                        <li key={item} className="flex items-start gap-2 font-text text-[13px] text-ink-60">
                          <div className="w-1 h-1 bg-blue rounded-full mt-1.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-ink-40 mb-3">Success requirements</h3>
                    <ul className="space-y-2">
                      {job.requirements.map((item) => (
                        <li key={item} className="flex items-start gap-2 font-text text-sm text-ink-60">
                          <div className="w-1 h-1 bg-ink-20 rounded-full mt-1.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="milestones" className="mt-0 space-y-8">
              <section className="border-t border-ink-10">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Milestones</h2>
                    <button 
                      onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                      className="p-1 hover:bg-ink-5 rounded-sm text-blue transition-colors flex items-center gap-1 font-mono text-[9px] uppercase tracking-tight"
                    >
                      {isAddingMilestone ? <X size={12} /> : <Plus size={12} />}
                      {isAddingMilestone ? 'Cancel' : 'Add milestone'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                    <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink-40">{getJobProgress({...job, milestones: localMilestones})}% Velocity</span>
                  </div>
                </div>
                
                <div className="border border-ink-10 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-ink-10 bg-ink-5/50">
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-ink-40 font-semibold w-[120px]">Milestone Status</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-ink-40 font-semibold w-[100px]">Payment</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-ink-40 font-semibold">Milestone</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-ink-40 font-semibold w-[100px]">Due</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-ink-40 font-semibold text-right w-[100px]">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-10">
                      {isAddingMilestone && (
                        <tr className="bg-blue/5">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider bg-ink-10 text-ink-40 border-ink-20">
                              PENDING
                            </span>
                          </td>
                          <td className="px-4 py-3">
                             <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider bg-ink-5 text-ink-40 border-ink-10">
                               UNSET
                             </span>
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text"
                              placeholder="Milestone title..."
                              autoFocus
                              className="w-full bg-transparent border-none focus:ring-0 font-text text-sm font-bold text-ink placeholder:text-ink-20 p-0"
                              value={newMilestone.title}
                              onChange={e => setNewMilestone({...newMilestone, title: e.target.value})}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text"
                              placeholder="e.g. Jun 30"
                              className="w-full bg-transparent border-none focus:ring-0 font-text text-[10px] text-ink-40 uppercase tracking-tight placeholder:text-ink-20 p-0"
                              value={newMilestone.date}
                              onChange={e => setNewMilestone({...newMilestone, date: e.target.value})}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <input 
                                type="text"
                                placeholder="$0"
                                className="w-16 bg-transparent border-none focus:ring-0 font-mono text-[11px] font-bold text-ink placeholder:text-ink-20 p-0 text-right"
                                value={newMilestone.amount}
                                onChange={e => setNewMilestone({...newMilestone, amount: e.target.value})}
                              />
                              <button 
                                onClick={handleAddMilestone}
                                disabled={!newMilestone.title || !newMilestone.date}
                                className="p-1 bg-ink text-paper rounded-sm hover:bg-blue disabled:opacity-30 transition-all"
                              >
                                <Check size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                      {localMilestones.map((ms) => {
                        const inv = getInvoice(job.slug, ms.id)
                        return (
                          <tr key={ms.id} className="group hover:bg-ink-5/30 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${
                                ms.status === 'completed'  ? 'bg-blue-50 text-blue border-blue-200' :
                                ms.status === 'in-progress' ? 'bg-violet/5 text-violet border-violet/20' :
                                'bg-ink-10 text-ink-40 border-ink-20'
                              }`}>
                                {ms.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {inv && (
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${
                                  inv.status === 'Paid'       ? 'bg-green-50 text-green-700 border-green-200' :
                                  inv.status === 'Processing' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  'bg-ink-5 text-ink-40 border-ink-10'
                                }`}>
                                  {inv.status}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-text text-sm font-bold text-ink group-hover:text-blue transition-colors">
                                {ms.title}
                              </p>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p className="font-text text-[10px] text-ink-40 uppercase tracking-tight">{ms.date}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-mono text-[11px] font-bold text-ink">
                                {inv?.amount ?? (ms.id.startsWith('m_custom_') ? (ms as any).amount : '—')}
                              </span>
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
                <section className="border-t border-ink-10">
                  <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-4 mt-4">Pulse updates</h3>
                  <ul className="space-y-3">
                    {job.updates.map((update, i) => (
                      <li key={i} className="flex items-start gap-3 font-text text-sm text-ink-60 leading-relaxed">
                        <div className="w-1 h-1 bg-blue/30 rounded-full mt-2 shrink-0" />
                        {update}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </TabsContent>

            <TabsContent value="pod" className="mt-0">
              {assignedPod ? (
                <section className="border-t border-ink-10">
                  <div className="flex items-center justify-between py-4">
                    <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Assigned pod</h3>
                    <Link href={`/client/dashboard/search/${assignedPod.slug}`} className="font-mono text-[9px] uppercase tracking-eyebrow text-blue hover:underline">
                      View profile
                    </Link>
                  </div>
                  
                  <p className="font-display font-black text-[22px] tracking-[-0.02em] text-ink mb-2">{assignedPod.name}</p>
                  <p className="font-text text-sm text-ink-60 mb-8 leading-relaxed max-w-[65ch]">{assignedPod.focus}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-10 border border-ink-10 overflow-hidden">
                    {assignedPodMembers.map(member => (
                      <Link key={member.id} href={`/client/dashboard/search/talent/${member.id}`} className="flex items-center gap-3 p-4 bg-paper hover:bg-ink-5 transition-all group">
                        <div className={`w-10 h-10 rounded-sm shrink-0 flex items-center justify-center font-display font-black text-[11px] text-paper overflow-hidden relative ${member.color || 'bg-ink'}`}>
                          {member.image ? (
                            <Image src={member.image} alt={member.name} fill className="object-cover" />
                          ) : member.initials}
                        </div>
                        <div>
                          <p className="font-text text-sm font-bold text-ink group-hover:text-blue transition-colors leading-tight">{member.name}</p>
                          <p className="font-text text-[11px] text-ink-40 leading-tight mt-0.5">{member.role}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="border-t border-ink-10">
                  <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-4 mt-4">Recommended pods</h2>
                  <div className="grid grid-cols-1 gap-px bg-ink-10 border border-ink-10 overflow-hidden">
                    {primaryPods.map((pod) => {
                      const lead = getTalentProfile(pod.leadId)
                      return (
                        <Link key={pod.id} href={`/client/dashboard/search/${pod.slug}`} className="p-4 bg-paper flex items-center gap-4 hover:bg-ink-5 transition-all group">
                          <div className="w-10 h-10 rounded-sm bg-ink flex items-center justify-center font-display font-black text-[11px] text-paper shrink-0 border border-ink-10 overflow-hidden relative">
                            {lead.image ? (
                              <Image src={lead.image} alt={lead.name} fill className="object-cover" />
                            ) : (
                              lead.initials
                            )}
                          </div>
                          <div>
                            <h3 className="font-display font-black text-[15px] text-ink group-hover:text-blue transition-colors leading-tight">{pod.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="font-text text-[12px] text-ink-60">{pod.focus}</span>
                              <span className="w-1 h-1 bg-ink-10 rounded-full" />
                              <span className="font-text text-[12px] text-blue font-semibold">{pod.fitScore}%</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )}
            </TabsContent>
          </div>

          <aside className="space-y-6">
            <div className="p-6 bg-ink text-paper rounded-lg shadow-sm">
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

            <div className="pt-6 border-t border-ink-10">
              <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-4">Comcorpe partner</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue flex items-center justify-center font-display font-black text-[11px] text-paper">
                  JP
                </div>
                <div>
                  <p className="font-text text-[13px] font-bold text-ink leading-tight">Jide Pinheiro</p>
                  <p className="font-text text-[11px] text-ink-40 mt-0.5">Strategic Director</p>
                </div>
              </div>
              <button className="w-full mt-6 py-2 bg-ink text-paper rounded-sm font-text text-[11px] font-semibold hover:bg-blue transition-all uppercase tracking-wider">
                Direct message
              </button>
            </div>
          </aside>
        </div>
      </Tabs>
    </div>
  )
}
