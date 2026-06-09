'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { updateUserProfile, useCurrentUser } from '@/lib/user'

const DISCIPLINES = ['Growth Strategy', 'Brand & Marketing', 'Product Management', 'Operations', 'Finance & Revenue', 'Data & Analytics', 'Tech & Engineering', 'Customer Experience', 'Market Entry', 'Fundraising']
const INDUSTRIES = ['Fintech', 'Infrastructure', 'Consumer', 'Healthcare', 'Media', 'Education', 'Public sector', 'Other']
const LOCATIONS = ['Lagos', 'London', 'Nairobi', 'Accra', 'Cape Town', 'New York', 'Remote only', 'Other']
const AVAILABILITY = ['Full-time (5 days/wk)', 'Part-time (2-3 days/wk)', 'Project-based only', 'Advisory (a few hrs/mo)']
const RATES = ['Under $500/day', '$500 - $1,000/day', '$1,000 - $2,000/day', '$2,000+/day', 'Equity / outcome-based']
const EXPERIENCE = ['2-4 years', '5-8 years', '9-14 years', '15+ years']
const SOURCES = ['Referral', 'LinkedIn', 'Comcorpe event', 'Press / media', 'Other']

const TOTAL_STEPS = 4

const LABEL = 'font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground mb-2 block'
const INPUT = 'w-full px-4 py-3 border border-input bg-background font-text text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-100'

function OptionPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 border font-text text-sm font-medium transition-colors duration-100 ${
        selected
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-foreground border-input hover:border-foreground'
      }`}
    >
      {label}
    </button>
  )
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-10 flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-0.5 flex-1 transition-colors duration-300 ${index < current ? 'bg-foreground' : 'bg-border'}`}
        />
      ))}
      <span className="ml-1 shrink-0 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/60">
        {current}/{total}
      </span>
    </div>
  )
}

