'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Plus, X } from 'lucide-react'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { useJobBySlug } from '@/lib/jobs'
import { updateJob, deleteJob, closeJob, getSystemUsers } from '@/lib/admin/store'
import { usePods } from '@/lib/pods'
import { useTreatmentPlan } from '@/lib/treatment-plan'
import { db } from '@/lib/firebase'
import { COMPLEXITY_MULTIPLIERS, calculateJobPay, formatCurrency, multiplierLabel, type ComplexityMultiplier } from '@/lib/pay'
import { submitReview, useReviewsForJob } from '@/lib/performance'
import { useUsers, type User } from '@/lib/user'
import type { JobType, Milestone, Job } from '@/lib/jobs'

const JOB_TYPES: JobType[] = ['RETAINED', 'PROJECT', 'EQUITY']
const JOB_STATUSES = ['Scoping', 'Pod review', 'Active', 'Paused', 'Completed', 'Cancelled'] as const
const MILESTONE_STATUSES = ['pending', 'in-progress', 'completed'] as const
type MilestoneStatus = (typeof MILESTONE_STATUSES)[number]

const L = 'font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70 block mb-2 font-black'
const I = 'w-full px-3 py-2.5 bg-background border border-border rounded-lg font-text text-sm text-foreground focus:outline-none focus:border-muted-foreground/50 transition-all'

