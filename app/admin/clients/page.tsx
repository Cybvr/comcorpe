'use client'
import { useEffect, useState } from 'react'
import { getClients, createClient, updateClient, deleteClient } from '@/lib/admin/store'
import type { User } from '@/lib/user'
import Modal from '@/components/admin/Modal'

function ClientForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<User>
  onSave: (data: Partial<User>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    id: initial.id ?? '',
    name: initial.name ?? '',
    initials: initial.initials ?? '',
    company: initial.company ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  const F = 'flex flex-col gap-1.5'
  const L = 'font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground'
  const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSave(form)
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>Company name *</label>
          <input className={I} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Volta Pay" />
        </div>
        <div className={F}>
          <label className={L}>Initials *</label>
          <input className={I} value={form.initials} onChange={e => set('initials', e.target.value)} required placeholder="VP" maxLength={3} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={F}>
          <label className={L}>ID / Slug *</label>
          <input className={I} value={form.id} onChange={e => set('id', e.target.value)} required placeholder="volta-pay" />
        </div>
        <div className={F}>
          <label className={L}>Display company</label>
          <input className={I} value={form.company} onChange={e => set('company', e.target.value)} placeholder="Volta Pay" />
        </div>
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

type ModalState = 'create' | { client: User } | null

export default function AdminClientsPage() {
  const [clients, setClients] = useState<User[]>([])
  const [modal, setModal] = useState<ModalState>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [search, setSearch] = useState('')

  async function reload() { setClients(await getClients()) }
  useEffect(() => {
    reload()
  }, [])

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(data: Partial<User>) {
    if (modal === 'create') {
      await createClient(data as Omit<User, 'role'>)
    } else if (modal && typeof modal === 'object') {
      await updateClient((modal as { client: User }).client.id, data)
    }
    setModal(null)
    await reload()
  }

  async function confirmDelete() {
    if (deleteTarget) {
      await deleteClient(deleteTarget.id)
      setDeleteTarget(null)
      await reload()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] tracking-hero text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{clients.length} companies</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="px-5 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100"
        >
          + Add client
        </button>
      </div>

      <input
        type="search"
        placeholder="Search clients…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2.5 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100"
      />

      <div className="border border-border divide-y divide-border">
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-sm text-muted-foreground/70 text-center">No clients found.</p>
        )}
        {filtered.map(client => (
          <div key={client.id} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-9 h-9 shrink-0 border border-input flex items-center justify-center font-mono text-[11px] font-semibold text-foreground">
                {client.initials}
              </div>
              <div className="min-w-0">
                <p className="font-text text-sm font-semibold text-foreground">{client.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground/70 mt-0.5">{client.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setModal({ client })}
                className="px-3 py-1.5 border border-input font-text text-xs text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-100"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(client)}
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
          title={modal === 'create' ? 'Add client' : `Edit ${(modal as { client: User }).client.name}`}
          onClose={() => setModal(null)}
        >
          <ClientForm
            initial={modal === 'create' ? {} : (modal as { client: User }).client}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete client" onClose={() => setDeleteTarget(null)}>
          <p className="font-text text-sm text-muted-foreground mb-6">
            Remove <strong className="text-foreground">{deleteTarget.name}</strong>? This cannot be undone.
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
    </div>
  )
}
