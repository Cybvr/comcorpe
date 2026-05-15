export default function Forces() {
  const items = [
    { i: '01', t: 'Market Maturity', b: 'Businesses are scaling beyond founder-led growth. The era of charismatic improvisation is closing.' },
    { i: '02', t: 'Talent Liquidity', b: 'High-quality operators now exist outside traditional employment structures. Capability is rentable, not just hireable.' },
    { i: '03', t: 'Complexity Explosion', b: 'Channels, partnerships and markets have multiplied. Old models cannot handle this complexity.' },
  ]

  return (
    <section id="forces" className="py-20 md:py-32 px-6 md:px-24 bg-background border-b border-foreground">
      <div className="flex items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-foreground inline-block" />
          The Shift
        </span>
        <span className="font-mono text-xs text-muted-foreground ml-auto">02 / 09</span>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-[5fr_7fr] gap-12 md:gap-24 mb-16 md:mb-20 md:items-baseline">
        <h2 className="font-display font-black text-[clamp(40px,5vw,72px)] leading-tight tracking-display text-foreground m-0 text-balance">
          Three forces have converged.
        </h2>
        <p className="font-text text-[17px] leading-body text-muted-foreground m-0">
          The conditions for a new operating layer are here. Growth is no longer a function any single
          firm — agency, consultancy or in-house team — can hold end to end.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border border-foreground">
        {items.map((it, i) => (
          <div
            key={it.i}
            className={`group p-8 md:p-10 bg-background hover:bg-foreground transition-colors duration-[240ms] cursor-default min-h-[240px] md:min-h-[280px] flex flex-col ${i < items.length - 1 ? 'border-b md:border-b-0 md:border-r border-foreground' : ''}`}
          >
            <div className="font-mono text-[13px] text-muted-foreground group-hover:text-background/60 mb-auto pb-20 transition-colors duration-[240ms]">{it.i}.</div>
            <div className="font-display font-black text-[30px] leading-tight tracking-h3 text-foreground group-hover:text-background mb-4 transition-colors duration-[240ms]">{it.t}</div>
            <p className="font-text text-[15px] leading-body text-muted-foreground group-hover:text-background/70 m-0 transition-colors duration-[240ms]">{it.b}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-foreground font-display font-black text-[clamp(28px,3.6vw,56px)] leading-tight tracking-h3 text-foreground text-balance max-w-[24ch]">
        Old models cannot handle this complexity. <span className="text-primary">A new layer is required.</span>
      </div>
    </section>
  )
}
