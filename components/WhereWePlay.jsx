export default function WhereWePlay() {
  const arenas = [
    { i: '01', t: 'Technology & Fintech Platforms', s: 'Activation, brand and growth systems for high-velocity tech and regulated financial platforms.', tags: ['FINTECH', 'PAYMENTS', 'PLATFORMS'] },
    { i: '02', t: 'Public Infrastructure & Impact Systems', s: 'Behaviour-shifting communication for state, civic and impact-led organisations operating at population scale.', tags: ['CIVIC', 'STATE', 'IMPACT'] },
    { i: '03', t: 'Consumer & Brand Ecosystems', s: 'Brand worlds and commercial systems for consumer companies that need to perform across every channel.', tags: ['FMCG', 'TELECOMS', 'GAMING'] },
  ]

  const rungs = [
    { n: '01', l: 'Retainers', d: 'System oversight and ongoing orchestration', r: 'Recurring' },
    { n: '02', l: 'Project Fees', d: 'Builds and execution sprints', r: 'Milestone' },
    { n: '03', l: 'Success Fees', d: 'Performance-linked outcomes', r: 'Variable' },
    { n: '04', l: 'Equity Participation', d: 'Selective, high-conviction partnerships', r: 'Aligned' },
  ]

  return (
    <section id="arenas" className="py-32 px-24 bg-ink text-paper border-b border-ink">
      <div className="flex items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-paper inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-paper inline-block" />
          Where we play
        </span>
        <span className="font-mono text-xs text-paper/60 ml-auto">05 / 09</span>
      </div>

      <h2 className="font-display font-black text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-hero text-paper m-0 mb-20 max-w-[20ch] text-balance">
        Concentration over coverage. Three arenas, anchored in Pan-Africa.
      </h2>

      <div className="grid grid-cols-[5fr_7fr] gap-16 items-start">
        <div className="border border-paper/20">
          {arenas.map((a, i) => (
            <div
              key={a.i}
              className={`group p-8 hover:bg-blue/10 transition-colors duration-[240ms] cursor-default ${i < arenas.length - 1 ? 'border-b border-paper/20' : ''}`}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-xs text-paper/60">{a.i}.</span>
                <span className="font-display font-black text-[26px] tracking-[-0.025em] leading-tight text-paper">{a.t}</span>
              </div>
              <p className="font-text text-sm leading-relaxed text-paper/70 m-0">{a.s}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {a.tags.map(t => (
                  <span key={t} className="font-mono text-[10px] tracking-[0.08em] uppercase text-paper px-2 py-1 border border-paper/25">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="font-mono text-xs text-paper/60 uppercase tracking-[0.08em] mb-5">Business Model</div>
          <div className="font-display font-black text-[32px] tracking-h3 leading-tight text-paper mb-8">We align with growth, not just activity.</div>
          <div className="flex flex-col">
            {rungs.map((r, i) => (
              <div key={r.n} className={`grid grid-cols-[32px_1fr_auto] gap-5 py-5.5 border-t border-paper/20 items-baseline ${i === rungs.length - 1 ? 'border-b border-paper/20' : ''}`}>
                <span className="font-mono text-xs text-paper/60">{r.n}</span>
                <div>
                  <div className="font-display font-black text-[22px] tracking-[-0.02em] text-paper">{r.l}</div>
                  <div className="font-text text-sm text-paper/70 mt-1">{r.d}</div>
                </div>
                <span className="font-mono text-[11px] text-paper/50 uppercase tracking-[0.08em]">{r.r}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 border border-paper/20 grid grid-cols-[1fr_auto] items-center gap-5">
            <div>
              <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-paper/60 mb-1">Anchor market</div>
              <div className="font-display font-black text-[18px] tracking-[-0.02em] text-paper">Pan-Africa</div>
            </div>
            <div className="font-mono text-[11px] text-paper/50">
              <span className="text-blue">→</span> Global mandates via network
            </div>
          </div>

          <div className="mt-8 font-display font-black text-[24px] tracking-[-0.02em] text-paper">
            Financial services. FMCG. Betting & gaming. Telecoms. <span className="text-blue">Consumer platforms.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
