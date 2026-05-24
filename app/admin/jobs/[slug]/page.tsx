'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Plus, X } from 'lucide-react'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { useJobBySlug } from '@/lib/jobs'
import { updateJob, deleteJob, getSystemUsers } from '@/lib/admin/store'
import { usePods } from '@/lib/pods'
import { useTreatmentPlan } from '@/lib/treatment-plan'
import { db } from '@/lib/firebase'
import type { JobType, Milestone } from '@/lib/jobs'
import type { User } from '@/lib/user'

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
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [clients, setClients] = useState<User[]>([])

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
              <div key={m.id} className="grid grid-cols-[1fr_160px_130px_130px_auto] gap-2 items-center">
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
                    placeholder="0"
                    className={`${I} pl-7`}
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

      {/* Bottom save */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div>
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
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="font-text text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
              Delete job
            </button>
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
