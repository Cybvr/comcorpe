export default function Forces() {
  const items = [
    { i: '01', t: 'Market Maturity', b: 'Businesses are scaling beyond founder-led growth. The era of charismatic improvisation is closing.' },
    { i: '02', t: 'Talent Liquidity', b: 'High-quality operators now exist outside traditional employment structures. Capability is rentable, not just hireable.' },
    { i: '03', t: 'Complexity Explosion', b: 'Channels, partnerships and markets have multiplied. Old models cannot handle this complexity.' },
  ]

  return (
    <section id="forces" className="py-32 px-24 bg-paper border-b border-ink">
      <div className="flex items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-ink inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-ink inline-block" />
          The Shift
        </span>
        <span className="font-mono text-xs text-ink-60 ml-auto">02 / 09</span>
      </div>

      <div className="grid grid-cols-[5fr_7fr] gap-24 mb-20 items-baseline">
        <h2 className="font-display font-black text-[clamp(40px,5vw,72px)] leading-tight tracking-display text-ink m-0 text-balance">
          Three forces have converged.
        </h2>
        <p className="font-text text-[17px] leading-body text-ink-60 m-0">
          The conditions for a new operating layer are here. Growth is no longer a function any single
          firm — agency, consultancy or in-house team — can hold end to end.
        </p>
      </div>

      <div className="grid grid-cols-3 border border-ink">
        {items.map((it, i) => (
          <div
            key={it.i}
            className={`group p-10 bg-paper hover:bg-ink transition-colors duration-[240ms] cursor-default min-h-[280px] flex flex-col ${i < items.length - 1 ? 'border-r border-ink' : ''}`}
          >
            <div className="font-mono text-[13px] text-ink-60 group-hover:text-paper/60 mb-auto pb-20 transition-colors duration-[240ms]">{it.i}.</div>
            <div className="font-display font-black text-[30px] leading-tight tracking-h3 text-ink group-hover:text-paper mb-4 transition-colors duration-[240ms]">{it.t}</div>
            <p className="font-text text-[15px] leading-body text-ink-60 group-hover:text-paper/70 m-0 transition-colors duration-[240ms]">{it.b}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-ink font-display font-black text-[clamp(28px,3.6vw,56px)] leading-tight tracking-h3 text-ink text-balance max-w-[24ch]">
        Old models cannot handle this complexity. <span className="text-blue">A new layer is required.</span>
      </div>
    </section>
  )
}
