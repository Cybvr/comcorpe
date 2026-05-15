export default function Provocation() {
  const insights = [
    'Strategy exists without execution',
    'Execution exists without coherence',
    'Talent exists without orchestration',
    'Opportunities exist without structure',
  ]

  return (
    <section id="provocation" className="py-20 md:py-32 px-6 md:px-24 bg-background border-b border-foreground">
      <div className="flex flex-col md:flex-row md:items-baseline gap-6 mb-12 md:mb-20">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-foreground inline-block" />
          The Provocation
        </span>
        <span className="font-mono text-xs text-muted-foreground ml-auto">01 / 09</span>
      </div>

      <h2 className="font-display font-black text-[clamp(48px,6.5vw,104px)] leading-[0.96] tracking-hero text-foreground m-0 max-w-[20ch] text-balance">
        Growth is the most <span className="text-primary">mismanaged</span> function in emerging markets.
      </h2>

      <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 border-t border-foreground">
        <div className="py-12 md:pr-12 md:pl-24 md:-ml-24 border-b md:border-b-0 md:border-r border-border">
          <div className="font-mono text-xs text-muted-foreground mb-6 uppercase">The Diagnosis</div>
          <div className="font-display font-black text-[32px] leading-tight tracking-h3 mb-8">Growth is not treated as a system.</div>
          <ul className="list-none p-0 m-0 flex flex-col">
            {insights.map((b, i) => (
              <li key={i} className="py-5 border-b border-border grid grid-cols-[32px_1fr] gap-4 font-text text-base leading-relaxed text-foreground last:border-b-0">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="py-12 md:pl-12 md:pr-24 md:-mr-24 bg-foreground text-background">
          <div className="font-mono text-xs text-background/60 mb-6 uppercase">The Result</div>
          <div className="font-display font-black text-[32px] leading-tight tracking-h3 text-background mb-8">
            Reactive. Fragmented. Non-compounding.
          </div>
          <p className="font-text text-[17px] leading-body text-background/70 m-0 max-w-[40ch]">
            Across markets, growth is delivered as disconnected interventions: a campaign here,
            a hire there, a deck somewhere else. Each cycle starts from zero. Knowledge does not
            accumulate. Outcomes do not compound.
          </p>
          <div className="mt-8 p-6 bg-primary text-white font-display font-black text-[22px] tracking-[-0.02em] leading-snug">
            We treat growth as architecture, not effort.
          </div>
        </div>
      </div>
    </section>
  )
}
