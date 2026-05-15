'use client'
import { useEffect, useState } from 'react'
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/admin/store'
import type { Job, JobStatus, JobType } from '@/lib/jobs'
import Modal from '@/components/admin/Modal'

const JOB_STATUSES: JobStatus[] = ['Scoping', 'Pod review', 'Active', 'Paused', 'Completed']
const JOB_TYPES: JobType[] = ['RETAINED', 'PROJECT', 'EQUITY']

const STATUS_COLOR: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Scoping: 'bg-blue/10 text-blue',
  Completed: 'bg-ink-10 text-ink-60',
  Paused: 'bg-yellow-100 text-yellow-700',
  'Pod review': 'bg-violet/10 text-violet',
}

const EMPTY_JOB: Omit<Job, 'id'> = {
  slug: '',
  title: '',
  clientId: '',
  type: 'PROJECT',
  status: 'Scoping',
  summary: '',
  rate: '',
  location: '',
  time: '',
  tags: [],
  updatedAt: '',
  scope: [],
  requirements: [],
}

function JobForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<Job>
  onSave: (data: Partial<Job>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Omit<Job, 'id'>>({ ...EMPTY_JOB, ...initial })
  const [tagsStr, setTagsStr] = useState((initial.tags ?? []).join(', '))
  const [scopeStr, setScopeStr] = useState((initial.scope ?? []).join('\n'))
  const [reqStr, setReqStr] = useState((initial.requirements ?? []).join('\n'))

  function set<K extends keyof Job>(field: K, value: Job[K]) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      ...form,
      tags: tagsStr.split(',').map(s => s.trim()).filter(Boolean),
      scope: scopeStr.split('\n').map(s => s.trim()).filter(Boolean),
      requirements: reqStr.split('\n').map(s => s.trim()).filter(Boolean),
      updatedAt: `Updated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
    })
  }

  const F = 'flex flex-col gap-1.5'
  const L = 'font-mono text-[11px] tracking-eyebrow uppercase text-ink-60'
  const I = 'w-full px-4 py-3 border border-ink-20 bg-white font-text text-sm text-ink placeholder:text-ink-40 focus:outline-none focus:border-ink transition-colors duration-100'
  const S = `${I} appearance-none`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={F}>
        <label className={L}>Title *</label>
        <input className={I} value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Digital loyalty and rewards ecosystem" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>Slug *</label>
          <input className={I} value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="client-project-name" />
        </div>
        <div className={F}>
          <label className={L}>Client ID *</label>
          <input className={I} value={form.clientId} onChange={e => set('clientId', e.target.value)} required placeholder="volta-pay" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>Type</label>
          <select className={S} value={form.type} onChange={e => set('type', e.target.value as JobType)}>
            {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className={F}>
          <label className={L}>Status</label>
          <select className={S} value={form.status} onChange={e => set('status', e.target.value as JobStatus)}>
            {JOB_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>Rate / Budget</label>
          <input className={I} value={form.rate} onChange={e => set('rate', e.target.value)} placeholder="$45k - $90k" />
        </div>
        <div className={F}>
          <label className={L}>Location</label>
          <input className={I} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Lagos / Remote" />
        </div>
      </div>

      <div className={F}>
        <label className={L}>Timeline</label>
        <input className={I} value={form.time} onChange={e => set('time', e.target.value)} placeholder="12-week engagement" />
      </div>

      <div className={F}>
        <label className={L}>Summary</label>
        <textarea className={`${I} resize-none`} rows={3} value={form.summary} onChange={e => set('summary', e.target.value)} placeholder="Brief description…" />
      </div>

      <div className={F}>
        <label className={L}>Tags (comma-separated)</label>
        <input className={I} value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="FINTECH, GROWTH, ACTIVE" />
      </div>

      <div className={F}>
        <label className={L}>Scope (one per line)</label>
        <textarea className={`${I} resize-none`} rows={3} value={scopeStr} onChange={e => setScopeStr(e.target.value)} placeholder="Design behavior-based reward triggers…" />
      </div>

      <div className={F}>
        <label className={L}>Requirements (one per line)</label>
        <textarea className={`${I} resize-none`} rows={3} value={reqStr} onChange={e => setReqStr(e.target.value)} placeholder="Experience in loyalty/rewards design…" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-3 bg-ink text-paper font-text text-sm font-semibold hover:bg-blue transition-colors duration-100">
          Save
        </button>
        <button type="button" onClick={onCancel} className="flex-1 py-3 border border-ink-20 text-ink font-text text-sm hover:bg-ink-10 transition-colors duration-100">
          Cancel
        </button>
      </div>
    </form>
  )
}

type ModalState = 'create' | { job: Job } | null

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [modal, setModal] = useState<ModalState>(null)
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null)
  const [filter, setFilter] = useState<JobStatus | 'All'>('All')
  const [search, setSearch] = useState('')

  function reload() { setJobs(getJobs()) }
  useEffect(() => {
    const frame = requestAnimationFrame(reload)
    return () => cancelAnimationFrame(frame)
  }, [])

  const filtered = jobs
    .filter(j => filter === 'All' || j.status === filter)
    .filter(j =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.clientId.toLowerCase().includes(search.toLowerCase())
    )

  function handleSave(data: Partial<Job>) {
    if (modal === 'create') {
      createJob(data as Omit<Job, 'id'>)
    } else if (modal && typeof modal === 'object') {
      updateJob((modal as { job: Job }).job.id, data)
    }
    setModal(null)
    reload()
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteJob(deleteTarget.id)
      setDeleteTarget(null)
      reload()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] tracking-hero text-ink">Jobs</h1>
          <p className="text-sm text-ink-60 mt-0.5">{jobs.length} total</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="px-5 py-2.5 bg-ink text-paper font-text text-sm font-semibold hover:bg-blue transition-colors duration-100"
        >
          + New job
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search jobs…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2.5 border border-ink-20 bg-white font-text text-sm text-ink placeholder:text-ink-40 focus:outline-none focus:border-ink transition-colors duration-100 w-full max-w-xs"
        />
        <div className="flex items-center gap-1">
          {(['All', ...JOB_STATUSES] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 font-mono text-[11px] tracking-eyebrow uppercase transition-colors duration-100 ${
                filter === s ? 'bg-ink text-paper' : 'border border-ink-20 text-ink-60 hover:text-ink hover:border-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-ink-10 divide-y divide-ink-10">
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-sm text-ink-40 text-center">No jobs found.</p>
        )}
        {filtered.map(job => (
          <div key={job.id} className="px-5 py-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-text text-sm font-semibold text-ink">{job.title}</p>
                <span className={`font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 ${STATUS_COLOR[job.status] ?? 'bg-ink-10 text-ink-60'}`}>
                  {job.status}
                </span>
              </div>
              <p className="font-mono text-[11px] text-ink-40 mt-1">
                {job.clientId} · {job.type} · {job.rate}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 mt-0.5">
              <button
                onClick={() => setModal({ job })}
                className="px-3 py-1.5 border border-ink-20 font-text text-xs text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-100"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(job)}
                className="px-3 py-1.5 border border-red-200 font-text text-xs text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors duration-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <Modal
          title={modal === 'create' ? 'New job' : `Edit job`}
          onClose={() => setModal(null)}
        >
          <JobForm
            initial={modal === 'create' ? {} : (modal as { job: Job }).job}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete job" onClose={() => setDeleteTarget(null)}>
          <p className="font-text text-sm text-ink-60 mb-6">
            Delete <strong className="text-ink">{deleteTarget.title}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-text text-sm font-semibold hover:bg-red-700 transition-colors duration-100">
              Delete
            </button>
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-ink-20 text-ink font-text text-sm hover:bg-ink-10 transition-colors duration-100">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
