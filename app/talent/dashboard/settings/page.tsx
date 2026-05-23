'use client'

import { useCurrentUser } from '@/lib/user'
import { applications } from '@/lib/applications'

export default function TalentSettingsPage() {
  const { user: currentUser } = useCurrentUser()

  if (!currentUser) {
    return <p className="font-text text-sm text-muted-foreground">Loading...</p>
  }

  const submittedCount = applications.length
  const activeCount = applications.filter((a) => a.status.toLowerCase() === 'active').length

  return (
    <div className="space-y-6">
      <div className="border border-border rounded-2xl bg-background p-6">
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-4">Overview</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-display font-black text-[28px] text-foreground leading-none">{submittedCount}</p>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mt-2">Applications</p>
          </div>
          <div>
            <p className="font-display font-black text-[28px] text-foreground leading-none">{activeCount}</p>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mt-2">Active now</p>
          </div>
          <div>
            <p className="font-display font-black text-[28px] text-foreground leading-none">{currentUser.credits ?? 3}</p>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mt-2">CC Credits</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display font-black text-[18px] tracking-[-0.02em] text-foreground mb-4">Applications</h3>
        <div className="border border-border divide-y divide-border">
          {applications.map((application) => (
            <div key={application.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-text text-sm font-semibold text-foreground truncate">{application.role}</p>
                <p className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{application.client} · {application.date}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 bg-border text-muted-foreground">
                {application.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
