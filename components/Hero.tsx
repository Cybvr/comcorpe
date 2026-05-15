export default function Hero() {
  const tickerWords = [
    'ARCHITECT', 'ASSEMBLE', 'OPERATE',
    'TECHNOLOGY & FINTECH', 'PUBLIC INFRASTRUCTURE', 'CONSUMER & BRAND',
    'GROWTH PLAYS', 'SPECIALIST PODS', 'INTERNATIONAL BOARD',
  ]

  return (
    <section id="top" className="px-6 md:px-24 pt-12 md:pt-24 pb-0 border-b border-foreground overflow-hidden relative">
      <div className="flex flex-col md:flex-row md:items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-foreground inline-block" />
          A Growth Systems Company
        </span>
        <span className="md:ml-auto font-mono text-xs text-muted-foreground">00 / Manifesto · Lagos / London / Oslo</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-24 items-end">
        <h1 className="font-display font-black text-[clamp(72px,11vw,184px)] leading-[0.88] tracking-[-0.05em] text-foreground m-0 text-balance">
          The Operating Layer<br />
          for High-Velocity<br />
          Growth<span className="text-primary">.</span>
        </h1>
        <div className="hidden lg:block w-[420px] aspect-square bg-border border border-border flex items-center justify-center -mb-24 relative z-10">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest italic">Hero Image Placeholder</span>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-[5fr_7fr] gap-12 md:gap-24 mt-16 md:mt-20 pb-14 items-end">
        <p className="font-text text-[22px] leading-lede text-muted-foreground m-0 tracking-body max-w-[34ch]">
          Comcorpᵉ orchestrates data, creativity, technology and strategy into unified growth systems —
          built to perform in complex markets.
        </p>
        <div className="flex flex-col gap-8">
          <div className="flex gap-3.5 items-center flex-wrap">
            <a
              href="/book"
              className="font-text text-sm font-semibold px-6 py-3.5 bg-primary text-white rounded-full inline-flex items-center gap-2.5 hover:bg-primary/85 transition-colors duration-[120ms]"
            >
              Book a session call
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </a>
            <a
              href="/model"
              className="font-text text-sm font-semibold px-6 py-3.5 bg-transparent text-foreground border border-foreground hover:bg-foreground hover:text-background transition-colors duration-[120ms]"
            >
              See the model
            </a>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-border font-mono text-xs text-muted-foreground">
            {[['03', 'Arenas'], ['17', 'Active pods'], ['12', 'Growth plays'], ['09', 'Markets']].map(([val, label]) => (
              <div key={label} className="flex flex-col gap-1.5">
                <span className="font-display font-black text-[36px] tracking-[-0.03em] leading-none text-foreground">{val}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-foreground border-b -mx-6 md:-mx-24 overflow-hidden py-3.5 whitespace-nowrap">
        <div className="inline-block animate-ticker font-display font-black text-[32px] tracking-[-0.03em] text-foreground">
          {[...tickerWords, ...tickerWords].map((w, i) => (
            <span key={i} className="inline-block px-8">
              {w}<span className="text-primary inline-block px-2">●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
