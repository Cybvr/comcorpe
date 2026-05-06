export default function UseCases() {
  const cases = [
    {
      n: 'Case 01', t: 'Market Entry', s: 'A global brand entering Nigeria.',
      steps: ['Design go-to-market strategy', 'Build local partnerships', 'Deploy launch execution team'],
    },
    {
      n: 'Case 02', t: 'Growth Stagnation', s: 'A local leader plateauing.',
      steps: ['Diagnose growth bottlenecks', 'Rewire commercial model', 'Deploy targeted execution pods'],
    },
    {
      n: 'Case 03', t: 'Opportunity Creation', s: 'A new revenue stream we identify.',
      steps: ['Develop concept', 'Pitch client', 'Execute rollout'],
    },
  ]

  return (
    <section id="cases" className="py-32 px-24 bg-paper border-b border-ink">
      <div className="flex items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-ink inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-ink inline-block" />
          Early use cases
        </span>
        <span className="font-mono text-xs text-ink-60 ml-auto">06 / 09</span>
      </div>

      <div className="grid grid-cols-[5fr_7fr] gap-24 mb-16 items-baseline">
        <h2 className="font-display font-black text-[clamp(40px,5vw,72px)] leading-tight tracking-display text-ink m-0 text-balance">
          Three patterns. One operating method.
        </h2>
        <p className="font-text text-[17px] leading-body text-ink-60 m-0">
          Every engagement falls into one of three shapes — entering, unblocking or originating.
          The architecture is shared; the configuration is bespoke.
        </p>
      </div>

      <div className="grid grid-cols-3 border border-ink">
        {cases.map((c, i) => (
          <div key={c.n} className={`p-9 bg-paper flex flex-col min-h-[460px] ${i < cases.length - 1 ? 'border-r border-ink-10' : ''}`}>
            <div className="font-mono text-xs text-ink-60 uppercase tracking-[0.08em] mb-3">{c.n}</div>
            <div className="font-display font-black text-[28px] leading-tight tracking-h3 text-ink mb-3">{c.t}</div>
            <p className="font-text text-base leading-relaxed text-ink-60 mb-7 italic">{c.s}</p>
            <div className="flex flex-col mt-auto">
              {c.steps.map((s, j) => (
                <div key={j} className={`grid grid-cols-[40px_1fr] gap-3 py-3.5 border-t border-ink-10 items-baseline ${j === c.steps.length - 1 ? 'border-b border-ink-10' : ''}`}>
                  <span className="font-mono text-xs text-blue font-medium">0{j + 1}/</span>
                  <span className="font-text text-[15px] text-ink leading-snug">{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-ink grid grid-cols-[1fr_auto] items-baseline gap-8">
        <div className="font-display font-black text-[clamp(28px,3.6vw,48px)] tracking-h3 text-ink leading-tight text-balance max-w-[24ch]">
          We do not wait for problems. <span className="text-blue">We create opportunities.</span>
        </div>
        <div className="font-mono text-xs text-ink-60">06 / 09 · Operating method</div>
      </div>
    </section>
  )
}
