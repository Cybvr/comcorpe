'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCurrentUser, updateUserProfile } from '@/lib/user'

const INDUSTRIES = ['Fintech', 'Banking', 'FMCG', 'Retail', 'Healthcare', 'Energy', 'Media', 'Other']
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']
const CHALLENGE_TYPES = ['Growth & Revenue', 'Brand & Marketing', 'Product & Innovation', 'Operations & Scaling', 'Market Entry', 'Customer Retention']
const BUDGETS = ['Under $20k', '$20k - $50k', '$50k - $100k', '$100k - $250k', '$250k+']
const TIMELINES = ['Under 4 weeks', '4-8 weeks', '8-12 weeks', '3-6 months', '6+ months (retained)']
const SOURCES = ['Referral from colleague', 'LinkedIn', 'Google search', 'Comcorpe event', 'Press / media', 'Other']
const CHURN_RATES = ['< 1%', '1–3%', '3–7%', '7%+', "Don't know"]
const CUSTOMER_RANGES = ['< 1,000', '1k–10k', '10k–100k', '100k–1M', '1M+', "Don't know"]

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

export default function ClientOnboardingPage() {
  const router = useRouter()
  const { user: currentUser } = useCurrentUser()
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    size: '',
    challenges: [] as string[],
    budget: '',
    timeline: '',
    source: '',
    anythingElse: '',
    // Step 4: baseline metrics
    perceptionScore: '',
    churnRate: '',
    arpu: '',
    monthlyCustomers: '',
  })

  function toggle(field: 'challenges', value: string) {
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
    if (step === 1) return form.companyName.trim() && form.industry && form.size
    if (step === 2) return form.challenges.length > 0 && form.budget && form.timeline
    if (step === 3) return !!form.source
    if (step === 4) return !!form.churnRate && !!form.monthlyCustomers
    return false
  }

  async function next() {
    if (step < TOTAL_STEPS) { setStep(s => s + 1); return }
    if (typeof window !== 'undefined') {
      localStorage.setItem('client_onboarding', JSON.stringify({ ...form, completedAt: new Date().toISOString() }))
    }
    if (currentUser) {
      await updateUserProfile(currentUser.id, {
        isOnboarded: true,
        company: form.companyName,
        industry: form.industry,
        companySize: form.size,
        challenges: form.challenges,
        budget: form.budget,
        timeline: form.timeline,
        source: form.source,
        notes: form.anythingElse,
        // Growth Surgery baseline
        clientPhase: 1,
        phaseLabel: 'Diagnosis & Onboarding',
        phaseStartedAt: new Date().toISOString(),
        baselinePerceptionScore: form.perceptionScore ? parseFloat(form.perceptionScore) : undefined,
        baselineChurnRate: form.churnRate,
        baselineArpu: form.arpu ? parseFloat(form.arpu) : undefined,
        baselineMonthlyCustomers: form.monthlyCustomers,
      })
    }
    router.push('/client/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[520px]">
        <div className="flex justify-center mb-12">
          <Image src="/images/comcorpe.png" alt="Comcorpe" width={140} height={36} className="h-8 w-auto object-contain" priority />
        </div>

        <StepIndicator current={step} total={TOTAL_STEPS} />

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">Step 1</p>
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">Your company</h1>
              <p className="font-text text-sm text-muted-foreground mt-2">Tell us who you are so we can match you to the right pods.</p>
            </div>
            <div>
              <label className={L}>Company name</label>
              <input className={I} placeholder="e.g. Volta Pay" value={form.companyName} onChange={e => set('companyName', e.target.value)} autoFocus />
            </div>
            <div>
              <label className={L}>Industry</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(ind => (
                  <OptionPill key={ind} label={ind} selected={form.industry === ind} onClick={() => set('industry', ind)} />
                ))}
              </div>
            </div>
            <div>
              <label className={L}>Company size</label>
              <div className="flex flex-wrap gap-2">
                {COMPANY_SIZES.map(s => (
                  <OptionPill key={s} label={s} selected={form.size === s} onClick={() => set('size', s)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">Step 2</p>
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">What you need</h1>
              <p className="font-text text-sm text-muted-foreground mt-2">Help us understand the challenge you&apos;re bringing to Comcorpe.</p>
            </div>
            <div>
              <label className={L}>Primary challenge (pick all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {CHALLENGE_TYPES.map(c => (
                  <OptionPill key={c} label={c} selected={form.challenges.includes(c)} onClick={() => toggle('challenges', c)} />
                ))}
              </div>
            </div>
            <div>
              <label className={L}>Estimated budget</label>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map(b => (
                  <OptionPill key={b} label={b} selected={form.budget === b} onClick={() => set('budget', b)} />
                ))}
              </div>
            </div>
            <div>
              <label className={L}>Expected timeline</label>
              <div className="flex flex-wrap gap-2">
                {TIMELINES.map(t => (
                  <OptionPill key={t} label={t} selected={form.timeline === t} onClick={() => set('timeline', t)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">Step 3</p>
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">Almost there</h1>
              <p className="font-text text-sm text-muted-foreground mt-2">Last few things to get you set up.</p>
            </div>
            <div>
              <label className={L}>How did you find Comcorpe?</label>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map(s => (
                  <OptionPill key={s} label={s} selected={form.source === s} onClick={() => set('source', s)} />
                ))}
              </div>
            </div>
            <div>
              <label className={L}>Anything else we should know? (optional)</label>
              <textarea
                className={`${I} resize-none`}
                rows={4}
                placeholder="Context on your business, specific constraints, who we'll be working with..."
                value={form.anythingElse}
                onChange={e => set('anythingElse', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">Step 4</p>
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">Set your starting line</h1>
              <p className="font-text text-sm text-muted-foreground mt-2">
                We use these baselines to measure the real impact of the growth surgery. Estimates are fine.
              </p>
            </div>

            <div>
              <label className={L}>Current brand / perception score (NPS or 1–10)</label>
              <input
                className={I}
                type="number"
                placeholder="e.g. 42 (NPS) or 6.5 (out of 10)"
                value={form.perceptionScore}
                onChange={e => set('perceptionScore', e.target.value)}
              />
              <p className="font-text text-[11px] text-muted-foreground/60 mt-1.5">Optional — leave blank if you don&apos;t have a score yet.</p>
            </div>

            <div>
              <label className={L}>Approximate monthly churn rate</label>
              <div className="flex flex-wrap gap-2">
                {CHURN_RATES.map(c => (
                  <OptionPill key={c} label={c} selected={form.churnRate === c} onClick={() => set('churnRate', c)} />
                ))}
              </div>
            </div>

            <div>
              <label className={L}>Average revenue per user / customer (optional)</label>
              <input
                className={I}
                placeholder="e.g. ₦4,500 / month or $12 / year"
                value={form.arpu}
                onChange={e => set('arpu', e.target.value)}
              />
            </div>

            <div>
              <label className={L}>Monthly active customers</label>
              <div className="flex flex-wrap gap-2">
                {CUSTOMER_RANGES.map(r => (
                  <OptionPill key={r} label={r} selected={form.monthlyCustomers === r} onClick={() => set('monthlyCustomers', r)} />
                ))}
              </div>
            </div>

            <div className="p-5 bg-foreground text-background rounded-xl">
              <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-2">What happens next</p>
              <p className="font-text text-sm leading-relaxed opacity-80">Your Comcorpe partner will review your profile and reach out within 24 hours to discuss the right pod match for your challenge.</p>
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
              <><Check size={14} /> Complete setup</>
            ) : (
              <>Continue <ArrowRight size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
