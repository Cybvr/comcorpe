import { Fragment } from 'react'

export default function Pillars() {
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

  const rows = [
    { label: 'Teams', a: 'Fixed, salaried, project-staffed', b: 'Modular pods, configured to the brief' },
    { label: 'Engagements', a: 'Linear: brief → deck → handoff', b: 'Idea-led, continuous, iterative' },
    { label: 'Overhead', a: 'High structural drag', b: 'Low structural drag' },
    { label: 'Output', a: 'Recommendations and creative', b: 'A growth engine that runs' },
  ]

  return (
    <section id="model" className="py-20 md:py-32 px-6 md:px-24 bg-ink text-paper border-b border-ink">
      <div className="flex items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-paper inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-paper inline-block" />
          The Comcorpᵉ Proposition
        </span>
        <span className="font-mono text-xs text-paper/60 ml-auto">03 / 09</span>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-16 mb-20 md:mb-24 md:items-end">
        <h2 className="font-display font-black text-[clamp(48px,7vw,112px)] leading-[0.94] tracking-hero text-paper m-0 text-balance">
          We do not deliver recommendations.<br />
          <span className="text-blue">We build growth engines that run.</span>
        </h2>
        <div className="font-text text-[18px] leading-relaxed text-paper/70 max-w-[38ch]">
          <span className="font-display font-black text-[22px] tracking-[-0.02em] text-paper block mb-3">Three pillars hold the model.</span>
          Architect, Assemble, Operate. Together they collapse the gap between strategy
          and execution that defines every traditional engagement.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border border-paper/20">
        {pillars.map((p, i) => (
          <div
            key={p.i}
            className={`group p-8 md:p-12 hover:bg-blue/[0.08] transition-colors duration-[240ms] cursor-default min-h-[400px] md:min-h-[460px] flex flex-col ${i < pillars.length - 1 ? 'border-b md:border-b-0 md:border-r border-paper/20' : ''}`}
          >
            <div className="flex items-baseline gap-3 mb-16">
              <span className="font-mono text-[13px] text-paper/60">{p.i}.</span>
            </div>
            <div className="font-display font-black text-[64px] leading-[0.92] tracking-hero text-paper">
              {p.verb}<span className="text-blue">.</span>
            </div>
            <div className="h-6" />
            <div className="font-text text-[13px] font-semibold tracking-eyebrow uppercase text-paper/60 mb-5">{p.title}</div>
            <p className="font-text text-base leading-body text-paper/85 mb-auto">{p.body}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {p.tags.map(t => (
                <span key={t} className="font-mono text-[11px] tracking-[0.06em] uppercase text-paper px-2.5 py-1.5 border border-paper/25">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 md:mt-24 border border-paper/20 grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] overflow-x-auto">
        <div className="p-5 border-b border-r border-paper/20 font-mono text-xs text-paper/60 uppercase tracking-[0.08em]">vs.</div>
        <div className="p-5 border-b border-r border-paper/20 font-mono text-xs text-paper/60 uppercase tracking-[0.08em]">Traditional Model</div>
        <div className="p-5 border-b border-paper/20 font-mono text-xs text-white uppercase tracking-[0.08em] bg-blue">Comcorpᵉ Model</div>
        {rows.map((r, i) => (
          <Fragment key={i}>
            <div key={`l-${r.label}`} className={`px-6 py-6 font-mono text-xs text-paper/60 uppercase tracking-[0.08em] border-r border-paper/20 ${i < rows.length - 1 ? 'border-b border-paper/[0.12]' : ''}`}>{r.label}</div>
            <div key={`a-${r.label}`} className={`px-6 py-6 font-text text-[17px] text-paper/85 border-r border-paper/20 ${i < rows.length - 1 ? 'border-b border-paper/[0.12]' : ''}`}>{r.a}</div>
            <div key={`b-${r.label}`} className={`px-6 py-6 font-text text-[17px] text-paper font-medium bg-blue/[0.08] ${i < rows.length - 1 ? 'border-b border-paper/[0.12]' : ''}`}>{r.b}</div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}
