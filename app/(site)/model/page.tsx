import { Metadata } from 'next'
import { Fragment } from 'react'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const metadata: Metadata = {
  title: 'Our Model — Comcorpᵉ',
  description: 'A Growth Systems Company. We architect, assemble, and operate growth engines for emerging markets.',
}

const pillars = [
  {
    i: '01', verb: 'Architect', title: 'Design the growth system',
    body: 'We map the unit economics, the channel architecture and the commercial logic before we build anything. The output is a system, not a slide.',
    tags: ['UNIT ECONOMICS', 'COMMERCIAL DESIGN', 'FEEDBACK LOOPS'],
  },
  {
    i: '02', verb: 'Assemble', title: 'Curate best-fit execution talent',
    body: 'Specialist Pods are configured to the problem, not the org chart. Drawn from a curated network of operators, never a static bench.',
    tags: ['SPECIALIST PODS', 'GLOBAL TALENT', 'ON-DEMAND'],
  },
  {
    i: '03', verb: 'Operate', title: 'Drive implementation and iteration',
    body: 'We ship, measure and rewire. Every engagement compounds: knowledge becomes proprietary, systems become reusable, talent becomes fluent.',
    tags: ['EXECUTION', 'ITERATION', 'COMPOUNDING'],
  },
]

const comparisonRows = [
  { label: 'Teams', a: 'Fixed, salaried, project-staffed', b: 'Modular pods, configured to the brief' },
  { label: 'Engagements', a: 'Linear: brief → deck → handoff', b: 'Idea-led, continuous, iterative' },
  { label: 'Overhead', a: 'High structural drag', b: 'Low structural drag' },
  { label: 'Output', a: 'Recommendations and creative', b: 'A growth engine that runs' },
]

const engineItems = [
  { t: 'Proprietary, insight-driven opportunities', s: 'Originated from market signal, not client request.' },
  { t: 'Developed ahead of client demand', s: 'A backlog of plays, ready to deploy when the window opens.' },
  { t: 'Designed to unlock revenue or market entry', s: 'Each play maps to a measurable commercial outcome.' },
]

