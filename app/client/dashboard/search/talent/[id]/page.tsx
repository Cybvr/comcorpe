'use client'

import { use } from 'react'
import Image from 'next/image'
import { notFound, useRouter } from 'next/navigation'
import { ArrowUpRight, CheckCircle2, DollarSign, Layers3, MapPin, ShieldCheck, Star, ArrowLeft, TrendingUp } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { useUser } from '@/lib/user'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import NetworkAffiliateBadge from '@/components/dashboard/NetworkAffiliateBadge'

export default function ClientDashboardTalentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
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
    <TooltipProvider delayDuration={200}>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-4xl mx-auto">
        <article>
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
                <Button variant="outline" size="sm" onClick={() => router.back()} className="h-5 px-2 rounded-full text-[9px] font-mono uppercase tracking-eyebrow text-muted-foreground/60 mb-1.5">
                  <ArrowLeft size={9} /> Back
                </Button>
                <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">{profile.name}</h1>
                <p className="font-text text-[17px] text-muted-foreground mb-3">{talentTitle}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.portfolioUrl && (
                    <Button variant="outline" size="sm" asChild className="h-7 px-3 rounded-full font-text text-xs font-semibold text-muted-foreground">
                      <a href={profile.portfolioUrl} target="_blank" rel="noreferrer">
                        Portfolio <ArrowUpRight size={12} />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-default inline-flex">
                    <ShieldCheck size={16} className="text-primary" strokeWidth={2.5} />
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Comcorpe Verified</p></TooltipContent>
              </Tooltip>

              {(profile.networkAffiliations ?? []).length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-default inline-flex">
                      <NetworkAffiliateBadge affiliations={profile.networkAffiliations!} size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Network Affiliate · {profile.networkAffiliations!.join(', ')}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    aria-label="LinkedIn"
                    className="inline-flex items-center justify-center text-[#0A66C2]"
                  >
                    <FaLinkedin size={16} aria-hidden="true" />
                  </span>
                </TooltipTrigger>
                <TooltipContent><p>LinkedIn profile</p></TooltipContent>
              </Tooltip>
              {profile.ndaSigned && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-default inline-flex font-mono text-[10px] uppercase tracking-eyebrow px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">
                      NDA signed
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>NDA signed and recorded for this operator.</p></TooltipContent>
                </Tooltip>
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

          {(profile.desc || (profile.highlights && profile.highlights.length > 0)) && (
            <section className="mt-8">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-3">About</h2>
              {profile.highlights && profile.highlights.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {profile.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <TrendingUp size={14} className="text-green-500 shrink-0 mt-0.5" />
                      <span className="font-text text-[15px] font-semibold text-foreground leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              {profile.desc && (
                <p className="font-text text-[16px] leading-relaxed text-muted-foreground max-w-[65ch]">
                  {profile.desc}
                </p>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-text text-sm font-semibold text-primary hover:underline mt-3"
                >
                  See full portfolio <ArrowUpRight size={13} />
                </a>
              )}
            </section>
          )}

          {profile.disciplines && profile.disciplines.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-3">Core Competencies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profile.disciplines.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 font-text text-sm text-muted-foreground bg-border/10 p-2.5 rounded-lg">
                    <CheckCircle2 size={14} className="text-primary shrink-0" /> {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-1">Direct Introduction</p>
              <p className="font-text text-sm text-muted-foreground">Approval starts the scheduling sequence.</p>
            </div>
            <Button className="rounded-full font-text text-sm font-semibold px-6">
              Request Introduction
            </Button>
          </div>
        </article>
      </div>
    </TooltipProvider>
  )
}
