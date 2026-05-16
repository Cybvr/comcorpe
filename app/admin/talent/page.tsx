'use client'
import { useEffect, useState } from 'react'
import { getTalent, createTalent, updateTalent, deleteTalent } from '@/lib/admin/store'
import type { User } from '@/lib/user'
import Modal from '@/components/admin/Modal'

const EMPTY: Omit<User, 'id' | 'role'> = {
  name: '',
  initials: '',
  talentRole: '',
  bg: '',
  desc: '',
  rate: '',
  featured: false,
  image: '',
}

function TalentForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<User>
  onSave: (data: Partial<User>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  const F = 'flex flex-col gap-1.5'
  const L = 'font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground'
  const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>Name *</label>
          <input className={I} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Tunde A." />
        </div>
        <div className={F}>
          <label className={L}>Initials *</label>
          <input className={I} value={form.initials} onChange={e => set('initials', e.target.value)} required placeholder="TA" maxLength={3} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>ID / Slug *</label>
          <input className={I} value={(form as User).id ?? ''} onChange={e => set('id', e.target.value)} required placeholder="tunde-a" />
        </div>
        <div className={F}>
          <label className={L}>Rate</label>
          <input className={I} value={form.rate ?? ''} onChange={e => set('rate', e.target.value)} placeholder="$120 - $180/hr" />
        </div>
      </div>

      <div className={F}>
        <label className={L}>Role / Title *</label>
        <input className={I} value={form.talentRole ?? ''} onChange={e => set('talentRole', e.target.value)} required placeholder="Commercial Strategy Lead" />
      </div>

      <div className={F}>
        <label className={L}>Background</label>
        <input className={I} value={form.bg ?? ''} onChange={e => set('bg', e.target.value)} placeholder="Formerly at McKinsey" />
      </div>

      <div className={F}>
        <label className={L}>Description</label>
        <textarea
          className={`${I} resize-none`}
          rows={3}
          value={form.desc ?? ''}
          onChange={e => set('desc', e.target.value)}
          placeholder="What they do…"
        />
      </div>

      <div className={F}>
        <label className={L}>Image path</label>
        <input className={I} value={form.image ?? ''} onChange={e => set('image', e.target.value)} placeholder="/images/talent/Name.png" />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="featured"
          type="checkbox"
          checked={form.featured ?? false}
          onChange={e => set('featured', e.target.checked)}
          className="w-4 h-4 accent-foreground"
        />
        <label htmlFor="featured" className="font-text text-sm text-muted-foreground">Featured on public talent page</label>
      </div>

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

export default function AdminTalentPage() {
  const [talent, setTalent] = useState<User[]>([])
  const [modal, setModal] = useState<'create' | { user: User } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [search, setSearch] = useState('')

  function reload() {
    setTalent(getTalent())
  }

  useEffect(() => {
    const frame = requestAnimationFrame(reload)
    return () => cancelAnimationFrame(frame)
  }, [])

  const filtered = talent.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.talentRole ?? '').toLowerCase().includes(search.toLowerCase())
  )

  function handleSave(data: Partial<User>) {
    if (modal === 'create') {
      createTalent(data as Omit<User, 'role'>)
    } else if (modal && typeof modal === 'object') {
      updateTalent(modal.user.id, data)
    }
    setModal(null)
    reload()
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteTalent(deleteTarget.id)
      setDeleteTarget(null)
      reload()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] tracking-hero text-foreground">Talent</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{talent.length} operators</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="px-5 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100"
        >
          + Add operator
        </button>
      </div>

      <input
        type="search"
        placeholder="Search by name or role…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2.5 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100"
      />

      <div className="border border-border divide-y divide-border">
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-sm text-muted-foreground/70 text-center">No operators found.</p>
        )}
        {filtered.map(user => (
          <div key={user.id} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-9 h-9 shrink-0 bg-foreground text-background flex items-center justify-center font-mono text-[11px] font-semibold">
                {user.initials}
              </div>
              <div className="min-w-0">
                <p className="font-text text-sm font-semibold text-foreground">{user.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground/70 mt-0.5 truncate">{user.talentRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {user.featured && (
                <span className="font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 bg-primary/10 text-primary">
                  Featured
                </span>
              )}
              <span className="hidden sm:block font-mono text-[11px] text-muted-foreground/70">{user.rate}</span>
              <button
                onClick={() => setModal({ user })}
                className="px-3 py-1.5 border border-input font-text text-xs text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-100"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(user)}
                className="px-3 py-1.5 border border-red-200 font-text text-xs text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors duration-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit modal */}
      {modal !== null && (
        <Modal
          title={modal === 'create' ? 'Add operator' : `Edit ${(modal as { user: User }).user.name}`}
          onClose={() => setModal(null)}
        >
          <TalentForm
            initial={modal === 'create' ? {} : (modal as { user: User }).user}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal title="Delete operator" onClose={() => setDeleteTarget(null)}>
          <p className="font-text text-sm text-muted-foreground mb-6">
            Remove <strong className="text-foreground">{deleteTarget.name}</strong> from the platform? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmDelete}
              className="flex-1 py-3 bg-red-600 text-white font-text text-sm font-semibold hover:bg-red-700 transition-colors duration-100"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors duration-100"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