export default function TalentOnboardingFlow() {
  const router = useRouter()
  const { user: currentUser } = useCurrentUser()
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    fullName: '',
    role: '',
    industry: '',
    location: '',
    yearsExp: '',
    disciplines: [] as string[],
    portfolioUrl: '',
    linkedinUrl: '',
    availability: '',
    rate: '',
    bio: '',
    source: '',
  })

  function toggle(field: 'disciplines', value: string) {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((entry) => entry !== value)
        : [...current[field], value],
    }))
  }

  function set(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function canAdvance() {
    if (step === 1) return form.fullName.trim() && form.role.trim() && form.industry && form.location && form.yearsExp
    if (step === 2) return form.disciplines.length > 0
    if (step === 3) return !!form.availability && !!form.rate
    if (step === 4) return form.bio.trim().length > 20 && !!form.source
    return false
  }

  async function next() {
    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1)
      return
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('talent_onboarding', JSON.stringify({ ...form, completedAt: new Date().toISOString() }))
    }

    if (currentUser) {
      const calculatedInitials = form.fullName
        .split(' ')
        .map((name) => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 3)

      await updateUserProfile(currentUser.id, {
        isOnboarded: true,
        vettingStatus: 'pending',
        name: form.fullName,
        initials: calculatedInitials,
        talentRole: form.role,
        industry: form.industry,
        location: form.location,
        yearsExp: form.yearsExp,
        disciplines: form.disciplines,
        portfolioUrl: form.portfolioUrl,
        linkedinUrl: form.linkedinUrl,
        availability: form.availability,
        rate: form.rate,
        desc: form.bio,
        source: form.source,
      })
    }

    router.push('/talent/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-[520px]">
        <div className="mb-12 flex justify-center">
          <Image src="/images/comcorpe.png" alt="Comcorpe" width={140} height={36} className="h-8 w-auto object-contain" priority />
        </div>

        <StepIndicator current={step} total={TOTAL_STEPS} />

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-primary">Step 1</p>
              <h1 className="font-display text-[32px] font-black leading-tight tracking-[-0.03em] text-foreground">Your background</h1>
              <p className="mt-2 font-text text-sm text-muted-foreground">Tell us who you are. This is your base profile on the platform.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={LABEL}>Full name</label>
                <input className={INPUT} placeholder="e.g. Amara Osei" value={form.fullName} onChange={(event) => set('fullName', event.target.value)} autoFocus />
              </div>
              <div className="col-span-2">
                <label className={LABEL}>Professional title</label>
                <input className={INPUT} placeholder="e.g. Growth Strategy Director" value={form.role} onChange={(event) => set('role', event.target.value)} />
              </div>
            </div>
            <div>
              <label className={LABEL}>Industry</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((industry) => (
                  <OptionPill key={industry} label={industry} selected={form.industry === industry} onClick={() => set('industry', industry)} />
                ))}
              </div>
            </div>
            <div>
              <label className={LABEL}>Location</label>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((location) => (
                  <OptionPill key={location} label={location} selected={form.location === location} onClick={() => set('location', location)} />
                ))}
              </div>
            </div>
            <div>
              <label className={LABEL}>Years of experience</label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE.map((experience) => (
                  <OptionPill key={experience} label={experience} selected={form.yearsExp === experience} onClick={() => set('yearsExp', experience)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-primary">Step 2</p>
              <h1 className="font-display text-[32px] font-black leading-tight tracking-[-0.03em] text-foreground">Your expertise</h1>
              <p className="mt-2 font-text text-sm text-muted-foreground">Pick your primary disciplines. These determine which briefs you get matched to.</p>
            </div>
            <div>
              <label className={LABEL}>Disciplines (pick all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {DISCIPLINES.map((discipline) => (
                  <OptionPill key={discipline} label={discipline} selected={form.disciplines.includes(discipline)} onClick={() => toggle('disciplines', discipline)} />
                ))}
              </div>
            </div>
            <div>
              <label className={LABEL}>Portfolio URL (optional)</label>
              <input className={INPUT} placeholder="https://yourwork.com" value={form.portfolioUrl} onChange={(event) => set('portfolioUrl', event.target.value)} />
            </div>
            <div>
              <label className={LABEL}>LinkedIn URL (optional)</label>
              <input className={INPUT} placeholder="https://linkedin.com/in/you" value={form.linkedinUrl} onChange={(event) => set('linkedinUrl', event.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-primary">Step 3</p>
              <h1 className="font-display text-[32px] font-black leading-tight tracking-[-0.03em] text-foreground">Your terms</h1>
              <p className="mt-2 font-text text-sm text-muted-foreground">How you work and what you charge. You can update this anytime.</p>
            </div>
            <div>
              <label className={LABEL}>Availability</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map((availability) => (
                  <OptionPill key={availability} label={availability} selected={form.availability === availability} onClick={() => set('availability', availability)} />
                ))}
              </div>
            </div>
            <div>
              <label className={LABEL}>Day rate</label>
              <div className="flex flex-wrap gap-2">
                {RATES.map((rate) => (
                  <OptionPill key={rate} label={rate} selected={form.rate === rate} onClick={() => set('rate', rate)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-primary">Step 4</p>
              <h1 className="font-display text-[32px] font-black leading-tight tracking-[-0.03em] text-foreground">Your story</h1>
              <p className="mt-2 font-text text-sm text-muted-foreground">This is what clients read when they look at your profile.</p>
            </div>
            <div>
              <label className={LABEL}>Short bio</label>
              <textarea
                className={`${INPUT} resize-none`}
                rows={5}
                placeholder="What have you built, who have you built it for, and what kind of problems do you solve best?"
                value={form.bio}
                onChange={(event) => set('bio', event.target.value)}
                autoFocus
              />
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/50">{form.bio.length} chars - aim for 200-400</p>
            </div>
            <div>
              <label className={LABEL}>How did you find Comcorpe?</label>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((source) => (
                  <OptionPill key={source} label={source} selected={form.source === source} onClick={() => set('source', source)} />
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-foreground p-5 text-background">
              <p className="mb-2 font-mono text-[9px] uppercase tracking-eyebrow opacity-40">What happens next</p>
              <p className="font-text text-sm leading-relaxed opacity-80">Your profile goes to our vetting team. We&apos;ll review your background and reach out within 48 hours to discuss pod placement.</p>
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((current) => current - 1)}
              className="flex items-center gap-2 font-text text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : <div />}
          <button
            onClick={next}
            disabled={!canAdvance()}
            className="flex items-center gap-2 bg-foreground px-7 py-3 font-text text-sm font-semibold text-background transition-colors duration-100 hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            {step === TOTAL_STEPS ? (
              <><Check size={14} /> Complete profile</>
            ) : (
              <>Continue <ArrowRight size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
