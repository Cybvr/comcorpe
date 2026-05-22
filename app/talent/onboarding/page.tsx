'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCurrentUser, updateUserProfile } from '@/lib/user'

const DISCIPLINES = ['Growth Strategy', 'Brand & Marketing', 'Product Management', 'Operations', 'Finance & Revenue', 'Data & Analytics', 'Tech & Engineering', 'Customer Experience', 'Market Entry', 'Fundraising']
const LOCATIONS = ['Lagos', 'London', 'Nairobi', 'Accra', 'Cape Town', 'New York', 'Remote only', 'Other']
const AVAILABILITY = ['Full-time (5 days/wk)', 'Part-time (2-3 days/wk)', 'Project-based only', 'Advisory (a few hrs/mo)']
const RATES = ['Under $500/day', '$500 - $1,000/day', '$1,000 - $2,000/day', '$2,000+/day', 'Equity / outcome-based']
const EXPERIENCE = ['2-4 years', '5-8 years', '9-14 years', '15+ years']
const SOURCES = ['Referral', 'LinkedIn', 'Comcorpe event', 'Press / media', 'Other']

const TOTAL_STEPS = 4

const L = 'font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground mb-2 block'
const I = 'w-full px-4 py-3 border border-input bg-background font-text text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-100'

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
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 transition-colors duration-300 ${i < current ? 'bg-foreground' : 'bg-border'}`}
        />
      ))}
      <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-eyebrow ml-1 shrink-0">
        {current}/{total}
      </span>
    </div>
  )
}

export default function TalentOnboardingPage() {
  const router = useRouter()
  const { user: currentUser } = useCurrentUser()
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    fullName: '',
    role: '',
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
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(v => v !== value)
        : [...f[field], value],
    }))
  }

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function canAdvance() {
    if (step === 1) return form.fullName.trim() && form.role.trim() && form.location && form.yearsExp
    if (step === 2) return form.disciplines.length > 0
    if (step === 3) return !!form.availability && !!form.rate
    if (step === 4) return form.bio.trim().length > 20 && !!form.source
    return false
  }

  async function next() {
    if (step < TOTAL_STEPS) { setStep(s => s + 1); return }
    if (typeof window !== 'undefined') {
      localStorage.setItem('talent_onboarding', JSON.stringify({ ...form, completedAt: new Date().toISOString() }))
    }
    if (currentUser) {
      const calculatedInitials = form.fullName
        .split(' ')
        .map((n: string) => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 3)

      await updateUserProfile(currentUser.id, {
        isOnboarded: true,
        name: form.fullName,
        initials: calculatedInitials,
        talentRole: form.role,
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
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[520px]">
        <div className="flex justify-center mb-12">
          <Image src="/images/comcorpe.png" alt="Comcorpáµ‰" width={140} height={36} className="h-8 w-auto object-contain" priority />
        </div>

        <StepIndicator current={step} total={TOTAL_STEPS} />

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">Step 1</p>
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">Your background</h1>
              <p className="font-text text-sm text-muted-foreground mt-2">Tell us who you are. This is your base profile on the platform.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={L}>Full name</label>
                <input className={I} placeholder="e.g. Amara Osei" value={form.fullName} onChange={e => set('fullName', e.target.value)} autoFocus />
              </div>
              <div className="col-span-2">
                <label className={L}>Professional title</label>
                <input className={I} placeholder="e.g. Growth Strategy Director" value={form.role} onChange={e => set('role', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={L}>Location</label>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map(l => (
                  <OptionPill key={l} label={l} selected={form.location === l} onClick={() => set('location', l)} />
                ))}
              </div>
            </div>
            <div>
              <label className={L}>Years of experience</label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE.map(e => (
                  <OptionPill key={e} label={e} selected={form.yearsExp === e} onClick={() => set('yearsExp', e)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">Step 2</p>
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">Your expertise</h1>
              <p className="font-text text-sm text-muted-foreground mt-2">Pick your primary disciplines. These determine which briefs you get matched to.</p>
            </div>
            <div>
              <label className={L}>Disciplines (pick all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {DISCIPLINES.map(d => (
                  <OptionPill key={d} label={d} selected={form.disciplines.includes(d)} onClick={() => toggle('disciplines', d)} />
                ))}
              </div>
            </div>
            <div>
              <label className={L}>Portfolio URL (optional)</label>
              <input className={I} placeholder="https://yourwork.com" value={form.portfolioUrl} onChange={e => set('portfolioUrl', e.target.value)} />
            </div>
            <div>
              <label className={L}>LinkedIn URL (optional)</label>
              <input className={I} placeholder="https://linkedin.com/in/you" value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">Step 3</p>
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">Your terms</h1>
              <p className="font-text text-sm text-muted-foreground mt-2">How you work and what you charge. You can update this anytime.</p>
            </div>
            <div>
              <label className={L}>Availability</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map(a => (
                  <OptionPill key={a} label={a} selected={form.availability === a} onClick={() => set('availability', a)} />
                ))}
              </div>
            </div>
            <div>
              <label className={L}>Day rate</label>
              <div className="flex flex-wrap gap-2">
                {RATES.map(r => (
                  <OptionPill key={r} label={r} selected={form.rate === r} onClick={() => set('rate', r)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">Step 4</p>
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">Your story</h1>
              <p className="font-text text-sm text-muted-foreground mt-2">This is what clients read when they look at your profile.</p>
            </div>
            <div>
              <label className={L}>Short bio</label>
              <textarea
                className={`${I} resize-none`}
                rows={5}
                placeholder="What have you built, who have you built it for, and what kind of problems do you solve best?"
                value={form.bio}
                onChange={e => set('bio', e.target.value)}
                autoFocus
              />
              <p className="font-mono text-[9px] text-muted-foreground/50 mt-1.5 uppercase tracking-eyebrow">{form.bio.length} chars - aim for 200-400</p>
            </div>
            <div>
              <label className={L}>How did you find Comcorpe?</label>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map(s => (
                  <OptionPill key={s} label={s} selected={form.source === s} onClick={() => set('source', s)} />
                ))}
              </div>
            </div>
            <div className="p-5 bg-foreground text-background rounded-xl">
              <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-2">What happens next</p>
              <p className="font-text text-sm leading-relaxed opacity-80">Your profile goes to our vetting team. We&apos;ll review your background and reach out within 48 hours to discuss pod placement.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-10">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 font-text text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : <div />}
          <button
            onClick={next}
            disabled={!canAdvance()}
            className="flex items-center gap-2 px-7 py-3 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
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
