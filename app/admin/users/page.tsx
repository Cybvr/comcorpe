'use client'
import { useEffect, useState } from 'react'
import { getSystemUsers, createSystemUser, updateSystemUser, deleteSystemUser } from '@/lib/admin/store'
import type { User } from '@/lib/user'
import Modal from '@/components/admin/Modal'

const EMPTY: Partial<User> = {
  name: '',
  email: '',
  role: 'client',
  isOnboarded: true,
}

function UserForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<User>
  onSave: (data: Partial<User>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })

  function set(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  const F = 'flex flex-col gap-1.5'
  const L = 'font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground'
  const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'
  const S = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground focus:outline-none focus:border-foreground transition-colors duration-100'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={F}>
        <label className={L}>Full Name *</label>
        <input className={I} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Jide Pinheiro" />
      </div>

      <div className={F}>
        <label className={L}>Email Address *</label>
        <input className={I} type="email" value={form.email ?? ''} onChange={e => set('email', e.target.value)} required placeholder="jide.pinheiro@comcorpe.com" />
      </div>

      <div className={F}>
        <label className={L}>Firebase Auth UID (Optional for edits, required for manual creation)</label>
        <input className={I} value={form.id ?? ''} onChange={e => set('id', e.target.value)} disabled={!!initial.id} placeholder="eZ4qP92s..." />
      </div>

      <div className={F}>
        <label className={L}>System Access Role *</label>
        <select className={S} value={form.role} onChange={e => set('role', e.target.value)}>
          <option value="client">Client</option>
          <option value="talent">Talent (Operator)</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      <div className={F}>
        <label className={L}>Onboarding Status *</label>
        <select className={S} value={form.isOnboarded !== false ? 'completed' : 'incomplete'} onChange={e => set('isOnboarded', e.target.value === 'completed')}>
          <option value="completed">Completed / Onboarded</option>
          <option value="incomplete">Incomplete / Needs Onboarding</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-3 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100">
          Save User
        </button>
        <button type="button" onClick={onCancel} className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors duration-100">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState<User[]>([])
  const [modal, setModal] = useState<'create' | { user: User } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [search, setSearch] = useState('')

  async function reload() {
    const data = await getSystemUsers()
    setUsersList(data)
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleSave(data: Partial<User>) {
    if (modal === 'create') {
      await createSystemUser(data)
    } else if (typeof modal === 'object' && modal.user) {
      await updateSystemUser(modal.user.id, data)
    }
    setModal(null)
    reload()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    await deleteSystemUser(deleteTarget.id)
    setDeleteTarget(null)
    reload()
  }

  async function toggleRole(user: User) {
    const nextRoleMap: Record<string, 'client' | 'talent' | 'admin'> = {
      client: 'talent',
      talent: 'admin',
      admin: 'client',
    }
    const nextRole = nextRoleMap[user.role] ?? 'client'
    await updateSystemUser(user.id, { role: nextRole })
    reload()
  }

  const filtered = usersList.filter(u => {
    const q = search.toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      (u.email?.toLowerCase() ?? '').includes(q) ||
      u.id.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display font-black text-2xl tracking-hero text-foreground">
            System Users
          </h1>
          <p className="font-text text-sm text-muted-foreground mt-1">
            Manage authenticated team portal accounts and security roles.
          </p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="px-4 py-2.5 bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-text text-xs font-semibold tracking-wider uppercase transition-colors duration-[120ms] shrink-0"
        >
          Add User
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or Firebase UID…"
          className="flex-1 px-4 py-3 border border-input bg-card font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100"
        />
      </div>

      {/* Grid/Table */}
      <div className="border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-text">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 font-mono text-[10px] tracking-eyebrow uppercase text-muted-foreground">User</th>
                <th className="px-6 py-4 font-mono text-[10px] tracking-eyebrow uppercase text-muted-foreground">Role</th>
                <th className="px-6 py-4 font-mono text-[10px] tracking-eyebrow uppercase text-muted-foreground">Onboarding</th>
                <th className="px-6 py-4 font-mono text-[10px] tracking-eyebrow uppercase text-muted-foreground">Firebase UID</th>
                <th className="px-6 py-4 font-mono text-[10px] tracking-eyebrow uppercase text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{user.email || 'No email associated'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRole(user)}
                      title="Click to toggle role"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-150 border hover:scale-105 active:scale-95 ${
                        user.role === 'admin'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : user.role === 'talent'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.role === 'admin' ? 'bg-red-500' : user.role === 'talent' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      {user.role}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={async () => {
                        const currentStatus = user.isOnboarded !== false
                        await updateSystemUser(user.id, { isOnboarded: !currentStatus })
                        reload()
                      }}
                      title="Click to toggle onboarding status"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-150 border hover:scale-105 active:scale-95 ${
                        user.isOnboarded !== false
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.isOnboarded !== false ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                      {user.isOnboarded !== false ? 'Onboarded' : 'Not Onboarded'}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground/80">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setModal({ user })}
                        className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="font-mono text-[11px] tracking-eyebrow uppercase text-red-600/80 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {modal && (
        <Modal
          title={modal === 'create' ? 'Add System User' : 'Edit System User'}
          onClose={() => setModal(null)}
        >
          <UserForm
            initial={modal === 'create' ? {} : modal.user}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal title="Confirm Deletion" onClose={() => setDeleteTarget(null)}>
          <div className="space-y-4">
            <p className="font-text text-sm text-foreground">
              Are you sure you want to remove <strong>{deleteTarget.name}</strong> from the system?
              They will lose all administrative or member portal dashboard privileges.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 text-white font-text text-sm font-semibold hover:bg-red-700 transition-colors duration-100"
              >
                Delete User
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors duration-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
