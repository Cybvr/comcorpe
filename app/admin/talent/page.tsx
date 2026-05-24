'use client'
import { useEffect, useState } from 'react'
import { getTalent, createTalent, updateTalent, deleteTalent } from '@/lib/admin/store'
import { User, OMNICOM_AFFILIATES } from '@/lib/user'
import Modal from '@/components/admin/Modal'

const EMPTY = {
  firstName: '',
  surname: '',
  talentRole: '',
  industry: '',
  bg: '',
  desc: '',
  rateMin: '',
  rateMax: '',
  featured: false,
  image: '',
  networkAffiliations: [] as string[],
  ndaSigned: false,
}

type TalentFormState = typeof EMPTY

function splitName(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] ?? '',
    surname: parts.slice(1).join(' '),
  }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function initialsFor(firstName: string, surname: string) {
  return `${firstName[0] ?? ''}${surname[0] ?? ''}`.toUpperCase()
}

function splitRate(rate = '') {
  const amounts = rate.match(/\d+/g) ?? []
  return {
    rateMin: amounts[0] ?? '',
    rateMax: amounts[1] ?? '',
  }
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
  const [form, setForm] = useState<TalentFormState>(() => {
    const name = splitName(initial.name)
    const rate = splitRate(initial.rate)
    return {
      ...EMPTY,
      ...name,
      ...rate,
      talentRole: initial.talentRole ?? '',
      industry: initial.industry ?? '',
      bg: initial.bg ?? '',
      desc: initial.desc ?? '',
      featured: initial.featured ?? false,
      image: initial.image ?? '',
      networkAffiliations: initial.networkAffiliations ?? [],
      ndaSigned: initial.ndaSigned ?? false,
    }
  })

  function set(field: keyof TalentFormState, value: any) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const firstName = form.firstName.trim()
    const surname = form.surname.trim()
    const name = [firstName, surname].filter(Boolean).join(' ')
    const rateMin = form.rateMin.trim()
    const rateMax = form.rateMax.trim()
    const rate = rateMin && rateMax
      ? `$${rateMin} - $${rateMax}/hr`
      : rateMin || rateMax
        ? `$${rateMin || rateMax}/hr`
        : ''

    onSave({
      id: initial.id ?? slugify(name),
      name,
      initials: initialsFor(firstName, surname),
      talentRole: form.talentRole,
      industry: form.industry,
      bg: form.bg,
      desc: form.desc,
      rate,
      featured: form.featured,
      image: form.image,
      networkAffiliations: form.networkAffiliations,
      ndaSigned: form.ndaSigned,
    })
  }

  const F = 'flex flex-col gap-1.5'
  const L = 'font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground'
  const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={F}>
        <label className={L}>Profile picture</label>
        <div className="w-full border-2 border-dashed border-input rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors bg-background/50 cursor-pointer text-center relative">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                 set('image', URL.createObjectURL(e.target.files[0]))
              }
            }} 
          />
          {form.image ? (
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <img src={form.image} alt="Profile" className="w-12 h-12 rounded-full object-cover shadow-sm border border-border" />
              <p className="font-text text-xs text-foreground font-medium">Image selected</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-border/50 flex items-center justify-center text-muted-foreground/70 mb-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="font-text text-sm text-foreground">Click or drag image to upload</p>
              <p className="font-text text-[11px] text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>First name *</label>
          <input className={I} value={form.firstName} onChange={e => set('firstName', e.target.value)} required placeholder="Tunde" />
        </div>
        <div className={F}>
          <label className={L}>Surname *</label>
          <input className={I} value={form.surname} onChange={e => set('surname', e.target.value)} required placeholder="Adebayo" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>Min hourly rate</label>
          <input type="number" min="0" step="1" inputMode="numeric" className={I} value={form.rateMin} onChange={e => set('rateMin', e.target.value)} placeholder="120" />
        </div>
        <div className={F}>
          <label className={L}>Max hourly rate</label>
          <input type="number" min="0" step="1" inputMode="numeric" className={I} value={form.rateMax} onChange={e => set('rateMax', e.target.value)} placeholder="180" />
        </div>
      </div>

      <div className={F}>
        <label className={L}>Role / Title *</label>
        <input className={I} value={form.talentRole ?? ''} onChange={e => set('talentRole', e.target.value)} required placeholder="Commercial Strategy Lead" />
      </div>

      <div className={F}>
        <label className={L}>Industry</label>
        <input className={I} value={form.industry ?? ''} onChange={e => set('industry', e.target.value)} placeholder="Fintech" />
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
        <label className={L}>Omnicom Network Affiliate</label>
        <select
          className={I}
          value={form.networkAffiliations?.[0] ?? ''}
          onChange={e => set('networkAffiliations', e.target.value ? [e.target.value] : [])}
        >
          <option value="">None</option>
          {OMNICOM_AFFILIATES.map((agency) => (
            <option key={agency.slug} value={agency.label}>{agency.label}</option>
          ))}
        </select>
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

      <div className="flex items-center gap-3">
        <input
          id="ndaSigned"
          type="checkbox"
          checked={form.ndaSigned ?? false}
          onChange={e => set('ndaSigned', e.target.checked)}
          className="w-4 h-4 accent-foreground"
        />
        <label htmlFor="ndaSigned" className="font-text text-sm text-muted-foreground">NDA signed and on file</label>
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

  async function reload() {
    setTalent(await getTalent())
  }

  useEffect(() => {
    reload()
  }, [])

  const filtered = talent.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.talentRole ?? '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(data: Partial<User>) {
    if (modal === 'create') {
      await createTalent(data as Omit<User, 'role'>)
    } else if (modal && typeof modal === 'object') {
      await updateTalent(modal.user.id, data)
    }
    setModal(null)
    await reload()
  }

  async function confirmDelete() {
    if (deleteTarget) {
      await deleteTalent(deleteTarget.id)
      setDeleteTarget(null)
      await reload()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] tracking-hero text-foreground">Talent</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{talent.length} talent</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="px-5 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100"
        >
          + Add talent
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
          <p className="px-5 py-8 text-sm text-muted-foreground/70 text-center">No talent found.</p>
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
              {user.ndaSigned && (
                <span className="font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 bg-green-50 text-green-700 border border-green-200">
                  NDA signed
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
          title={modal === 'create' ? 'Add talent' : `Edit ${(modal as { user: User }).user.name}`}
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
        <Modal title="Delete talent" onClose={() => setDeleteTarget(null)}>
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
