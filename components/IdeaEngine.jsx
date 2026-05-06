export default function IdeaEngine() {
  const items = [
    { t: 'Proprietary, insight-driven opportunities', s: 'Originated from market signal, not client request.' },
    { t: 'Developed ahead of client demand', s: 'A backlog of plays, ready to deploy when the window opens.' },
    { t: 'Designed to unlock revenue or market entry', s: 'Each play maps to a measurable commercial outcome.' },
  ]

  return (
    <section id="idea-engine" className="py-20 md:py-32 px-6 md:px-24 bg-paper border-b border-ink">
      <div className="flex items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-ink inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-ink inline-block" />
          The Idea Engine
        </span>
        <span className="font-mono text-xs text-ink-60 ml-auto">04 / 09</span>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[7fr_5fr] gap-12 lg:gap-24 items-start">
        <h2 className="font-display font-black text-[clamp(56px,7.5vw,128px)] leading-[0.92] tracking-[-0.05em] text-ink m-0 text-balance">
          Most firms wait for briefs.<br />
          <span className="text-blue">We originate them.</span>
        </h2>

        <div className="flex flex-col gap-6 pt-4">
          <p className="font-text text-[19px] leading-relaxed text-ink-60 m-0 tracking-body">
            Beyond client engagements, Comcorpᵉ originates proprietary <em>Growth Plays</em> —
            strategic constructs developed from market insight and transformed into
            <em> Strategic Opportunity Briefs</em> for forward-looking organisations.
          </p>
          <div className="flex flex-col mt-3">
            {items.map((it, i) => (
              <div key={i} className={`grid grid-cols-[40px_1fr] gap-4 py-5 border-t border-ink-10 items-baseline ${i === items.length - 1 ? 'border-b border-ink-10' : ''}`}>
                <span className="font-mono text-[13px] text-ink-60">→</span>
                <div>
                  <div className="font-display font-black text-[22px] tracking-[-0.02em] leading-tight text-ink">{it.t}</div>
                  <div className="font-text text-sm text-ink-60 mt-1.5 leading-snug">{it.s}</div>
                </div>
              </div>
            ))}
          </div>
          <span className="inline-block mt-6 px-3.5 py-2 bg-ink text-paper font-mono text-xs tracking-[0.08em] uppercase">
            Asymmetric advantage in business development
          </span>
        </div>
      </div>
    </section>
  )
}
