import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Provocation — Comcorpᵉ',
  description: 'Growth is the most mismanaged function in emerging markets. We treat growth as architecture, not effort.',
}

export default function ProvocationPage() {
  const insights = [
    'Strategy exists without execution',
    'Execution exists without coherence',
    'Talent exists without orchestration',
    'Opportunities exist without structure',
  ]

  return (
    <div className="bg-background">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-24">
        
        {/* Page header */}
        <div className="mb-16 md:mb-24 border-b border-foreground pb-14 md:pb-20">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-muted-foreground inline-block" />
            The Provocation
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
            <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-foreground m-0 text-balance">
              Growth is the most <br />
              <span className="text-primary">mismanaged</span> function.
            </h1>
            <p className="font-text text-[18px] leading-lede text-muted-foreground max-w-[36ch] md:mb-2">
              Across emerging markets, growth is treated as effort rather than architecture. 
              We are here to rewire that assumption.
            </p>
          </div>
          <div className="relative mt-12 md:mt-16 aspect-[16/7] w-full overflow-hidden border border-foreground">
            <Image src="/images/site/Coiled Serpent _ Strategy 1.png" alt="" fill className="object-cover grayscale" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 border border-foreground overflow-hidden rounded-sm">
          <div className="p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-foreground">
            <div className="font-mono text-xs text-muted-foreground mb-6 uppercase tracking-widest">The Diagnosis</div>
            <div className="font-display font-black text-[clamp(32px,4vw,52px)] leading-tight tracking-h3 mb-10 text-foreground">Growth is not treated as a system.</div>
            <ul className="list-none p-0 m-0 flex flex-col">
              {insights.map((b, i) => (
                <li key={i} className="py-6 border-b border-border grid grid-cols-[40px_1fr] gap-4 font-text text-[17px] leading-relaxed text-foreground last:border-b-0">
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}/</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 md:p-16 bg-foreground text-background flex flex-col">
            <div className="font-mono text-xs text-background/60 mb-6 uppercase tracking-widest">The Result</div>
            <div className="font-display font-black text-[clamp(32px,4vw,52px)] leading-tight tracking-h3 text-background mb-10">
              Reactive. Fragmented. Non-compounding.
            </div>
            <p className="font-text text-[19px] leading-relaxed text-background/70 m-0 max-w-[42ch]">
              Across markets, growth is delivered as disconnected interventions: a campaign here,
              a hire there, a deck somewhere else. Each cycle starts from zero. Knowledge does not
              accumulate. Outcomes do not compound.
            </p>
            <div className="mt-16 p-8 bg-primary text-white font-display font-black text-[26px] tracking-[-0.02em] leading-snug">
              We treat growth as architecture, not effort.
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 md:h-32" />
    </div>
  )
}
