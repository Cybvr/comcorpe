'use client'
import { useState } from 'react'
import Link from 'next/link'

const ARENAS = [
  'Technology & Fintech',
  'Public Infrastructure & Impact',
  'Consumer & Brand',
  'Other',
]

const BUDGETS = [
  'Under $25k',
  '$25k – $75k',
  '$75k – $150k',
  '$150k – $500k',
  '$500k+',
  'Let\'s discuss',
]

const TIMELINES = [
  'Immediate (< 1 month)',
  'Short-term (1–3 months)',
  'Medium-term (3–6 months)',
  'Long-term (6+ months)',
  'Exploring / no timeline yet',
]

const ENGAGEMENT_TYPES = [
  'Market entry',
  'Growth stagnation / turnaround',
  'New revenue stream',
  'Brand & communications',
  'Organisational capability build',
  'Strategic opportunity brief',
  'Not sure yet',
]

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  arena: string;
  engagementType: string;
  budget: string;
  timeline: string;
  markets: string;
  challenge: string;
  heard: string;
}

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    arena: '',
    engagementType: '',
    budget: '',
    timeline: '',
    markets: '',
    challenge: '',
    heard: '',
  })

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
    setForm(f => ({ ...f, [field]: e.target.value }))
  
  const toggle = (field: keyof FormState, val: string) => 
    setForm(f => ({ ...f, [field]: f[field] === val ? '' : val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] bg-ink dark-inv-section flex items-center justify-center px-6">
        <div className="max-w-[560px] w-full py-24">
          <div className="font-mono text-xs text-paper/50 uppercase tracking-eyebrow mb-6">Brief received</div>
          <h1 className="font-display font-black text-[clamp(48px,7vw,80px)] leading-[0.92] tracking-hero text-paper mb-8">
            We'll be in touch.
          </h1>
          <p className="font-text text-[18px] leading-relaxed text-paper/70 max-w-[40ch]">
            Thank you, <strong className="text-paper font-semibold">{form.firstName}</strong>. Someone from the Comcorpᵉ team
            will review your brief and reach out within 48 hours.
          </p>
          <div className="mt-12 pt-8 border-t border-paper/20">
            <Link href="/" className="font-text text-sm font-semibold px-6 py-3.5 bg-blue text-white hover:bg-blue-hover transition-colors duration-[120ms] inline-flex items-center gap-2">
              Back to Comcorpᵉ
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-paper">
      <div className="max-w-[760px] mx-auto px-6 md:px-12 py-16 md:py-24">

        {/* Page header */}
        <div className="mb-16">
          <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-ink-60 inline-block" />
            Strategic Brief
          </div>
          <h1 className="font-display font-black text-[clamp(40px,6vw,72px)] leading-[0.94] tracking-hero text-ink mb-6 text-balance">
            Tell us about<br />your challenge.
          </h1>
          <p className="font-text text-[18px] leading-relaxed text-ink-60 max-w-[48ch]">
            The more you share, the better we can assess fit and come prepared. This takes about 5 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-12">

          {/* Section 1 — Contact */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-8 pb-4 border-b border-ink-10 w-full">
              01 / Your details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="First name" required>
                <input type="text" value={form.firstName} onChange={set('firstName')} placeholder="Ada" required className={inputCls} />
              </Field>
              <Field label="Last name" required>
                <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Obi" required className={inputCls} />
              </Field>
              <Field label="Work email" required>
                <input type="email" value={form.email} onChange={set('email')} placeholder="ada@company.com" required className={inputCls} />
              </Field>
              <Field label="Phone / WhatsApp">
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+234 800 000 0000" className={inputCls} />
              </Field>
              <Field label="Company / Organisation" required>
                <input type="text" value={form.company} onChange={set('company')} placeholder="Acme Corp" required className={inputCls} />
              </Field>
              <Field label="Your role">
                <input type="text" value={form.role} onChange={set('role')} placeholder="CEO, CMO, Founder…" className={inputCls} />
              </Field>
            </div>
          </fieldset>

          {/* Section 2 — Engagement */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-8 pb-4 border-b border-ink-10 w-full">
              02 / The engagement
            </legend>
            <div className="flex flex-col gap-8">
              <Field label="Which arena best describes your sector?">
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {ARENAS.map(a => (
                    <button
                      key={a} type="button"
                      onClick={() => toggle('arena', a)}
                      className={`px-4 py-3 text-left font-text text-sm border transition-colors duration-[120ms] ${form.arena === a ? 'bg-ink text-paper border-ink' : 'bg-transparent text-ink border-ink-20 hover:border-ink'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="What type of engagement are you looking for?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                  {ENGAGEMENT_TYPES.map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => toggle('engagementType', t)}
                      className={`px-4 py-3 text-left font-text text-sm border transition-colors duration-[120ms] ${form.engagementType === t ? 'bg-ink text-paper border-ink' : 'bg-transparent text-ink border-ink-20 hover:border-ink'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Which markets are involved?">
                <input
                  type="text"
                  value={form.markets}
                  onChange={set('markets')}
                  placeholder="e.g. Nigeria, Kenya, UK, Singapore…"
                  className={inputCls}
                />
              </Field>
            </div>
          </fieldset>

          {/* Section 3 — Challenge */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-8 pb-4 border-b border-ink-10 w-full">
              03 / The challenge
            </legend>
            <Field label="Describe the growth challenge you're facing" required>
              <textarea
                value={form.challenge}
                onChange={set('challenge')}
                required
                rows={5}
                placeholder="What's the core problem? What have you tried? What does success look like?"
                className={`${inputCls} resize-none`}
              />
            </Field>
          </fieldset>

          {/* Section 4 — Practicalities */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-8 pb-4 border-b border-ink-10 w-full">
              04 / Practicalities
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Indicative budget range">
                <div className="flex flex-col gap-2 mt-1">
                  {BUDGETS.map(b => (
                    <button
                      key={b} type="button"
                      onClick={() => toggle('budget', b)}
                      className={`px-4 py-3 text-left font-text text-sm border transition-colors duration-[120ms] ${form.budget === b ? 'bg-ink text-paper border-ink' : 'bg-transparent text-ink border-ink-20 hover:border-ink'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Desired timeline">
                <div className="flex flex-col gap-2 mt-1">
                  {TIMELINES.map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => toggle('timeline', t)}
                      className={`px-4 py-3 text-left font-text text-sm border transition-colors duration-[120ms] ${form.timeline === t ? 'bg-ink text-paper border-ink' : 'bg-transparent text-ink border-ink-20 hover:border-ink'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </fieldset>

          {/* Section 5 — How they heard */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-8 pb-4 border-b border-ink-10 w-full">
              05 / One last thing
            </legend>
            <Field label="How did you hear about Comcorpᵉ?">
              <input
                type="text"
                value={form.heard}
                onChange={set('heard')}
                placeholder="Referral, LinkedIn, event, press…"
                className={inputCls}
              />
            </Field>
          </fieldset>

          {/* Submit */}
          <div className="pt-4 border-t border-ink flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="font-mono text-xs text-ink-60 max-w-[36ch]">
              We'll review your brief and respond within 48 hours.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="font-text text-sm font-semibold px-8 py-4 bg-blue text-white hover:bg-blue-hover transition-colors duration-[120ms] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3 whitespace-nowrap"
            >
              {loading ? 'Submitting…' : 'Submit brief'}
              {!loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-4 py-3.5 border border-ink-20 bg-paper-pure font-text text-sm text-ink placeholder:text-ink-40 focus:outline-none focus:border-ink transition-colors duration-[120ms]'

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-60">
        {label}{required && <span className="text-blue ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
