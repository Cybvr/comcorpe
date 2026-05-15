'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Sparkles, 
  FileEdit, 
  ChevronRight, 
  CheckCircle2, 
  BrainCircuit, 
  Upload,
  X
} from 'lucide-react'

type FlowState = 'CHOICE' | 'AI_INPUT' | 'GENERATING' | 'FORM'

export default function NewBriefPage() {
  const router = useRouter()
  const [flow, setFlow] = useState<FlowState>('CHOICE')
  const [rawInput, setRawInput] = useState('')
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    type: 'PROJECT',
    budget: '',
    timeline: '',
    requirements: [''],
    scope: ['']
  })

  const handleAiGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setFlow('GENERATING')
    
    // Simulate Claude parsing the raw input
    setTimeout(() => {
      setFormData({
        ...formData,
        title: 'Digital Rewards Ecosystem',
        summary: 'A behavior-driven loyalty engine designed to shift user behavior from transactional utility to long-term brand loyalty.',
        budget: '$120k - $180k',
        timeline: '24 weeks',
        requirements: ['Fintech loyalty experience', 'Technical PM skills', 'Behavioral economics background'],
        scope: ['Design reward triggers', 'Merchant API integration', 'Customer redemption journey']
      })
      setFlow('FORM')
    }, 2000)
  }

  const addField = (field: 'requirements' | 'scope') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    })
  }

  if (flow === 'CHOICE') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-[32px] tracking-tight text-ink mb-3">Create a new brief</h1>
          <p className="font-text text-sm text-ink-60">How would you like to build your project requirements?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* AI Option */}
          <button 
            onClick={() => setFlow('AI_INPUT')}
            className="group p-8 bg-paper border border-ink-10 rounded-[32px] text-left hover:border-blue transition-all relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
              <Sparkles size={120} className="text-blue" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center text-blue mb-6 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h3 className="font-display font-black text-xl text-ink mb-2">AI Autopilot</h3>
            <p className="font-text text-sm text-ink-60 leading-relaxed">
              Paste your raw notes or project description and Claude will draft the full brief for you.
            </p>
            <div className="mt-8 flex items-center gap-2 text-blue font-text text-[11px] font-bold uppercase tracking-wider">
              Get Started <ChevronRight size={14} />
            </div>
          </button>

          {/* Manual Option */}
          <button 
            onClick={() => setFlow('FORM')}
            className="group p-8 bg-paper border border-ink-10 rounded-[32px] text-left hover:border-ink-40 transition-all relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-ink-5 flex items-center justify-center text-ink-40 mb-6 group-hover:scale-110 transition-transform">
              <FileEdit size={24} />
            </div>
            <h3 className="font-display font-black text-xl text-ink mb-2">Manual Draft</h3>
            <p className="font-text text-sm text-ink-60 leading-relaxed">
              Fill out the brief requirements manually using our standard structured format.
            </p>
            <div className="mt-8 flex items-center gap-2 text-ink-40 font-text text-[11px] font-bold uppercase tracking-wider">
              Create manually <ChevronRight size={14} />
            </div>
          </button>
        </div>

        <Link href="/client/dashboard/jobs" className="mt-12 font-text text-[13px] text-ink-40 hover:text-ink transition-colors flex items-center gap-2">
          <ArrowLeft size={14} /> Back to dashboard
        </Link>
      </div>
    )
  }

  if (flow === 'AI_INPUT') {
    return (
      <div className="max-w-[700px] mx-auto py-12 px-4">
        <button onClick={() => setFlow('CHOICE')} className="flex items-center gap-2 text-ink-40 hover:text-ink text-xs font-bold uppercase tracking-wider mb-8">
          <ArrowLeft size={14} /> Back
        </button>
        
        <div className="mb-10">
          <div className="flex items-center gap-2 text-blue mb-3">
            <Sparkles size={16} />
            <span className="font-mono text-[10px] uppercase tracking-widest font-black">AI Autopilot</span>
          </div>
          <h2 className="font-display font-black text-[28px] tracking-tight text-ink">Describe your project</h2>
          <p className="font-text text-sm text-ink-60 mt-2">Claude will parse your description to build the title, summary, scope, and budget requirements.</p>
        </div>

        <form onSubmit={handleAiGenerate} className="space-y-6">
          <div className="relative">
            <textarea 
              autoFocus
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="e.g. We need a loyalty system for our digital bank. It should have behavior-based rewards and a dashboard for merchants..."
              className="w-full h-[240px] p-6 bg-paper border border-ink-10 rounded-[24px] font-text text-base focus:outline-none focus:border-blue transition-all resize-none shadow-xl shadow-ink/5"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-ink-5 rounded-2xl">
            <div className="flex items-center gap-3 text-ink-40">
              <Upload size={16} />
              <span className="font-text text-xs">Optional: Attach technical docs</span>
            </div>
            <button 
              type="submit"
              disabled={!rawInput}
              className="px-8 py-4 bg-blue text-paper rounded-full font-text text-sm font-bold hover:bg-ink transition-all disabled:opacity-30 shadow-lg shadow-blue/20"
            >
              Generate Draft
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (flow === 'GENERATING') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-blue/10 border-t-blue rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-blue">
            <BrainCircuit size={24} />
          </div>
        </div>
        <p className="font-display font-black text-xl text-ink">Claude is thinking...</p>
        <p className="font-text text-sm text-ink-40 mt-2">Parsing project requirements and drafting brief</p>
      </div>
    )
  }

  return (
    <div className="max-w-[800px] mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <button onClick={() => setFlow('CHOICE')} className="flex items-center gap-2 text-ink-40 hover:text-ink text-xs font-bold uppercase tracking-wider mb-3">
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="font-display font-black text-[32px] tracking-tight text-ink">Review Brief</h1>
        </div>
        {rawInput && (
          <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full flex items-center gap-2 border border-green-500/20">
            <CheckCircle2 size={14} />
            <span className="font-mono text-[9px] uppercase font-black tracking-wider">AI Drafted</span>
          </div>
        )}
      </div>

      <div className="space-y-10">
        {/* Basic Info */}
        <section className="space-y-6">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-40 block mb-3 font-black">Project Title</label>
            <input 
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Digital Wallet Growth Sprint"
              className="w-full p-5 bg-paper border border-ink-10 rounded-2xl font-display font-black text-xl text-ink focus:outline-none focus:border-ink-40 transition-all"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-40 block mb-3 font-black">Summary</label>
            <textarea 
              value={formData.summary}
              onChange={e => setFormData({...formData, summary: e.target.value})}
              placeholder="What are we solving for?"
              className="w-full h-[120px] p-5 bg-paper border border-ink-10 rounded-2xl font-text text-sm leading-relaxed text-ink focus:outline-none focus:border-ink-40 transition-all resize-none"
            />
          </div>
        </section>

        {/* Commercials */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-40 block mb-3 font-black">Budget Estimate</label>
            <input 
              type="text"
              value={formData.budget}
              onChange={e => setFormData({...formData, budget: e.target.value})}
              placeholder="e.g. $10k - $20k"
              className="w-full p-4 bg-paper border border-ink-10 rounded-2xl font-text text-sm font-bold text-ink focus:outline-none focus:border-ink-40 transition-all"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-40 block mb-3 font-black">Expected Timeline</label>
            <input 
              type="text"
              value={formData.timeline}
              onChange={e => setFormData({...formData, timeline: e.target.value})}
              placeholder="e.g. 12 weeks"
              className="w-full p-4 bg-paper border border-ink-10 rounded-2xl font-text text-sm font-bold text-ink focus:outline-none focus:border-ink-40 transition-all"
            />
          </div>
        </div>

        {/* List Fields */}
        <div className="space-y-8 pt-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <label className="font-mono text-[10px] uppercase tracking-widest text-ink-40 font-black">Scope of Work</label>
              <button onClick={() => addField('scope')} className="text-blue font-text text-[10px] font-bold uppercase tracking-wider">Add Point</button>
            </div>
            <div className="space-y-3">
              {formData.scope.map((s, i) => (
                <input 
                  key={i}
                  type="text"
                  value={s}
                  onChange={e => {
                    const newScope = [...formData.scope]
                    newScope[i] = e.target.value
                    setFormData({...formData, scope: newScope})
                  }}
                  className="w-full p-4 bg-paper border border-ink-10 rounded-xl font-text text-xs text-ink-60 focus:outline-none focus:border-ink-40 transition-all"
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <label className="font-mono text-[10px] uppercase tracking-widest text-ink-40 font-black">Requirements</label>
              <button onClick={() => addField('requirements')} className="text-blue font-text text-[10px] font-bold uppercase tracking-wider">Add Point</button>
            </div>
            <div className="space-y-3">
              {formData.requirements.map((r, i) => (
                <input 
                  key={i}
                  type="text"
                  value={r}
                  onChange={e => {
                    const newReq = [...formData.requirements]
                    newReq[i] = e.target.value
                    setFormData({...formData, requirements: newReq})
                  }}
                  className="w-full p-4 bg-paper border border-ink-10 rounded-xl font-text text-xs text-ink-60 focus:outline-none focus:border-ink-40 transition-all"
                />
              ))}
            </div>
          </section>
        </div>

        {/* Final Action */}
        <div className="pt-12 border-t border-ink-10 flex items-center justify-end gap-4">
          <button onClick={() => router.back()} className="px-6 py-3 font-text text-sm font-bold text-ink-40 hover:text-ink transition-colors">Cancel</button>
          <button className="px-10 py-4 bg-ink text-paper rounded-full font-text text-sm font-bold hover:bg-blue transition-all shadow-xl shadow-ink/10">
            Publish Brief
          </button>
        </div>
      </div>
    </div>
  )
}
