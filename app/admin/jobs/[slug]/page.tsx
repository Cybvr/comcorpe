'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Plus, X } from 'lucide-react'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { useJobBySlug } from '@/lib/jobs'
import { updateJob, deleteJob } from '@/lib/admin/store'
import { usePods } from '@/lib/pods'
import { useTreatmentPlan } from '@/lib/treatment-plan'
import { db } from '@/lib/firebase'
import type { JobType, Milestone } from '@/lib/jobs'

const JOB_TYPES: JobType[] = ['RETAINED', 'PROJECT', 'EQUITY']
const JOB_STATUSES = ['Scoping', 'Pod review', 'Active', 'Paused', 'Completed', 'Cancelled'] as const
const MILESTONE_STATUSES = ['pending', 'in-progress', 'completed'] as const
type MilestoneStatus = (typeof MILESTONE_STATUSES)[number]

const STEPS = ['Overview', 'Scope', 'Milestones', 'Plan', 'Pod'] as const
type Step = 0 | 1 | 2 | 3 | 4

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
  const [step, setStep] = useState<Step>(0)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [form, setForm] = useState({
    title: '',
    summary: '',
    type: 'PROJECT' as JobType,
    status: 'Scoping' as (typeof JOB_STATUSES)[number],
    rate: '',
    time: '',
    location: '',
    scope: [''],
    requirements: [''],
    tags: '',
    podSlug: '',
  })
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [treatmentPlanContent, setTreatmentPlanContent] = useState('')

  useEffect(() => {
    if (!job) return

    setForm({
      title: job.title,
      summary: job.summary,
      type: job.type,
      status: job.status,
      rate: job.rate,
      time: job.time,
      location: job.location,
      scope: job.scope.length ? job.scope : [''],
      requirements: job.requirements.length ? job.requirements : [''],
      tags: job.tags.join(', '),
      podSlug: job.podSlug ?? '',
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
      type: form.type,
      status: form.status,
      rate: form.rate,
      time: form.time,
      location: form.location,
      scope: form.scope.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      podSlug: form.podSlug || undefined,
      milestones,
      updatedAt: `Updated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
    })

    const existingPlans = await getDocs(
      query(collection(db, 'treatmentPlans'), where('jobSlug', '==', slug))
    )

    const treatmentPlanId = existingPlans.empty
      ? `plan_${slug}`
      : existingPlans.docs[0].id

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
    setMilestones([
      ...milestones,
      { id: `m_${Date.now()}`, title: '', date: '', status: 'pending', amount: '' },
    ])
  }

  function updateMilestone(index: number, patch: Partial<Milestone>) {
    setMilestones(milestones.map((milestone, i) => (i === index ? { ...milestone, ...patch } : milestone)))
  }

  function removeMilestone(index: number) {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const L = 'font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70 block mb-3 font-black'
  const I = 'w-full p-4 bg-background border border-border rounded-2xl font-text text-sm text-foreground focus:outline-none focus:border-muted-foreground/50 transition-all'

  if (loading) {
    return (
      <div className="px-4 py-16 text-center max-w-[800px] mx-auto">
        <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="px-4 py-16 text-center max-w-[800px] mx-auto">
        <p className="font-text text-sm text-muted-foreground">Job not found.</p>
        <Link href="/admin/jobs" className="mt-4 inline-block text-primary text-sm font-semibold hover:underline">
          Back to jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[760px] mx-auto py-12 px-4">
      <Link
        href="/admin/jobs"
        className="inline-flex items-center gap-2 text-muted-foreground/70 hover:text-foreground text-xs font-bold uppercase tracking-wider mb-10 transition-colors"
      >
        <ArrowLeft size={14} /> Back to jobs
      </Link>

      <div className="flex items-center gap-0 mb-12">
        {STEPS.map((label, i) => {
          const done = i < step
          const active = i === step
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => setStep(i as Step)}
                className="flex items-center gap-2.5 group"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-black transition-all ${
                  done ? 'bg-primary text-primary-foreground' :
                  active ? 'bg-foreground text-background' :
                  'bg-muted text-muted-foreground/50 group-hover:bg-border'
                }`}>
                  {done ? <Check size={12} strokeWidth={3} /> : i + 1}
                </div>
                <span className={`font-display font-black text-[13px] tracking-[-0.01em] transition-colors ${
                  active ? 'text-foreground' : 'text-muted-foreground/50 group-hover:text-muted-foreground'
                }`}>
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-4 transition-colors ${i < step ? 'bg-primary/40' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="min-h-[520px]">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className={L}>Project title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Digital Wallet Growth Sprint"
                className="w-full p-5 bg-background border border-border rounded-2xl font-display font-black text-xl text-foreground focus:outline-none focus:border-muted-foreground/50 transition-all"
              />
            </div>

            <div>
              <label className={L}>Summary</label>
              <textarea
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="What are we solving for?"
                rows={4}
                className={`${I} resize-none`}
              />
            </div>

            <div>
              <label className={L}>Engagement type</label>
              <div className="flex gap-3">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, type })}
                    className={`px-5 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest font-black border transition-all ${
                      form.type === type
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background text-muted-foreground border-border hover:border-input'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={L}>Status</label>
              <div className="flex gap-3 flex-wrap">
                {JOB_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm({ ...form, status })}
                    className={`px-5 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest font-black border transition-all ${
                      form.status === status
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background text-muted-foreground border-border hover:border-input'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={L}>Budget</label>
                <input type="text" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} placeholder="e.g. $45k - $90k" className={I} />
              </div>
              <div>
                <label className={L}>Timeline</label>
                <input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="e.g. 12-week engagement" className={I} />
              </div>
              <div>
                <label className={L}>Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Lagos / Remote" className={I} />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={L}>Scope of work</label>
                <button type="button" onClick={() => addItem('scope')} className="flex items-center gap-1 text-primary font-text text-[11px] font-bold uppercase tracking-wider hover:underline">
                  <Plus size={12} /> Add point
                </button>
              </div>
              <div className="space-y-3">
                {form.scope.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={item} onChange={(e) => setList('scope', i, e.target.value)} placeholder="e.g. Design behavior-based reward triggers" className={I} />
                    {form.scope.length > 1 && (
                      <button type="button" onClick={() => removeItem('scope', i)} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={L}>Requirements</label>
                <button type="button" onClick={() => addItem('requirements')} className="flex items-center gap-1 text-primary font-text text-[11px] font-bold uppercase tracking-wider hover:underline">
                  <Plus size={12} /> Add point
                </button>
              </div>
              <div className="space-y-3">
                {form.requirements.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={item} onChange={(e) => setList('requirements', i, e.target.value)} placeholder="e.g. Fintech loyalty experience" className={I} />
                    {form.requirements.length > 1 && (
                      <button type="button" onClick={() => removeItem('requirements', i)} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={L}>Tags <span className="normal-case tracking-normal font-text font-normal text-muted-foreground/50">(comma-separated)</span></label>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. FINTECH, GROWTH, NIGERIA" className={I} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-text text-sm text-muted-foreground">Track key deliverables, dates, and amounts.</p>
              <button type="button" onClick={addMilestone} className="flex items-center gap-1 text-primary font-text text-[11px] font-bold uppercase tracking-wider hover:underline">
                <Plus size={12} /> Add milestone
              </button>
            </div>

            {milestones.length === 0 ? (
              <div className="py-16 border-2 border-dashed border-border rounded-2xl text-center">
                <p className="font-text text-sm text-muted-foreground/50 mb-3">No milestones yet.</p>
                <button type="button" onClick={addMilestone} className="text-primary font-text text-sm font-semibold hover:underline">Add the first one</button>
              </div>
            ) : (
              <div className="space-y-3">
                {milestones.map((milestone, i) => (
                  <div key={milestone.id} className="p-4 bg-background border border-border rounded-2xl space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(i, { title: e.target.value })}
                        placeholder="Milestone title"
                        className="flex-1 p-3 bg-muted border border-border rounded-xl font-text text-sm font-semibold text-foreground focus:outline-none focus:border-muted-foreground/50 transition-all"
                      />
                      <button type="button" onClick={() => removeMilestone(i)} className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={milestone.date}
                        onChange={(e) => updateMilestone(i, { date: e.target.value })}
                        placeholder="e.g. 15 Jun 2026"
                        className="p-3 bg-muted border border-border rounded-xl font-text text-sm text-foreground focus:outline-none focus:border-muted-foreground/50 transition-all"
                      />
                      <input
                        type="text"
                        value={milestone.amount ?? ''}
                        onChange={(e) => updateMilestone(i, { amount: e.target.value })}
                        placeholder="e.g. $15,000"
                        className="p-3 bg-muted border border-border rounded-xl font-mono text-sm text-foreground focus:outline-none focus:border-muted-foreground/50 transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      {MILESTONE_STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateMilestone(i, { status: status as MilestoneStatus })}
                          className={`flex-1 py-2 rounded-xl font-mono text-[9px] uppercase tracking-widest font-black border transition-all ${
                            milestone.status === status
                              ? status === 'completed' ? 'bg-primary/10 text-primary border-primary/30'
                                : status === 'in-progress' ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-foreground text-background border-foreground'
                              : 'bg-background text-muted-foreground/50 border-border hover:border-input'
                          }`}
                        >
                          {status === 'in-progress' ? 'Active' : status === 'completed' ? 'Done' : 'Pending'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className={L}>Plan</label>
                <p className="font-text text-sm text-muted-foreground">
                  Diagnosis shown in the client dashboard.
                </p>
              </div>
              {planLoading && (
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                  Loading...
                </p>
              )}
            </div>
            {planLoading ? (
              <div className="border border-border rounded-2xl min-h-[320px] animate-pulse bg-muted/30" />
            ) : (
              <RichTextEditor
                key={treatmentPlanContent.slice(0, 40)}
                content={treatmentPlanContent}
                onChange={setTreatmentPlanContent}
                placeholder="Write the diagnosis here…"
              />
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <p className="font-text text-sm text-muted-foreground mb-4">Assign a pod to this engagement.</p>

            {podsLoading ? (
              <p className="font-text text-sm text-muted-foreground/50 animate-pulse">Loading pods…</p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, podSlug: '' })}
                  className={`w-full text-left px-4 py-3 border rounded-xl font-text text-sm transition-colors ${
                    form.podSlug === ''
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-border text-muted-foreground hover:border-input'
                  }`}
                >
                  No pod assigned
                </button>
                {pods.map((pod) => (
                  <button
                    key={pod.slug}
                    type="button"
                    onClick={() => setForm({ ...form, podSlug: pod.slug })}
                    className={`w-full text-left px-4 py-4 border rounded-xl transition-colors ${
                      form.podSlug === pod.slug ? 'border-primary bg-primary/5' : 'border-border hover:border-input'
                    }`}
                  >
                    <p className={`font-text text-sm font-semibold ${form.podSlug === pod.slug ? 'text-primary' : 'text-foreground'}`}>{pod.name}</p>
                    <p className="font-text text-[11px] text-muted-foreground/70 mt-0.5">{pod.focus} · {pod.availability} · {pod.rate}</p>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
        <button
          type="button"
          onClick={() => step === 0 ? router.push('/admin/jobs') : setStep((step - 1) as Step)}
          className="flex items-center gap-2 px-5 py-3 font-text text-sm font-bold text-muted-foreground/70 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> {step === 0 ? 'Back' : 'Back'}
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((step + 1) as Step)}
            disabled={step === 0 && !form.title.trim()}
            className="flex items-center gap-2 px-8 py-3.5 bg-foreground text-background rounded-full font-text text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-40"
          >
            Next <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-foreground text-background rounded-full font-text text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
          >
            {saving ? 'Saving…' : <><Check size={14} /> Save changes</>}
          </button>
        )}
      </div>

      <div className="mt-8 border-t border-red-100 pt-6">
        {confirmDelete ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-text text-sm text-muted-foreground">Delete this job permanently?</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 bg-red-600 text-white rounded-full font-text text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-5 py-2.5 border border-border rounded-full font-text text-sm font-semibold hover:bg-muted transition-colors"
              >
                Keep it
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="font-text text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            Delete job
          </button>
        )}
      </div>
    </div>
  )
}
