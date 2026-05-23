'use client'

import Image from 'next/image'
import { Building2, Mail } from 'lucide-react'
import { useCurrentUser } from '@/lib/user'

export default function ClientSettingsGeneralPage() {
  const { user: currentUser } = useCurrentUser()

  if (!currentUser) {
    return <p className="font-text text-sm text-muted-foreground">Loading profile...</p>
  }

  return (
    <div className="space-y-8">
      <section className="border border-border rounded-2xl p-6 bg-background">
        <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
          <div className="w-20 h-20 rounded-2xl bg-foreground overflow-hidden relative flex items-center justify-center">
            {currentUser.image ? (
              <Image src={currentUser.image} alt={currentUser.name} fill className="object-cover rounded-2xl" />
            ) : (
              <span className="font-display font-black text-[24px] text-background">{currentUser.initials}</span>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">General</p>
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
        </div>
      </section>
    </div>
  )
}