export default function AdminJobEditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { job, loading } = useJobBySlug(slug)
  const { plan, loading: planLoading } = useTreatmentPlan(slug)
  const { pods, loading: podsLoading } = usePods()
  const { reviews: existingReviews } = useReviewsForJob(slug)
  const { users: allUsers } = useUsers()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const [closing, setClosing] = useState(false)
  const [clients, setClients] = useState<User[]>([])

  // Pay structure
  const [complexityMultiplier, setComplexityMultiplier] = useState<ComplexityMultiplier>(1)
  const [actionBounty, setActionBounty] = useState('')
  const [actionBountyCondition, setActionBountyCondition] = useState('')
  const [actionBountyStatus, setActionBountyStatus] = useState<Job['actionBountyStatus']>('pending')

  // Addendum
  const [addendumDeliverable, setAddendumDeliverable] = useState('')
  const [addendumDeadline, setAddendumDeadline] = useState('')
  const [addendumFee, setAddendumFee] = useState('')
  const [addendumStatus, setAddendumStatus] = useState<Job['addendumStatus']>(undefined)

  // Performance scoring
  const [scores, setScores] = useState<Record<string, { score: number; notes: string }>>({})
  const [scoringSubmitting, setScoringSubmitting] = useState(false)
  const [scoringDone, setScoringDone] = useState(false)

  const [form, setForm] = useState({
    title: '',
    summary: '',
    clientId: '',
    type: 'PROJECT' as JobType,
    status: 'Scoping' as (typeof JOB_STATUSES)[number],
    rate: '',
    time: '',
    location: '',
    scope: [''],
    requirements: [''],
    tags: '',
    podSlug: '',
    weeklyFocus: '',
  })
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [treatmentPlanContent, setTreatmentPlanContent] = useState('')

  useEffect(() => {
    getSystemUsers().then(all => setClients(all.filter(u => u.role === 'client' || u.role === 'admin')))
  }, [])

  useEffect(() => {
    if (!job) return
    setForm({
      title: job.title,
      summary: job.summary,
      clientId: job.clientId,
      type: job.type,
      status: job.status,
      rate: job.rate,
      time: job.time,
      location: job.location,
      scope: job.scope.length ? job.scope : [''],
      requirements: job.requirements.length ? job.requirements : [''],
      tags: job.tags.join(', '),
      podSlug: job.podSlug ?? '',
      weeklyFocus: job.weeklyFocus ?? '',
    })
    setMilestones(job.milestones ?? [])
    setComplexityMultiplier((job.complexityMultiplier ?? 1) as ComplexityMultiplier)
    setActionBounty(job.actionBounty ? String(job.actionBounty) : '')
    setActionBountyCondition(job.actionBountyCondition ?? '')
    setActionBountyStatus(job.actionBountyStatus ?? 'pending')
    setAddendumDeliverable(job.addendumDeliverable ?? '')
    setAddendumDeadline(job.addendumDeadline ?? '')
    setAddendumFee(job.addendumFee ?? '')
    setAddendumStatus(job.addendumStatus)
  }, [job])

  useEffect(() => {
    setTreatmentPlanContent(plan?.content ?? '')
  }, [plan])

  async function handleSave() {
    if (!job) return
    setSaving(true)
    await updateJob(job.id, {
      title: form.title,
      summary: form.summary,
      clientId: form.clientId,
      type: form.type,
      status: form.status,
      rate: form.rate,
      time: form.time,
      location: form.location,
      scope: form.scope.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      podSlug: form.podSlug || undefined,
      milestones,
      weeklyFocus: form.weeklyFocus || undefined,
      complexityMultiplier,
      actionBounty: actionBounty ? Number(actionBounty) : undefined,
      actionBountyCondition: actionBountyCondition || undefined,
      actionBountyStatus,
      addendumDeliverable: addendumDeliverable || undefined,
      addendumDeadline: addendumDeadline || undefined,
      addendumFee: addendumFee || undefined,
      addendumStatus: addendumStatus || undefined,
      updatedAt: `Updated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
    })

    const existingPlans = await getDocs(
      query(collection(db, 'treatmentPlans'), where('jobSlug', '==', slug))
    )
    const treatmentPlanId = existingPlans.empty ? `plan_${slug}` : existingPlans.docs[0].id
    await setDoc(doc(db, 'treatmentPlans', treatmentPlanId), {
      jobSlug: slug,
      content: treatmentPlanContent.trim(),
      createdAt: plan?.createdAt ?? new Date().toISOString(),
    }, { merge: true })

    setSaving(false)
    router.push('/admin/jobs')
  }

  async function handleDelete() {
    if (!job) return
    setDeleting(true)
    await deleteJob(job.id)
    setDeleting(false)
    router.push('/admin/jobs')
  }

  async function handleClose() {
    if (!job) return
    setClosing(true)
    await closeJob(job.id)
    setClosing(false)
    setConfirmClose(false)
    router.push('/admin/jobs')
  }

  async function handleSubmitScores() {
    if (!job) return
    const currentUser = allUsers.find(u => u.role === 'admin')
    setScoringSubmitting(true)
    await Promise.all(
      Object.entries(scores).map(([talentId, { score, notes }]) =>
        submitReview({
          jobSlug: job.slug,
          talentId,
          score,
          notes: notes || undefined,
          scoredBy: currentUser?.id ?? 'admin',
          scoredAt: new Date().toISOString(),
        })
      )
    )
    setScoringSubmitting(false)
    setScoringDone(true)
  }

  function setList(field: 'scope' | 'requirements', index: number, value: string) {
    const next = [...form[field]]
    next[index] = value
    setForm({ ...form, [field]: next })
  }

  function addItem(field: 'scope' | 'requirements') {
    setForm({ ...form, [field]: [...form[field], ''] })
  }

  function removeItem(field: 'scope' | 'requirements', index: number) {
    const next = form[field].filter((_, i) => i !== index)
    setForm({ ...form, [field]: next.length ? next : [''] })
  }

  function addMilestone() {
    setMilestones([...milestones, { id: `m_${Date.now()}`, title: '', date: '', status: 'pending', amount: '' }])
  }

  function updateMilestone(index: number, patch: Partial<Milestone>) {
    setMilestones(milestones.map((m, i) => i === index ? { ...m, ...patch } : m))
  }

  function removeMilestone(index: number) {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="font-text text-sm text-muted-foreground">Job not found.</p>
        <Link href="/admin/jobs" className="mt-4 inline-block text-primary text-sm font-semibold hover:underline">Back to jobs</Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[860px] mx-auto py-10 px-4 space-y-10">
      <div className="flex items-center justify-between">
        <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-muted-foreground/70 hover:text-foreground text-xs font-bold uppercase tracking-wider transition-colors">
          <ArrowLeft size={14} /> Jobs
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-foreground text-background rounded-lg font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
          >
            {saving ? 'Saving…' : <><Check size={13} /> Save</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className={L}>Title</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Job title" className={I} />
        </div>

        {/* Client */}
        <div>
          <label className={L}>Client</label>
          <select
            value={form.clientId}
            onChange={e => setForm({ ...form, clientId: e.target.value })}
            className={I}
          >
            <option value="">— select client —</option>
            {clients.map(c => (
              <option key={c.id} value={c.clientId ?? c.id}>
                {c.name} ({c.clientId ?? c.id})
              </option>
            ))}
            {/* allow keeping an unlisted clientId */}
            {form.clientId && !clients.find(c => (c.clientId ?? c.id) === form.clientId) && (
              <option value={form.clientId}>{form.clientId} (unlisted)</option>
            )}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className={L}>Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as typeof form.status })} className={I}>
            {JOB_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className={L}>Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as JobType })} className={I}>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Pod */}
        <div>
          <label className={L}>Pod</label>
          <select value={form.podSlug} onChange={e => setForm({ ...form, podSlug: e.target.value })} className={I} disabled={podsLoading}>
            <option value="">— no pod —</option>
            {pods.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </div>

        {/* Rate */}
        <div>
          <label className={L}>Budget / Rate</label>
          <input type="text" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="e.g. $45k – $90k" className={I} />
        </div>

        {/* Timeline */}
        <div>
          <label className={L}>Timeline</label>
          <input type="text" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g. 12 weeks" className={I} />
        </div>

        {/* Location */}
        <div>
          <label className={L}>Location</label>
          <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Lagos / Remote" className={I} />
        </div>

        {/* Tags */}
        <div>
          <label className={L}>Tags <span className="normal-case tracking-normal font-text font-normal">(comma-separated)</span></label>
          <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="e.g. FINTECH, GROWTH" className={I} />
        </div>

        {/* Summary */}
        <div className="md:col-span-2">
          <label className={L}>Summary</label>
          <textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} rows={3} placeholder="What are we solving for?" className={`${I} resize-none`} />
        </div>

        {/* Weekly focus */}
        <div className="md:col-span-2">
          <label className={L}>Weekly focus</label>
          <input type="text" value={form.weeklyFocus} onChange={e => setForm({ ...form, weeklyFocus: e.target.value })} placeholder="e.g. Retention sprint — reduce churn by 2%" className={I} />
        </div>
      </div>

      {/* Scope */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={L}>Scope of work</label>
          <button type="button" onClick={() => addItem('scope')} className="inline-flex items-center gap-1 text-primary font-text text-[11px] font-bold uppercase tracking-wider hover:underline">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.scope.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={item} onChange={e => setList('scope', i, e.target.value)} placeholder="Scope point" className={I} />
              {form.scope.length > 1 && (
                <button type="button" onClick={() => removeItem('scope', i)} className="shrink-0 p-1.5 text-muted-foreground/50 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={L}>Requirements</label>
          <button type="button" onClick={() => addItem('requirements')} className="inline-flex items-center gap-1 text-primary font-text text-[11px] font-bold uppercase tracking-wider hover:underline">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.requirements.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={item} onChange={e => setList('requirements', i, e.target.value)} placeholder="Requirement" className={I} />
              {form.requirements.length > 1 && (
                <button type="button" onClick={() => removeItem('requirements', i)} className="shrink-0 p-1.5 text-muted-foreground/50 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={L}>Milestones</label>
          <button type="button" onClick={addMilestone} className="inline-flex items-center gap-1 text-primary font-text text-[11px] font-bold uppercase tracking-wider hover:underline">
            <Plus size={12} /> Add
          </button>
        </div>
        {milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground/50 py-4">No milestones.</p>
        ) : (
          <div className="space-y-2">
            {milestones.map((m, i) => (
              <div key={m.id} className="grid grid-cols-[1fr_140px_110px_110px_110px_auto] gap-2 items-center">
                <input type="text" value={m.title} onChange={e => updateMilestone(i, { title: e.target.value })} placeholder="Title" className={I} />
                <input
                  type="date"
                  value={(() => {
                    if (!m.date) return ''
                    const d = new Date(m.date)
                    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
                  })()}
                  onChange={e => {
                    if (!e.target.value) return
                    const d = new Date(e.target.value)
                    const formatted = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    updateMilestone(i, { date: formatted })
                  }}
                  className={I}
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 font-mono text-sm pointer-events-none">$</span>
                  <input
                    type="number"
                    min="0"
                    value={m.amount ? m.amount.replace(/[^0-9.]/g, '') : ''}
                    onChange={e => updateMilestone(i, { amount: e.target.value ? `$${e.target.value}` : '' })}
                    placeholder="Client $"
                    className={`${I} pl-7`}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 font-mono text-[10px] pointer-events-none">fee</span>
                  <input
                    type="number"
                    min="0"
                    value={m.baseFee ?? ''}
                    onChange={e => updateMilestone(i, { baseFee: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Cost"
                    className={`${I} pl-10`}
                  />
                </div>
                <select
                  value={m.status}
                  onChange={e => updateMilestone(i, { status: e.target.value as MilestoneStatus })}
                  className={I}
                >
                  {MILESTONE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="button" onClick={() => removeMilestone(i)} className="p-1.5 text-muted-foreground/50 hover:text-red-500 transition-colors shrink-0">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pay structure */}
      <div className="border border-border rounded-lg p-5 space-y-5">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70 font-black">Pay Structure</h2>

        <div>
          <label className={L}>Complexity Multiplier</label>
          <div className="flex gap-2 flex-wrap">
            {COMPLEXITY_MULTIPLIERS.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setComplexityMultiplier(m)}
                className={`px-3 py-1.5 font-mono text-[11px] tracking-wider border transition-colors duration-100 ${
                  complexityMultiplier === m
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                }`}
              >
                {m === 1 ? '1× Standard' : `${m}×`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={L}>Action Bounty ($)</label>
            <input type="number" min="0" value={actionBounty} onChange={e => setActionBounty(e.target.value)} placeholder="e.g. 5000" className={I} />
          </div>
          <div>
            <label className={L}>Bounty Status</label>
            <select value={actionBountyStatus ?? 'pending'} onChange={e => setActionBountyStatus(e.target.value as Job['actionBountyStatus'])} className={I}>
              <option value="pending">Pending</option>
              <option value="achieved">Achieved</option>
              <option value="not-achieved">Not achieved</option>
            </select>
          </div>
        </div>

        <div>
          <label className={L}>Bounty Condition</label>
          <input type="text" value={actionBountyCondition} onChange={e => setActionBountyCondition(e.target.value)} placeholder="e.g. NPS lifts by 15 points" className={I} />
        </div>

        {milestones.some(m => m.baseFee) && (
          <div className="bg-muted/40 rounded p-4 space-y-1">
            {(() => {
              const breakdown = calculateJobPay(
                milestones,
                complexityMultiplier,
                actionBounty ? Number(actionBounty) : 0,
                actionBountyStatus === 'achieved'
              )
              return (
                <>
                  <div className="flex justify-between font-text text-sm"><span className="text-muted-foreground">Base cost</span><span>{formatCurrency(breakdown.base)}</span></div>
                  <div className="flex justify-between font-text text-sm"><span className="text-muted-foreground">{multiplierLabel(complexityMultiplier)}</span><span>{formatCurrency(breakdown.withMultiplier)}</span></div>
                  {breakdown.bounty > 0 && <div className="flex justify-between font-text text-sm"><span className="text-muted-foreground">Bounty (achieved)</span><span>{formatCurrency(breakdown.bounty)}</span></div>}
                  <div className="flex justify-between font-text text-sm font-semibold border-t border-border pt-1 mt-1"><span>Total cost to Comcorpe</span><span>{formatCurrency(breakdown.total)}</span></div>
                </>
              )
            })()}
          </div>
        )}
      </div>

      {/* Addendum */}
      <div className="border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70 font-black">Project Addendum</h2>
          {addendumStatus && (
            <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 ${addendumStatus === 'signed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {addendumStatus}
            </span>
          )}
        </div>
        <div>
          <label className={L}>Deliverable</label>
          <input type="text" value={addendumDeliverable} onChange={e => setAddendumDeliverable(e.target.value)} placeholder="One-line deliverable description" className={I} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={L}>Deadline</label>
            <input type="date" value={addendumDeadline} onChange={e => setAddendumDeadline(e.target.value)} className={I} />
          </div>
          <div>
            <label className={L}>Fee</label>
            <input type="text" value={addendumFee} onChange={e => setAddendumFee(e.target.value)} placeholder="e.g. $12,000" className={I} />
          </div>
        </div>
        {!addendumStatus && addendumDeliverable && (
          <button
            type="button"
            onClick={() => setAddendumStatus('pending')}
            className="font-text text-xs text-primary font-semibold hover:underline"
          >
            Send to specialist for signing →
          </button>
        )}
      </div>

      {/* Treatment plan */}
      <div>
        <label className={L}>Plan / Diagnosis</label>
        {planLoading ? (
          <div className="border border-border rounded-lg min-h-[200px] animate-pulse bg-muted/30" />
        ) : (
          <RichTextEditor
            key={treatmentPlanContent.slice(0, 40)}
            content={treatmentPlanContent}
            onChange={setTreatmentPlanContent}
            placeholder="Write the diagnosis here…"
          />
        )}
      </div>

      {/* Score Team — only when completed */}
      {job.status === 'Completed' && job.podMembers && job.podMembers.length > 0 && (
        <div className="border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70 font-black">Score Team</h2>
          {scoringDone ? (
            <p className="font-text text-sm text-green-700 bg-green-50 px-4 py-3 border border-green-200">Scores submitted.</p>
          ) : (
            <>
              {job.podMembers.map(userId => {
                const member = allUsers.find(u => u.id === userId)
                const alreadyScored = existingReviews.some(r => r.talentId === userId)
                const current = scores[userId] ?? { score: 0, notes: '' }
                return (
                  <div key={userId} className="space-y-2 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center font-mono text-[10px] text-muted-foreground font-bold shrink-0">
                        {(member?.initials ?? userId.slice(0, 2)).toUpperCase()}
                      </div>
                      <span className="font-text text-sm font-semibold text-foreground">{member?.name ?? userId}</span>
                      {alreadyScored && <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 bg-green-100 text-green-700">Scored</span>}
                    </div>
                    {!alreadyScored && (
                      <>
                        <div className="flex gap-1">
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setScores(prev => ({ ...prev, [userId]: { ...current, score: n } }))}
                              className={`w-8 h-8 font-mono text-[11px] border transition-colors duration-100 ${
                                current.score === n ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={current.notes}
                          onChange={e => setScores(prev => ({ ...prev, [userId]: { ...current, notes: e.target.value } }))}
                          placeholder="Optional notes…"
                          className={I}
                        />
                      </>
                    )}
                  </div>
                )
              })}
              {Object.values(scores).some(s => s.score > 0) && (
                <button
                  type="button"
                  onClick={handleSubmitScores}
                  disabled={scoringSubmitting}
                  className="w-full py-3 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
                >
                  {scoringSubmitting ? 'Submitting…' : 'Submit scores'}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Bottom save */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-4">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="font-text text-sm text-muted-foreground">Delete permanently?</span>
              <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded-lg font-text text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="px-4 py-2 border border-border rounded-lg font-text text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          ) : confirmClose ? (
            <div className="flex items-center gap-2">
              <span className="font-text text-sm text-muted-foreground">Close project and revoke access?</span>
              <button type="button" onClick={handleClose} disabled={closing} className="px-4 py-2 bg-amber-600 text-white rounded-lg font-text text-sm font-semibold hover:bg-amber-700 disabled:opacity-50">
                {closing ? 'Closing…' : 'Yes, close'}
              </button>
              <button type="button" onClick={() => setConfirmClose(false)} className="px-4 py-2 border border-border rounded-lg font-text text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {(form.status === 'Active' || form.status === 'Paused') && (
                <button type="button" onClick={() => setConfirmClose(true)} className="font-text text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                  Close project
                </button>
              )}
              <button type="button" onClick={() => setConfirmDelete(true)} className="font-text text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
                Delete job
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-lg font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
        >
          {saving ? 'Saving…' : <><Check size={13} /> Save changes</>}
        </button>
      </div>
    </div>
  )
}
