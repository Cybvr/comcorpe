'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowUpRight, CheckCircle2, DollarSign, Globe2, Layers3, MapPin, ShieldCheck, Star } from 'lucide-react'
import { getTalent } from '@/lib/admin/store'
import { type User } from '@/lib/user'
import BackButton from '@/components/dashboard/BackButton'

export default function ClientDashboardTalentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [profile, setProfile] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    getTalent().then(talent => {
      setProfile(talent.find(t => t.id === id) ?? null)
    })
  }, [id])

  if (profile === undefined) return null
  if (!profile) notFound()

  const talentTitle = profile.talentRole ?? profile.role

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1040px] mx-auto">
      <BackButton />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">
        <article className="border border-border rounded-xl p-8 bg-background">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className={`w-20 h-20 rounded-2xl ${profile.color || 'bg-foreground'} flex items-center justify-center font-display font-black text-[24px] text-background shrink-0 border border-border overflow-hidden relative`}>
                {profile.image ? (
                  <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                ) : (
                  profile.initials
                )}
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-2">Verified Operator</p>
                <h1 className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-tight">{profile.name}</h1>
                <p className="font-text text-[17px] text-muted-foreground mt-1">{talentTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full">
              <ShieldCheck size={14} className="text-primary" />
              <span className="font-text text-xs font-semibold text-primary">Comcorpe Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
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

          <section className="mt-12">
            <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground mb-4">Professional Overview</h2>
            <p className="font-text text-[16px] leading-relaxed text-muted-foreground max-w-[65ch]">
              {profile.desc} This operator has been vetted for senior leadership roles in high-growth environments, specializing in {talentTitle.toLowerCase()} and strategic execution.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground mb-4">Core Competencies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Strategic GTM Planning', 'Revenue Operations', 'Market Intelligence', 'Cross-functional Leadership'].map((skill) => (
                <div key={skill} className="flex items-center gap-2 font-text text-sm text-muted-foreground bg-border/10 p-3 rounded-lg">
                  <CheckCircle2 size={14} className="text-primary" /> {skill}
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-border flex items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-1">Direct Introduction</p>
              <p className="font-text text-sm text-muted-foreground">Approval starts the scheduling sequence.</p>
            </div>
            <button className="font-text text-sm font-semibold px-6 py-3 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms] shrink-0">
              Request Introduction
            </button>
          </div>
        </article>

        <aside className="border border-border rounded-xl p-6 bg-background">
          <h3 className="font-display font-black text-[18px] tracking-[-0.01em] text-foreground mb-4">Match Analysis</h3>
          <p className="font-text text-sm text-muted-foreground mb-6">
            Based on your active briefs, {profile.name.split(' ')[0]} is a strong match for complex market entry and commercial design.
          </p>
          <div className="space-y-4">
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="font-mono text-[9px] uppercase tracking-eyebrow text-primary mb-1">Fit Score</p>
              <p className="font-display font-black text-[18px] text-primary">94% High Fit</p>
            </div>
          </div>
          <button className="w-full mt-6 inline-flex items-center justify-center gap-2 font-text text-xs font-semibold px-4 py-3 bg-background border border-border text-foreground hover:border-input transition-all rounded-full">
            Compare Talent <ArrowUpRight size={14} />
          </button>
        </aside>
      </div>
    </div>
  )
}
