'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Plus, X, Check } from 'lucide-react'
import Link from 'next/link'

type EngagementType = 'PROJECT' | 'RETAINED' | 'EQUITY'

const ARENAS = [
  'Technology & Fintech',
  'Consumer & Brand',
  'Public Infrastructure',
  'Financial Services',
  'Healthcare & Life Sciences',
  'Energy & Climate',
  'Media & Entertainment',
]

const TYPE_OPTIONS: { value: EngagementType; label: string; desc: string }[] = [
  { value: 'PROJECT',  label: 'Project',  desc: 'Defined scope, clear deliverables, fixed end date' },
  { value: 'RETAINED', label: 'Retained', desc: 'Ongoing embedded pod, monthly commercial cadence' },
  { value: 'EQUITY',   label: 'Equity',   desc: 'Venture-aligned engagement, compensation includes equity' },
]

const STEPS = ['Engagement', 'Brief', 'Commercial']

export default function NewJobPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  // Step 0
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EngagementType | ''>('')
  const [arena, setArena] = useState('')

  // Step 1
  const [summary, setSummary] = useState('')
  const [scopeItems, setScopeItems] = useState<string[]>([''])
  const [reqItems, setReqItems] = useState<string[]>([''])

  // Step 2
  const [rate, setRate] = useState('')
  const [location, setLocation] = useState('')
  const [timeline, setTimeline] = useState('')
  const [startDate, setStartDate] = useState('')

  function addItem(list: string[], set: (v: string[]) => void) {
    set([...list, ''])
  }

  function updateItem(list: string[], set: (v: string[]) => void, idx: number, val: string) {
    const next = [...list]
    next[idx] = val
    set(next)
  }

  function removeItem(list: string[], set: (v: string[]) => void, idx: number) {
    set(list.filter((_, i) => i !== idx))
  }

  const canAdvance0 = title.trim() && type
  const canAdvance1 = summary.trim() && scopeItems.some(s => s.trim())
  const canAdvance2 = rate.trim() && location.trim() && timeline.trim()

  function handleSubmit() {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[640px] mx-auto">
        <div className="flex flex-col items-center text-center py-20">
          <div className="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center mb-6">
            <Check size={28} className="text-blue" />
          </div>
          <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-ink mb-3">Brief submitted</h1>
          <p className="font-text text-ink-60 mb-8 max-w-[40ch] leading-relaxed">
            Your brief for <span className="font-semibold text-ink">{title}</span> has been received. Comcorpe will review and match a pod within 48 hours.
          </p>
          <Link
            href="/client/dashboard/jobs"
            className="px-6 py-3 bg-ink text-paper rounded-full font-text text-sm font-semibold hover:bg-blue transition-colors"
          >
            Back to My Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[720px] mx-auto">
      <Link href="/client/dashboard/jobs" className="font-text text-sm text-ink-60 hover:text-blue transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to My Jobs
      </Link>

      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">New brief</p>
        <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-ink leading-none">Create an engagement brief</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
              i === step ? 'bg-ink text-paper' :
              i < step   ? 'text-blue' :
              'text-ink-40'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border ${
                i === step ? 'border-paper/20 bg-paper/10' :
                i < step   ? 'border-blue/30 bg-blue/10 text-blue' :
                'border-ink-10 bg-ink-5 text-ink-40'
              }`}>
                {i < step ? <Check size={10} /> : i + 1}
              </span>
              <span className="font-text text-xs font-semibold">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-1 ${i < step ? 'bg-blue/30' : 'bg-ink-10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Engagement */}
      {step === 0 && (
        <div className="space-y-8">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-2">Brief title</label>
            <input
              type="text"
              placeholder="e.g. UK regulatory compliance and FCA readiness"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-paper border border-ink-10 rounded-xl font-text text-sm focus:outline-none focus:border-blue/40 transition-colors"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-3">Engagement type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    type === opt.value
                      ? 'border-blue bg-blue/5 ring-1 ring-blue/20'
                      : 'border-ink-10 bg-paper hover:border-ink-20'
                  }`}
                >
                  <p className={`font-display font-black text-[15px] mb-1 ${type === opt.value ? 'text-blue' : 'text-ink'}`}>{opt.label}</p>
                  <p className="font-text text-xs text-ink-40 leading-snug">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-2">Arena <span className="normal-case tracking-normal text-ink-20">(optional)</span></label>
            <div className="flex flex-wrap gap-2">
              {ARENAS.map(a => (
                <button
                  key={a}
                  onClick={() => setArena(arena === a ? '' : a)}
                  className={`px-3 py-1.5 rounded-full font-text text-xs font-semibold border transition-all ${
                    arena === a
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-paper text-ink-60 border-ink-10 hover:border-ink-20'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: The brief */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-2">Summary</label>
            <textarea
              rows={4}
              placeholder="Describe the commercial problem and what a successful engagement looks like..."
              value={summary}
              onChange={e => setSummary(e.target.value)}
              className="w-full px-4 py-3 bg-paper border border-ink-10 rounded-xl font-text text-sm focus:outline-none focus:border-blue/40 transition-colors resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-3">Scope of work</label>
            <div className="space-y-2">
              {scopeItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue rounded-full shrink-0" />
                  <input
                    type="text"
                    placeholder={`Deliverable ${i + 1}`}
                    value={item}
                    onChange={e => updateItem(scopeItems, setScopeItems, i, e.target.value)}
                    className="flex-1 px-3 py-2 bg-paper border border-ink-10 rounded-lg font-text text-sm focus:outline-none focus:border-blue/40 transition-colors"
                  />
                  {scopeItems.length > 1 && (
                    <button onClick={() => removeItem(scopeItems, setScopeItems, i)} className="text-ink-20 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => addItem(scopeItems, setScopeItems)}
              className="mt-3 flex items-center gap-1.5 font-text text-xs text-blue hover:text-ink transition-colors"
            >
              <Plus size={13} /> Add scope item
            </button>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-3">Requirements</label>
            <div className="space-y-2">
              {reqItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-ink-20 rounded-full shrink-0" />
                  <input
                    type="text"
                    placeholder={`Requirement ${i + 1}`}
                    value={item}
                    onChange={e => updateItem(reqItems, setReqItems, i, e.target.value)}
                    className="flex-1 px-3 py-2 bg-paper border border-ink-10 rounded-lg font-text text-sm focus:outline-none focus:border-blue/40 transition-colors"
                  />
                  {reqItems.length > 1 && (
                    <button onClick={() => removeItem(reqItems, setReqItems, i)} className="text-ink-20 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => addItem(reqItems, setReqItems)}
              className="mt-3 flex items-center gap-1.5 font-text text-xs text-blue hover:text-ink transition-colors"
            >
              <Plus size={13} /> Add requirement
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Commercial */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-2">Budget / rate</label>
              <input
                type="text"
                placeholder="e.g. $60k – $90k or $15k/mo"
                value={rate}
                onChange={e => setRate(e.target.value)}
                className="w-full px-4 py-3 bg-paper border border-ink-10 rounded-xl font-text text-sm focus:outline-none focus:border-blue/40 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g. Lagos / Remote"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-paper border border-ink-10 rounded-xl font-text text-sm focus:outline-none focus:border-blue/40 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-2">Timeline</label>
              <input
                type="text"
                placeholder="e.g. 12-week sprint"
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                className="w-full px-4 py-3 bg-paper border border-ink-10 rounded-xl font-text text-sm focus:outline-none focus:border-blue/40 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 block mb-2">Preferred start <span className="normal-case tracking-normal text-ink-20">(optional)</span></label>
              <input
                type="text"
                placeholder="e.g. Feb 2026"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-paper border border-ink-10 rounded-xl font-text text-sm focus:outline-none focus:border-blue/40 transition-colors"
              />
            </div>
          </div>

          {/* Summary card */}
          <div className="mt-8 p-6 bg-ink-5/50 border border-ink-10 rounded-2xl space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">Brief summary</p>
            <div>
              <p className="font-display font-black text-[18px] text-ink">{title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[9px] uppercase tracking-eyebrow text-blue px-1.5 py-0.5 bg-blue/5 border border-blue/10 rounded-sm">{type}</span>
                {arena && <span className="font-text text-xs text-ink-40">{arena}</span>}
              </div>
            </div>
            <p className="font-text text-sm text-ink-60 leading-relaxed line-clamp-3">{summary}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-ink-60 font-text pt-2 border-t border-ink-10">
              <span>{scopeItems.filter(s => s.trim()).length} scope items</span>
              <span>{reqItems.filter(r => r.trim()).length} requirements</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-ink-10">
        {step > 0 ? (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 font-text text-sm text-ink-60 hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 0 ? !canAdvance0 : !canAdvance1}
            className="flex items-center gap-2 px-6 py-2.5 bg-ink text-paper rounded-full font-text text-sm font-semibold hover:bg-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canAdvance2}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue text-paper rounded-full font-text text-sm font-semibold hover:bg-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit brief <Check size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
