'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowUpRight, CheckCircle2, DollarSign, Globe2, Layers3, MapPin, ShieldCheck, Star } from 'lucide-react'
import { useUser } from '@/lib/user'
import BackButton from '@/components/dashboard/BackButton'

export default function ClientDashboardTalentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user: profile, loading } = useUser(id)

  if (loading) {
    return (
      <div className="px-4 py-16 text-center max-w-[1040px] mx-auto">
        <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading operator details from Firestore...</p>
      </div>
    )
  }

  if (!profile) {
    notFound()
  }

  const talentTitle = profile.talentRole ?? profile.role

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-4xl mx-auto">
      <BackButton />

      <article className="mt-6 border border-border rounded-xl p-6 bg-background shadow-sm">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl ${profile.color || 'bg-foreground'} flex items-center justify-center font-display font-black text-[20px] text-background shrink-0 border border-border overflow-hidden relative`}>
              {profile.image ? (
                  <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                ) : (
                  profile.initials
                )}
              </div>
            <div>
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">{profile.name}</h1>
              <p className="font-text text-[17px] text-muted-foreground">{talentTitle}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/5 border border-primary/10 rounded-full cursor-help" title="Comcorpe Verified">
              <ShieldCheck size={16} className="text-primary" />
            </div>
            {(profile.networkAffiliations ?? []).length > 0 && (
              <div className="flex items-center justify-center w-8 h-8 bg-green-50 border border-green-200 rounded-full cursor-help" title="Network affiliate">
                <ShieldCheck size={16} className="text-green-600" strokeWidth={2} />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="border border-border rounded-xl p-4">
              <MapPin size={16} strokeWidth={1.5} className="text-primary mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Background</p>
              <div className="font-text text-sm font-medium text-foreground leading-tight">{profile.bg}</div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <Layers3 size={16} strokeWidth={1.5} className="text-primary mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Availability</p>
              <div className="font-text text-sm font-medium text-foreground leading-tight">Within 7 days</div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <Star size={16} strokeWidth={1.5} className="text-primary mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Experience</p>
              <div className="font-text text-sm font-medium text-foreground leading-tight">Senior Operator</div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <DollarSign size={16} strokeWidth={1.5} className="text-primary mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Hourly Rate</p>
              <div className="font-text text-sm font-medium text-foreground leading-tight">{profile.rate}</div>
            </div>
        </div>

        <section className="mt-8">
          <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-3">Professional Overview</h2>
          <p className="font-text text-[16px] leading-relaxed text-muted-foreground max-w-[65ch]">
            {profile.desc} This operator has been vetted for senior leadership roles in high-growth environments, specializing in {talentTitle.toLowerCase()} and strategic execution.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-3">Core Competencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {['Strategic GTM Planning', 'Revenue Operations', 'Market Intelligence', 'Cross-functional Leadership'].map((skill) => (
              <div key={skill} className="flex items-center gap-2 font-text text-sm text-muted-foreground bg-border/10 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="text-primary shrink-0" /> {skill}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-1">Direct Introduction</p>
            <p className="font-text text-sm text-muted-foreground">Approval starts the scheduling sequence.</p>
          </div>
          <button className="font-text text-sm font-semibold px-6 py-2.5 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms] shrink-0">
            Request Introduction
          </button>
        </div>
      </article>
    </div>
  )
}
