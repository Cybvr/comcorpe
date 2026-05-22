'use client'

import { useState } from 'react'
import { Building2, Mail, Pencil, X } from 'lucide-react'
import { useCurrentUser, updateUserProfile } from '@/lib/user'
import { useJobs } from '@/lib/jobs'
import { invoices } from '@/lib/invoices'

export default function ClientSettingsGeneralPage() {
  const { user: currentUser } = useCurrentUser()
  const { jobs } = useJobs()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!currentUser) return
    setSaving(true)
    try {
      const computedInitials = name
        .split(' ')
        .filter(Boolean)
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 3)

      await updateUserProfile(currentUser.id, {
        name,
        company,
        initials: computedInitials,
      })

      setEditing(false)
    } catch (err) {
      console.error('Error saving profile changes:', err)
    } finally {
      setSaving(false)
    }
  }

  if (!currentUser) {
    return <p className="font-text text-sm text-muted-foreground">Loading profile...</p>
  }

  const handleEditToggle = () => {
    if (editing) {
      setEditing(false)
      return
    }
    setName(currentUser.name)
    setCompany(currentUser.company ?? '')
    setEditing(true)
  }

  const clientJobs = jobs.filter(j => j.clientId === currentUser.clientId)
  const clientInvoices = invoices.filter(i => i.clientId === currentUser.clientId)
  const totalSpend = clientInvoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amountRaw, 0)

  const inputClass = 'w-full px-4 py-3 border border-input bg-background font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'

  return (
    <div className="space-y-8">
      <section className="border border-border rounded-2xl p-6 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
            <div className="w-20 h-20 rounded-2xl bg-foreground flex items-center justify-center font-display font-black text-[24px] text-background">
              {currentUser.initials}
            </div>

            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">General</p>
              {editing ? (
                <div className="space-y-4 max-w-xl">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Contact name</label>
                    <input className={inputClass} value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Company</label>
                    <input className={inputClass} value={company} onChange={e => setCompany(e.target.value)} />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-foreground text-background rounded-lg font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="font-display font-black text-[24px] tracking-[-0.02em] text-foreground leading-tight">{currentUser.name}</h2>
                  <div className="mt-3 flex flex-col gap-2">
                    <span className="flex items-center gap-2 font-text text-sm text-muted-foreground">
                      <Building2 size={14} strokeWidth={1.5} /> {currentUser.company || 'Company not set'}
                    </span>
                    <span className="flex items-center gap-2 font-text text-sm text-primary">
                      <Mail size={14} strokeWidth={1.5} /> {currentUser.email}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleEditToggle}
            className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-lg font-text text-sm text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-100"
          >
            {editing ? <X size={14} strokeWidth={1.5} /> : <Pencil size={14} strokeWidth={1.5} />}
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 border border-border rounded-2xl overflow-hidden bg-background">
        {[
          { label: 'Total jobs', value: clientJobs.length },
          { label: 'Completed', value: clientJobs.filter(j => j.status === 'Completed').length },
          { label: 'Total spend paid', value: `$${(totalSpend / 1000).toFixed(0)}k` },
        ].map((stat, index) => (
          <div key={stat.label} className={`px-6 py-5 ${index > 0 ? 'sm:border-l border-border border-t sm:border-t-0' : ''}`}>
            <p className="font-display font-black text-[28px] text-foreground leading-none">{stat.value}</p>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <section>
        <h3 className="font-display font-black text-[18px] tracking-[-0.02em] text-foreground mb-4">Engagement history</h3>
        <div className="border border-border rounded-2xl divide-y divide-border overflow-hidden bg-background">
          {clientJobs.map(job => (
            <div key={job.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-text text-sm font-semibold text-foreground truncate">{job.title}</p>
                <p className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{job.type} Â· {job.rate}</p>
              </div>
              <span className={`shrink-0 font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 rounded-full ${job.status === 'Active' ? 'bg-green-100 text-green-700'
                  : job.status === 'Completed' ? 'bg-border text-muted-foreground'
                    : 'bg-primary/10 text-primary'
                }`}>
                {job.status}
              </span>
            </div>
          ))}
          {clientJobs.length === 0 && (
            <div className="px-5 py-10 text-center font-text text-sm text-muted-foreground/70">
              No engagement history yet.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