export default function ModelPage() {
  return (
    <div className="bg-background">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-24">
        
        {/* Section 01: Forces */}
        <div className="mb-24 md:mb-40 border-b border-foreground pb-20 md:pb-32">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-muted-foreground inline-block" />
            Market Forces
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-[6fr_6fr] gap-12 lg:gap-24 items-end mb-20">
            <h1 className="font-display font-black text-[clamp(48px,7.5vw,112px)] leading-[0.92] tracking-hero text-foreground m-0 text-balance">
              Fragmented markets.<br />
              <span className="text-primary">Hybrid solutions.</span>
            </h1>
            <div className="font-text text-[19px] leading-relaxed text-muted-foreground max-w-[42ch]">
              Emerging markets are defined by high-trust networks and low-visibility data. 
              The winners are those who can navigate the gap between formal structure and informal reality.
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 border-t border-foreground pt-12">
            {[
              { t: 'Network Dominance', s: 'Trust moves faster than contracts. Success is relationship-dependent.' },
              { t: 'Data Opacity', s: 'Signals are buried. Proprietary intelligence is the only leverage.' },
              { t: 'Execution Friction', s: 'The last mile is where most strategies fail. Operational depth is non-negotiable.' },
              { t: 'Modular Growth', s: 'Scaling requires flexibility. Static structures are liabilities.' }
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="font-mono text-[13px] text-primary">0{i+1}.</div>
                <div className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground">{f.t}</div>
                <p className="font-text text-sm text-muted-foreground leading-relaxed m-0">{f.s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 02: Pillars (The Core Model) */}
        <div className="mb-24 md:mb-40 bg-foreground -mx-6 md:-mx-24 px-6 md:px-24 py-24 md:py-32 text-background">
          <div className="flex items-baseline gap-6 mb-14">
            <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-background inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-background inline-block" />
              The Comcorpᵉ Proposition
            </span>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20 lg:mb-24 lg:items-end">
            <h2 className="font-display font-black text-[clamp(48px,7vw,112px)] leading-[0.94] tracking-hero text-background m-0 text-balance">
              We build growth <span className="text-primary">engines that run.</span>
            </h2>
            <div className="font-text text-[19px] leading-relaxed text-background/70 max-w-[38ch]">
              <span className="font-display font-black text-[24px] tracking-[-0.02em] text-background block mb-4">Three pillars hold the model.</span>
              Architect, Assemble, Operate. Together they collapse the gap between strategy
              and execution.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-background/20 mb-20">
            {pillars.map((p, i) => (
              <div
                key={p.i}
                className={`group p-8 md:p-12 hover:bg-primary/[0.08] transition-colors duration-[240ms] flex flex-col min-h-[400px] md:min-h-[460px] ${i < pillars.length - 1 ? 'border-b md:border-b-0 md:border-r border-background/20' : ''}`}
              >
                <div className="flex items-baseline gap-3 mb-16">
                  <span className="font-mono text-[13px] text-background/60">{p.i}.</span>
                </div>
                <div className="font-display font-black text-[clamp(48px,5vw,72px)] leading-[0.92] tracking-hero text-background">
                  {p.verb}<span className="text-primary">.</span>
                </div>
                <div className="h-6" />
                <div className="font-text text-[13px] font-semibold tracking-eyebrow uppercase text-background/60 mb-5">{p.title}</div>
                <p className="font-text text-base leading-body text-background/85 mb-auto">{p.body}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="font-mono text-[11px] tracking-[0.06em] uppercase text-background px-2.5 py-1.5 border border-background/25">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border border-background/20 grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] overflow-hidden">
            <div className="p-6 border-b border-r border-background/20 font-mono text-xs text-background/60 uppercase tracking-[0.08em]">vs.</div>
            <div className="p-6 border-b border-r border-background/20 font-mono text-xs text-background/60 uppercase tracking-[0.08em]">Traditional Model</div>
            <div className="p-6 border-b border-background/20 font-mono text-xs text-white uppercase tracking-[0.08em] bg-primary">Comcorpᵉ Model</div>
            {comparisonRows.map((r, i) => (
              <Fragment key={i}>
                <div className={`px-6 py-6 font-mono text-xs text-background/60 uppercase tracking-[0.08em] border-r border-background/20 ${i < comparisonRows.length - 1 ? 'border-b border-background/[0.12]' : ''}`}>{r.label}</div>
                <div className={`px-6 py-6 font-text text-[17px] text-background/85 border-r border-background/20 ${i < comparisonRows.length - 1 ? 'border-b border-background/[0.12]' : ''}`}>{r.a}</div>
                <div className={`px-6 py-6 font-text text-[17px] text-background font-medium bg-primary/[0.08] ${i < comparisonRows.length - 1 ? 'border-b border-background/[0.12]' : ''}`}>{r.b}</div>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Section 03: Idea Engine */}
        <div className="mb-0">
          <div className="flex items-baseline gap-6 mb-14">
            <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-foreground inline-block" />
              The Idea Engine
            </span>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-[7fr_5fr] gap-12 lg:gap-24 items-start">
            <h2 className="font-display font-black text-[clamp(48px,6.5vw,104px)] leading-[0.92] tracking-hero text-foreground m-0 text-balance">
              We originate proprietary <span className="text-primary">Growth Plays.</span>
            </h2>

            <div className="flex flex-col gap-8 pt-4">
              <p className="font-text text-[20px] leading-relaxed text-muted-foreground m-0">
                Beyond client engagements, Comcorpᵉ originates proprietary <em>Growth Plays</em> — 
                strategic constructs developed from market insight and transformed into 
                <em> Strategic Opportunity Briefs</em>.
              </p>
              <div className="flex flex-col gap-px bg-foreground border border-foreground overflow-hidden rounded-sm">
                {engineItems.map((it, i) => (
                  <div key={i} className="grid grid-cols-[50px_1fr] gap-4 p-8 bg-background items-baseline">
                    <span className="font-mono text-[15px] text-primary">0{i+1}</span>
                    <div>
                      <div className="font-display font-black text-[24px] tracking-[-0.02em] leading-tight text-foreground">{it.t}</div>
                      <div className="font-text text-[15px] text-muted-foreground mt-2 leading-relaxed">{it.s}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-6 bg-background border border-foreground font-mono text-xs tracking-[0.08em] uppercase text-center text-foreground flex items-center justify-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Asymmetric advantage in business development
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 md:h-32" />
    </div>
  )
}
