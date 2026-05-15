import Link from 'next/link'

export default function UseCases() {
  const cases = [
    {
      n: 'Case 01', t: 'Market Entry', s: 'A global brand entering Nigeria.',
      slug: 'market-entry',
      steps: ['Design go-to-market strategy', 'Build local partnerships', 'Deploy launch execution team'],
    },
    {
      n: 'Case 02', t: 'Growth Stagnation', s: 'A local leader plateauing.',
      slug: 'growth-stagnation',
      steps: ['Diagnose growth bottlenecks', 'Rewire commercial model', 'Deploy targeted execution pods'],
    },
    {
      n: 'Case 03', t: 'Opportunity Creation', s: 'A new revenue stream we identify.',
      slug: 'opportunity-creation',
      steps: ['Develop concept', 'Pitch client', 'Execute rollout'],
    },
  ]

  return (
    <section id="cases" className="py-20 md:py-32 px-6 md:px-24 bg-background border-b border-foreground">
      <div className="flex items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-foreground inline-block" />
          Case Studies
        </span>
        <span className="font-mono text-xs text-muted-foreground ml-auto">06 / 09</span>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-[5fr_7fr] gap-12 md:gap-24 mb-16 md:items-baseline">
        <h2 className="font-display font-black text-[clamp(40px,5vw,72px)] leading-tight tracking-display text-foreground m-0 text-balance">
          Three patterns. One operating method.
        </h2>
        <p className="font-text text-[17px] leading-body text-muted-foreground m-0">
          Every engagement falls into one of three shapes — entering, unblocking or originating.
          The architecture is shared; the configuration is bespoke.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border border-foreground">
        {cases.map((c, i) => (
          <div key={c.n} className={`p-8 md:p-9 bg-background flex flex-col min-h-[400px] md:min-h-[460px] ${i < cases.length - 1 ? 'border-b md:border-b-0 md:border-r border-border' : ''}`}>
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-[0.08em] mb-3">{c.n}</div>
            <div className="font-display font-black text-[28px] leading-tight tracking-h3 text-foreground mb-3">{c.t}</div>
            <p className="font-text text-base leading-relaxed text-muted-foreground mb-7 italic">{c.s}</p>
            <div className="flex flex-col mt-auto">
              {c.steps.map((s, j) => (
                <div key={j} className={`grid grid-cols-[40px_1fr] gap-3 py-3.5 border-t border-border items-baseline ${j === c.steps.length - 1 ? 'border-b border-border' : ''}`}>
                  <span className="font-mono text-xs text-primary font-medium">0{j + 1}/</span>
                  <span className="font-text text-[15px] text-foreground leading-snug">{s}</span>
                </div>
              ))}
              {c.slug ? (
                <Link href={`/case-studies/${c.slug}`} className="mt-5 font-mono text-xs text-primary inline-flex items-center gap-1.5 hover:gap-3 transition-all duration-[200ms] w-fit">
                  Read the case →
                </Link>
              ) : (
                <span className="mt-5 font-mono text-xs text-muted-foreground/70 w-fit">Coming soon</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-foreground grid grid-cols-1 md:grid-cols-[1fr_auto] items-baseline gap-6">
        <div className="font-display font-black text-[clamp(28px,3.6vw,48px)] tracking-h3 text-foreground leading-tight text-balance max-w-[24ch]">
          We architect and <span className="text-primary">capture opportunities.</span>
        </div>
        <Link href="/case-studies" className="font-mono text-xs text-primary hover:underline whitespace-nowrap">
          All case studies →
        </Link>
      </div>
    </section>
  )
}
