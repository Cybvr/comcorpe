'use client'
import { useState } from 'react'
import { Briefcase, Building2, CreditCard, Mail, Pencil, X } from 'lucide-react'
import { currentUser } from '@/lib/user'
import { jobs } from '@/lib/jobs'
import { invoices } from '@/lib/invoices'

export default function ClientProfilePage() {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(currentUser.name)
  const [company, setCompany] = useState(currentUser.company ?? '')

  const clientJobs = jobs.filter(j => j.clientId === currentUser.clientId)
  const activeJobs = clientJobs.filter(j => j.status === 'Active')
  const clientInvoices = invoices.filter(i => i.clientId === currentUser.clientId)
  const totalSpend = clientInvoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amountRaw, 0)

  const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[860px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-1">Profile</p>
          <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">
            Account
          </h1>
        </div>
        <button
          onClick={() => setEditing(e => !e)}
          className="flex items-center gap-2 px-4 py-2 border border-input font-text text-sm text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-100"
        >
          {editing ? <X size={14} strokeWidth={1.5} /> : <Pencil size={14} strokeWidth={1.5} />}
          {editing ? 'Cancel' : 'Edit profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-foreground flex items-center justify-center font-display font-black text-[24px] text-background">
            {currentUser.initials}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 border border-input px-2 py-0.5">
            {currentUser.role}
          </span>
        </div>

        <div className="space-y-6">
          {editing ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Contact name</label>
                <input className={I} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Company</label>
                <input className={I} value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100"
              >
                Save changes
              </button>
              <p className="font-mono text-[10px] text-muted-foreground/70">Changes are saved locally in this browser.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground">{name}</h2>
              <p className="font-text text-sm text-muted-foreground">{company}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Building2, label: 'Client ID', value: currentUser.clientId ?? currentUser.id },
              { icon: Mail, label: 'Role', value: 'Client · Company account' },
              { icon: Briefcase, label: 'Active jobs', value: String(activeJobs.length) },
              { icon: CreditCard, label: 'Credits remaining', value: String(currentUser.credits ?? 0) },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 px-4 py-3 border border-border bg-background">
                <row.icon size={14} strokeWidth={1.5} className="text-muted-foreground/70 mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">{row.label}</p>
                  <p className="font-text text-sm text-foreground font-semibold mt-0.5">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 border border-border">
        {[
          { label: 'Total jobs', value: clientJobs.length },
          { label: 'Completed', value: clientJobs.filter(j => j.status === 'Completed').length },
          { label: 'Total spend (paid)', value: `$${(totalSpend / 1000).toFixed(0)}k` },
        ].map((stat, i) => (
          <div key={stat.label} className={`px-6 py-5 ${i > 0 ? 'border-l border-border' : ''}`}>
            <p className="font-display font-black text-[28px] text-foreground leading-none">{stat.value}</p>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="font-display font-black text-[18px] tracking-[-0.02em] text-foreground mb-4">Engagement history</h3>
        <div className="border border-border divide-y divide-border">
          {clientJobs.map(job => (
            <div key={job.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-text text-sm font-semibold text-foreground truncate">{job.title}</p>
                <p className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{job.type} · {job.rate}</p>
              </div>
              <span className={`shrink-0 font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 ${
                job.status === 'Active' ? 'bg-green-100 text-green-700'
                : job.status === 'Completed' ? 'bg-border text-muted-foreground'
                : 'bg-primary/10 text-primary'
              }`}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
