'use client'
import { useEffect, useState } from 'react'
import { getPods, createPod, updatePod, deletePod } from '@/lib/admin/store'
import type { Pod, PodMemberRole } from '@/lib/pods'
import { POD_MEMBER_ROLES } from '@/lib/pods'
import Modal from '@/components/admin/Modal'
import { Plus, Pencil, Trash2, Users2 } from 'lucide-react'

const EMPTY: Omit<Pod, 'id'> = {
  slug: '',
  name: '',
  focus: '',
  summary: '',
  leadId: '',
  memberIds: [],
  memberRoles: [],
  markets: [],
  evidence: [],
  availability: '',
  rate: '',
}

const F = 'flex flex-col gap-1.5'
const L = 'font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground'
const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'
const TA = `${I} resize-none`

function PodForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<Pod>
  onSave: (data: Partial<Pod>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Omit<Pod, 'id'>>({ ...EMPTY, ...initial })
  const [memberStr, setMemberStr] = useState((initial.memberIds ?? []).join(', '))
  const [roleMap, setRoleMap] = useState<Record<string, string>>(
    Object.fromEntries((initial.memberRoles ?? []).map(r => [r.userId, r.role]))
  )
  const [marketsStr, setMarketsStr] = useState((initial.markets ?? []).join(', '))
  const [evidenceStr, setEvidenceStr] = useState((initial.evidence ?? []).join('\n'))

  function set<K extends keyof Pod>(field: K, value: Pod[K]) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-')
    const memberIds = memberStr.split(',').map(s => s.trim()).filter(Boolean)
    const memberRoles: PodMemberRole[] = memberIds
      .filter(id => roleMap[id])
      .map(id => ({ userId: id, role: roleMap[id] }))
    onSave({
      ...form,
      slug,
      memberIds,
      memberRoles,
      markets: marketsStr.split(',').map(s => s.trim()).filter(Boolean),
      evidence: evidenceStr.split('\n').map(s => s.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>Name *</label>
          <input required className={I} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Alpha Pod" />
        </div>
        <div className={F}>
          <label className={L}>Slug</label>
          <input className={I} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto-generated if blank" />
        </div>
      </div>

      <div className={F}>
        <label className={L}>Focus</label>
        <input className={I} value={form.focus} onChange={e => set('focus', e.target.value)} placeholder="e.g. Fintech growth strategy" />
      </div>

      <div className={F}>
        <label className={L}>Summary</label>
        <textarea className={TA} rows={3} value={form.summary} onChange={e => set('summary', e.target.value)} placeholder="Brief description of the pod..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>Lead ID</label>
          <input className={I} value={form.leadId} onChange={e => set('leadId', e.target.value)} placeholder="e.g. talent-001" />
        </div>
        <div className={F}>
          <label className={L}>Rate</label>
          <input className={I} value={form.rate} onChange={e => set('rate', e.target.value)} placeholder="e.g. $850/hr" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>Availability</label>
          <input className={I} value={form.availability} onChange={e => set('availability', e.target.value)} placeholder="e.g. Available Q3 2026" />
        </div>
        <div className={F}>
          <label className={L}>Fit score (0–100)</label>
          <input type="number" min={0} max={100} className={I} value={form.fitScore ?? ''} onChange={e => set('fitScore', e.target.value ? Number(e.target.value) : undefined)} placeholder="e.g. 92" />
        </div>
      </div>

      <div className={F}>
        <label className={L}>Member IDs <span className="normal-case tracking-normal font-text font-normal text-muted-foreground/50">(comma-separated)</span></label>
        <input className={I} value={memberStr} onChange={e => setMemberStr(e.target.value)} placeholder="e.g. talent-001, talent-002" />
      </div>

      {memberStr.split(',').map(s => s.trim()).filter(Boolean).length > 0 && (
        <div className={F}>
          <label className={L}>Pod role assignments</label>
          <div className="space-y-2">
            {memberStr.split(',').map(s => s.trim()).filter(Boolean).map(memberId => (
              <div key={memberId} className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted-foreground/70 w-40 truncate shrink-0">{memberId}</span>
                <select
                  className={`${I} flex-1`}
                  value={roleMap[memberId] ?? ''}
                  onChange={e => setRoleMap(prev => ({ ...prev, [memberId]: e.target.value }))}
                >
                  <option value="">No role assigned</option>
                  {POD_MEMBER_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={F}>
        <label className={L}>Markets <span className="normal-case tracking-normal font-text font-normal text-muted-foreground/50">(comma-separated)</span></label>
        <input className={I} value={marketsStr} onChange={e => setMarketsStr(e.target.value)} placeholder="e.g. Nigeria, UK, Kenya" />
      </div>

      <div className={F}>
        <label className={L}>Evidence <span className="normal-case tracking-normal font-text font-normal text-muted-foreground/50">(one per line)</span></label>
        <textarea className={TA} rows={3} value={evidenceStr} onChange={e => setEvidenceStr(e.target.value)} placeholder={"e.g. Led $50M Series B growth campaign\nBuilt loyalty system for top-10 neobank"} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 font-text text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2.5 bg-foreground text-background rounded-sm font-text text-sm font-semibold hover:bg-primary transition-colors">
          Save pod
        </button>
      </div>
    </form>
  )
}

type ModalState = 'create' | { pod: Pod } | { delete: Pod } | null

export default function AdminPodsPage() {
  const [pods, setPods] = useState<Pod[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState>(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const data = await getPods()
    setPods(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave(data: Partial<Pod>) {
    setSaving(true)
    if (modal === 'create') {
      await createPod(data as Omit<Pod, 'id'>)
    } else if (modal && typeof modal === 'object' && 'pod' in modal) {
      await updatePod(modal.pod.id, data)
    }
    setSaving(false)
    setModal(null)
    load()
  }

  async function handleDelete() {
    if (!modal || typeof modal !== 'object' || !('delete' in modal)) return
    setSaving(true)
    await deletePod(modal.delete.id)
    setSaving(false)
    setModal(null)
    load()
  }

  const filtered = pods.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.focus.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight text-foreground">Pods</h1>
          <p className="font-text text-sm text-muted-foreground mt-1">{pods.length} pod{pods.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-sm font-text text-sm font-semibold hover:bg-primary transition-colors"
        >
          <Plus size={15} /> New pod
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search pods..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2.5 border border-input bg-background font-text text-sm focus:outline-none focus:border-foreground transition-colors"
      />

      {/* Table */}
      {loading ? (
        <p className="font-mono text-sm text-muted-foreground animate-pulse py-8">Loading pods…</p>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-border">
          <Users2 size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-text text-sm text-muted-foreground">{search ? 'No pods match your search.' : 'No pods yet.'}</p>
          {!search && (
            <button onClick={() => setModal('create')} className="mt-3 text-primary font-text text-sm font-semibold hover:underline">
              Create the first pod
            </button>
          )}
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">Pod</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">Focus</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">Members</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">Rate</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">Availability</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(pod => (
                <tr key={pod.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-text text-sm font-semibold text-foreground">{pod.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground/50 mt-0.5">{pod.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-text text-sm text-muted-foreground max-w-[200px] truncate">{pod.focus}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-muted-foreground">{pod.memberIds.length}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-foreground font-semibold">{pod.rate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-text text-xs text-muted-foreground">{pod.availability}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal({ pod })}
                        className="w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setModal({ delete: pod })}
                        className="w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      {modal === 'create' && (
        <Modal title="New pod" onClose={() => setModal(null)}>
          <PodForm initial={EMPTY} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {/* Edit modal */}
      {modal && typeof modal === 'object' && 'pod' in modal && (
        <Modal title="Edit pod" onClose={() => setModal(null)}>
          <PodForm initial={modal.pod} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {/* Delete confirmation */}
      {modal && typeof modal === 'object' && 'delete' in modal && (
        <Modal title="Delete pod" onClose={() => setModal(null)}>
          <div className="space-y-5">
            <p className="font-text text-sm text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{modal.delete.name}</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 font-text text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={saving} className="px-6 py-2.5 bg-red-600 text-white rounded-sm font-text text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                {saving ? 'Deleting…' : 'Delete pod'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
