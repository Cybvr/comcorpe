export default function Hero() {
  const tickerWords = [
    'ARCHITECT', 'ASSEMBLE', 'OPERATE',
    'TECHNOLOGY & FINTECH', 'PUBLIC INFRASTRUCTURE', 'CONSUMER & BRAND',
    'GROWTH PLAYS', 'SPECIALIST PODS', 'INTERNATIONAL BOARD',
  ]

  return (
    <section id="top" className="px-6 md:px-24 pt-12 md:pt-24 pb-0 border-b border-ink overflow-hidden relative">
      <div className="flex flex-col md:flex-row md:items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-ink inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-ink inline-block" />
          A Growth Systems Company
        </span>
        <span className="md:ml-auto font-mono text-xs text-ink-60">00 / Manifesto · Lagos / London / Singapore</span>
      </div>

      <h1 className="font-display font-black text-[clamp(72px,11vw,184px)] leading-[0.88] tracking-[-0.05em] text-ink m-0 text-balance">
        The Operating Layer<br />
        for High-Velocity<br />
        Growth<span className="text-blue">.</span>
      </h1>

      <div className="flex flex-col md:grid md:grid-cols-[5fr_7fr] gap-12 md:gap-24 mt-16 md:mt-20 pb-14 items-end">
        <p className="font-text text-[22px] leading-lede text-ink-60 m-0 tracking-body max-w-[34ch]">
          Comcorpᵉ orchestrates data, creativity, technology and strategy into unified growth systems —
          built to perform in complex markets.
        </p>
        <div className="flex flex-col gap-8">
          <div className="flex gap-3.5 items-center flex-wrap">
            <a
              href="#closing"
              className="font-text text-sm font-semibold px-6 py-3.5 bg-blue text-white rounded-full inline-flex items-center gap-2.5 hover:bg-blue-hover transition-colors duration-[120ms]"
            >
              Request a brief
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            <a
              href="#model"
              className="font-text text-sm font-semibold px-6 py-3.5 bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper transition-colors duration-[120ms]"
            >
              See the model
            </a>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-ink-10 font-mono text-xs text-ink-60">
            {[['03','Arenas'],['17','Active pods'],['12','Growth plays'],['09','Markets']].map(([val, label]) => (
              <div key={label} className="flex flex-col gap-1.5">
                <span className="font-display font-black text-[36px] tracking-[-0.03em] leading-none text-ink">{val}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-ink border-b -mx-6 md:-mx-24 overflow-hidden py-3.5 whitespace-nowrap">
        <div className="inline-block animate-ticker font-display font-black text-[32px] tracking-[-0.03em] text-ink">
          {[...tickerWords, ...tickerWords].map((w, i) => (
            <span key={i} className="inline-block px-8">
              {w}<span className="text-blue inline-block px-2">●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
