'use client'

import { 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
} from 'lucide-react'

const RECENT_EVALS = [
  { prompt: 'Generate Q4 budget summary...', status: 'SAFE', truthfulness: '99.8%', latency: '1.2s' },
  { prompt: 'Draft Sentinel contract v2', status: 'SAFE', truthfulness: '100%', latency: '2.1s' },
  { prompt: 'Find security vulnerabilities in...', status: 'SAFE', truthfulness: '98.5%', latency: '0.8s' },
  { prompt: 'Recommend talent for...', status: 'SAFE', truthfulness: '99.9%', latency: '1.5s' },
]

export default function AIQualityPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-green-500 mb-2">
          <ShieldCheck size={16} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-black">AI Reliability Center</span>
        </div>
        <h2 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">Trust & Quality Metrics</h2>
        <p className="font-text text-muted-foreground mt-3 text-sm max-w-2xl leading-relaxed">
          Comcorpe uses a multi-layered evaluation framework to ensure every response from Claude 3.5 meets enterprise standards for accuracy, safety, and privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Overall Truthfulness', value: '99.2%', icon: CheckCircle2, color: 'text-primary' },
          { label: 'Safety Compliance', value: '100%', icon: ShieldCheck, color: 'text-green-500' },
          { label: 'Avg Latency', value: '1.4s', icon: Activity, color: 'text-purple-500' },
          { label: 'Data Privacy', value: 'Encrypted', icon: Lock, color: 'text-foreground' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-background border border-border rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={20} className={stat.color} />
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="font-text text-xs text-muted-foreground/70 mb-1">{stat.label}</p>
            <p className="font-display font-black text-2xl text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-8">
          <section className="p-8 bg-background border border-border rounded-[32px]">
            <h2 className="font-display font-black text-2xl mb-6">Real-time Evaluation Feed</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-4 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">Request</th>
                    <th className="pb-4 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">Safety</th>
                    <th className="pb-4 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">Truthfulness</th>
                    <th className="pb-4 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {RECENT_EVALS.map((eval_item, i) => (
                    <tr key={i} className="group hover:bg-muted transition-colors">
                      <td className="py-4 font-text text-sm text-foreground truncate max-w-[240px]">{eval_item.prompt}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full font-mono text-[10px] font-bold">
                          <CheckCircle2 size={10} /> {eval_item.status}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-sm text-muted-foreground">{eval_item.truthfulness}</td>
                      <td className="py-4 font-mono text-sm text-muted-foreground/70">{eval_item.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="p-6 bg-foreground text-background rounded-[32px] overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <ShieldCheck size={120} />
            </div>
            <h3 className="font-display font-black text-xl mb-4 relative z-10">Safety Guardrails</h3>
            <p className="font-text text-sm text-background/60 leading-relaxed mb-6 relative z-10">
              {"Our proprietary guardrail system intercepts every LLM call to filter PII, prevent hallucinations, and enforce your company's tone of voice."}
            </p>
            <ul className="space-y-3 relative z-10">
              {['PII Redaction', 'Hallucination Check', 'Prompt Injection Shield'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 font-text text-xs text-background/80">
                  <CheckCircle2 size={14} className="text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-background border border-border rounded-3xl">
            <h4 className="font-display font-black text-lg mb-4">Model Version</h4>
            <div className="flex items-center justify-between p-3 bg-muted rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-border">
                  <Activity size={16} className="text-primary" />
                </div>
                <span className="font-text text-sm font-bold text-foreground">Claude 3.5 Sonnet</span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-green-600 font-bold">Active</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
