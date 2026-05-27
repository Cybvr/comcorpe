'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getJobs, createJob, deleteJob, closeJob, getSystemUsers } from '@/lib/admin/store'
import type { User } from '@/lib/user'
import type { Job, JobStatus, JobType } from '@/lib/jobs'
import { invoices as seedInvoices, type Invoice, type InvoiceStatus } from '@/lib/invoices'
import { payouts as seedPayouts, type Payout, type PayoutStatus } from '@/lib/payouts'
import Modal from '@/components/admin/Modal'

const JOB_STATUSES: JobStatus[] = ['Scoping', 'Pod review', 'Active', 'Paused', 'Completed', 'Cancelled']
const JOB_TYPES: JobType[] = ['RETAINED', 'PROJECT', 'EQUITY']

const STATUS_COLOR: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Scoping: 'bg-primary/10 text-primary',
  Completed: 'bg-border text-muted-foreground',
  Paused: 'bg-yellow-100 text-yellow-700',
  'Pod review': 'bg-accent/10 text-accent',
  Cancelled: 'bg-red-100 text-red-600',
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
  const [clients, setClients] = useState<User[]>([])

  useEffect(() => {
    getSystemUsers().then(all => setClients(all.filter(u => u.role === 'client' || u.role === 'admin')))
  }, [])

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
  const L = 'font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground'
  const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'
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
          <select className={S} value={form.clientId} onChange={e => set('clientId', e.target.value)} required>
            <option value="">Select a client…</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}{c.company ? ` — ${c.company}` : ''}
              </option>
            ))}
          </select>
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

      <div className={F}>
        <label className={L}>Surgery Phase (1–6)</label>
        <select
          className={S}
          value={form.surgeryPhase ?? ''}
          onChange={e => set('surgeryPhase', e.target.value ? Number(e.target.value) as Job['surgeryPhase'] : undefined)}
        >
          <option value="">Not set</option>
          <option value="1">1 — Diagnosis</option>
          <option value="2">2 — Tests</option>
          <option value="3">3 — Treatment Plan</option>
          <option value="4">4 — Surgery</option>
          <option value="5">5 — Recovery</option>
          <option value="6">6 — You Win</option>
        </select>
      </div>

      {/* NDA & Approval */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
        <div className={F}>
          <label className={L}>NDA Status</label>
          <select
            className={S}
            value={form.ndaStatus ?? 'pending'}
            onChange={e => set('ndaStatus', e.target.value as Job['ndaStatus'])}
          >
            <option value="pending">Pending</option>
            <option value="signed">Signed</option>
            <option value="not-required">Not required</option>
          </select>
        </div>
        <div className={F}>
          <label className={L}>Approval Status</label>
          <select
            className={S}
            value={form.approvalStatus ?? 'not-required'}
            onChange={e => set('approvalStatus', e.target.value as Job['approvalStatus'])}
          >
            <option value="not-required">Not required</option>
            <option value="pending-approval">Pending approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {form.ndaStatus === 'signed' && (
        <div className={F}>
          <label className={L}>NDA Signed date (ISO)</label>
          <input
            className={I}
            type="date"
            value={form.ndaSignedAt ? form.ndaSignedAt.substring(0, 10) : ''}
            onChange={e => set('ndaSignedAt', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
          />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-3 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100">
          Save
        </button>
        <button type="button" onClick={onCancel} className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors duration-100">
          Cancel
        </button>
      </div>
    </form>
  )
}

const INVOICE_STATUSES: InvoiceStatus[] = ['Due', 'Processing', 'Paid']
const PAYOUT_STATUSES: PayoutStatus[] = ['Pending', 'Processing', 'Cleared']

const INVOICE_STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid:       'bg-green-100 text-green-700',
  Due:        'bg-amber-100 text-amber-700',
  Processing: 'bg-primary/10 text-primary',
}
const PAYOUT_STATUS_STYLES: Record<PayoutStatus, string> = {
  Cleared:    'bg-green-100 text-green-700',
  Pending:    'bg-amber-100 text-amber-700',
  Processing: 'bg-primary/10 text-primary',
}

function PaymentsPanel({ job, invoices, payouts, onUpdateInvoice, onUpdatePayout }: {
  job: Job
  invoices: Invoice[]
  payouts: Payout[]
  onUpdateInvoice: (id: number, status: InvoiceStatus) => void
  onUpdatePayout: (id: number, status: PayoutStatus) => void
}) {
  const jobInvoices = invoices.filter(i => i.jobSlug === job.slug)
  const jobPayouts = payouts.filter(p => p.jobSlug === job.slug)
  const totalInvoiced = jobInvoices.reduce((a, i) => a + i.amountRaw, 0)
  const totalPaidOut = jobPayouts.filter(p => p.status === 'Cleared').reduce((a, p) => a + p.amountRaw, 0)

  const F = 'flex flex-col gap-1.5'
  const L = 'font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground'
  const S = 'px-2 py-1 border border-input bg-white font-text text-xs text-foreground focus:outline-none focus:border-foreground transition-colors duration-100 appearance-none'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-foreground text-background rounded">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow opacity-40 mb-1">Client invoiced</p>
          <p className="font-display font-black text-2xl">${totalInvoiced.toLocaleString()}</p>
        </div>
        <div className="p-4 border border-border rounded">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Talent paid out</p>
          <p className="font-display font-black text-2xl text-foreground">${totalPaidOut.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <p className={L + ' mb-2'}>Client invoices → Comcorpe</p>
        {jobInvoices.length === 0 ? (
          <p className="font-text text-xs text-muted-foreground/60 py-3">No invoices for this job.</p>
        ) : (
          <div className="border border-border divide-y divide-border">
            {jobInvoices.map(inv => (
              <div key={inv.id} className="px-3 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-text text-xs font-semibold text-foreground truncate">{inv.label}</p>
                  <p className="font-mono text-[10px] text-muted-foreground/70">{inv.amount} · {inv.date}</p>
                </div>
                <select
                  value={inv.status}
                  onChange={e => onUpdateInvoice(inv.id, e.target.value as InvoiceStatus)}
                  className={`${S} ${INVOICE_STATUS_STYLES[inv.status]} border-0 font-mono text-[10px] uppercase tracking-eyebrow font-bold`}
                >
                  {INVOICE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className={L + ' mb-2'}>Comcorpe → Talent payouts</p>
        {jobPayouts.length === 0 ? (
          <p className="font-text text-xs text-muted-foreground/60 py-3">No payouts for this job.</p>
        ) : (
          <div className="border border-border divide-y divide-border">
            {jobPayouts.map(p => (
              <div key={p.id} className="px-3 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-text text-xs font-semibold text-foreground truncate">{p.label}</p>
                  <p className="font-mono text-[10px] text-muted-foreground/70">{p.amount} · {p.date}</p>
                </div>
                <select
                  value={p.status}
                  onChange={e => onUpdatePayout(p.id, e.target.value as PayoutStatus)}
                  className={`${S} ${PAYOUT_STATUS_STYLES[p.status]} border-0 font-mono text-[10px] uppercase tracking-eyebrow font-bold`}
                >
                  {PAYOUT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type ModalState = 'create' | { payments: Job } | null

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [modal, setModal] = useState<ModalState>(null)
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null)
  const [closeTarget, setCloseTarget] = useState<Job | null>(null)
  const [closing, setClosing] = useState(false)
  const [filter, setFilter] = useState<JobStatus | 'All'>('All')
  const [search, setSearch] = useState('')
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(seedInvoices)
  const [localPayouts, setLocalPayouts] = useState<Payout[]>(seedPayouts)

  async function reload() { setJobs(await getJobs()) }
  useEffect(() => {
    reload()
  }, [])

  const filtered = jobs
    .filter(j => filter === 'All' || j.status === filter)
    .filter(j =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.clientId.toLowerCase().includes(search.toLowerCase())
    )

  async function handleSave(data: Partial<Job>) {
    if (modal === 'create') {
      await createJob(data as Omit<Job, 'id'>)
    }
    setModal(null)
    await reload()
  }

  function handleUpdateInvoice(id: number, status: InvoiceStatus) {
    setLocalInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  function handleUpdatePayout(id: number, status: PayoutStatus) {
    setLocalPayouts(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  async function confirmDelete() {
    if (deleteTarget) {
      await deleteJob(deleteTarget.id)
      setDeleteTarget(null)
      await reload()
    }
  }

  async function confirmClose() {
    if (!closeTarget) return
    setClosing(true)
    await closeJob(closeTarget.id)
    setClosing(false)
    setCloseTarget(null)
    await reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] tracking-hero text-foreground">Jobs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{jobs.length} total</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="px-5 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100"
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
          className="px-4 py-2.5 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100 w-full max-w-xs"
        />
        <div className="flex items-center gap-1">
          {(['All', ...JOB_STATUSES] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 font-mono text-[11px] tracking-eyebrow uppercase transition-colors duration-100 ${
                filter === s ? 'bg-foreground text-background' : 'border border-input text-muted-foreground hover:text-foreground hover:border-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-border divide-y divide-border">
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-sm text-muted-foreground/70 text-center">No jobs found.</p>
        )}
        {filtered.map(job => (
          <div key={job.id} className="px-5 py-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-text text-sm font-semibold text-foreground">{job.title}</p>
                <span className={`font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 ${STATUS_COLOR[job.status] ?? 'bg-border text-muted-foreground'}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <p className="font-mono text-[11px] text-muted-foreground/70">
                  {job.clientId} · {job.type} · {job.rate}
                </p>
                {job.ndaStatus && job.ndaStatus !== 'not-required' && (
                  <span className={`font-mono text-[9px] tracking-eyebrow uppercase px-1.5 py-0.5 rounded ${
                    job.ndaStatus === 'signed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    NDA {job.ndaStatus}
                  </span>
                )}
                {job.approvalStatus && job.approvalStatus !== 'not-required' && (
                  <span className={`font-mono text-[9px] tracking-eyebrow uppercase px-1.5 py-0.5 rounded ${
                    job.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                    job.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {job.approvalStatus === 'pending-approval' ? 'Pending approval' : job.approvalStatus}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 mt-0.5">
              <button
                onClick={() => setModal({ payments: job })}
                className="px-3 py-1.5 border border-input font-text text-xs text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-100"
              >
                Payments
              </button>
              <Link
                href={`/admin/jobs/${job.slug}`}
                className="px-3 py-1.5 border border-input font-text text-xs text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-100"
              >
                Edit
              </Link>
              {(job.status === 'Active' || job.status === 'Paused') && (
                <button
                  onClick={() => setCloseTarget(job)}
                  className="px-3 py-1.5 border border-amber-200 font-text text-xs text-amber-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-colors duration-100"
                >
                  Close
                </button>
              )}
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

      {modal !== null && modal !== 'create' && 'payments' in modal && (
        <Modal title={`Payments — ${modal.payments.title}`} onClose={() => setModal(null)}>
          <PaymentsPanel
            job={modal.payments}
            invoices={localInvoices}
            payouts={localPayouts}
            onUpdateInvoice={handleUpdateInvoice}
            onUpdatePayout={handleUpdatePayout}
          />
        </Modal>
      )}

      {modal === 'create' && (
        <Modal
          title="New job"
          onClose={() => setModal(null)}
        >
          <JobForm
            initial={{}}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete job" onClose={() => setDeleteTarget(null)}>
          <p className="font-text text-sm text-muted-foreground mb-6">
            Delete <strong className="text-foreground">{deleteTarget.title}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-text text-sm font-semibold hover:bg-red-700 transition-colors duration-100">
              Delete
            </button>
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors duration-100">
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {closeTarget && (
        <Modal title="Close project" onClose={() => setCloseTarget(null)}>
          <p className="font-text text-sm text-muted-foreground mb-2">
            Mark <strong className="text-foreground">{closeTarget.title}</strong> as Completed and revoke pod member access?
          </p>
          <p className="font-text text-xs text-muted-foreground/70 mb-6">
            This removes the project from all assigned specialists&apos; dashboards. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={confirmClose} disabled={closing} className="flex-1 py-3 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-50">
              {closing ? 'Closing…' : 'Close project'}
            </button>
            <button onClick={() => setCloseTarget(null)} className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors duration-100">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
