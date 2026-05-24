import { Metadata } from 'next'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import { services } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Arenas — Comcorpᵉ',
  description: 'Concentration over coverage. Three arenas, anchored in Pan-Africa. We align with growth, not just activity.',
}

export default function ArenasPage() {

  const rungs = [
    { n: '01', l: 'Retainers', d: 'System oversight and ongoing orchestration', r: 'Recurring' },
    { n: '02', l: 'Project Fees', d: 'Builds and execution sprints', r: 'Milestone' },
    { n: '03', l: 'Success Fees', d: 'Performance-linked outcomes', r: 'Variable' },
    { n: '04', l: 'Equity Participation', d: 'Selective, high-conviction partnerships', r: 'Aligned' },
  ]

  return (
    <div className="bg-background min-h-screen">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-24">
        
        {/* Page header */}
        <div className="mb-16 md:mb-24 border-b border-foreground pb-14 md:pb-20">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-muted-foreground inline-block" />
            Where We Play
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
            <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-foreground m-0 text-balance">
              Concentration over <br />
              <span className="text-primary">coverage.</span>
            </h1>
            <p className="font-text text-[18px] leading-lede text-muted-foreground max-w-[36ch] md:mb-2">
              We focus on three specific arenas where our model delivers the highest impact. 
              Anchored in Pan-Africa, reaching global markets.
            </p>
          </div>
          <ImagePlaceholder
            label="Arenas image placeholder"
            className="mt-12 md:mt-16 aspect-[16/7] w-full"
          />
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="flex flex-col gap-px bg-foreground border border-foreground overflow-hidden">
            {services.map((a, i) => (
              <div
                key={a.id}
                className="group p-8 md:p-12 bg-background hover:bg-foreground transition-colors duration-[240ms] cursor-default"
              >
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-mono text-xs text-primary shrink-0">0{i+1}.</span>
                  <h2 className="font-display font-black text-[clamp(26px,2.8vw,40px)] tracking-[-0.025em] leading-tight text-foreground group-hover:text-background transition-colors duration-[240ms]">{a.t}</h2>
                </div>
                <p className="font-text text-[17px] leading-relaxed text-muted-foreground group-hover:text-background/70 mb-8 max-w-[44ch] transition-colors duration-[240ms]">{a.s}</p>
                <div className="flex flex-wrap gap-2">
                  {a.tags.map(t => (
                    <span key={t} className="font-mono text-[11px] tracking-[0.08em] uppercase text-foreground group-hover:text-background px-2.5 py-1.5 border border-input group-hover:border-background/30 transition-colors duration-[240ms]">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-32 h-fit">
            <ImagePlaceholder
              label="Pan-Africa network image placeholder"
              className="mb-10 aspect-[4/3] w-full"
            />
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-[0.08em] mb-6">Business Model</div>
            <div className="font-display font-black text-[clamp(32px,3.5vw,52px)] tracking-h3 leading-tight text-foreground mb-10">We align with growth, not activity.</div>
            <div className="flex flex-col border-t border-foreground">
              {rungs.map((r, i) => (
                <div key={r.n} className="grid grid-cols-[40px_1fr_auto] gap-5 py-7 border-b border-border items-baseline">
                  <span className="font-mono text-xs text-muted-foreground/70">{r.n}</span>
                  <div>
                    <div className="font-display font-black text-[24px] tracking-[-0.02em] text-foreground">{r.l}</div>
                    <div className="font-text text-[16px] text-muted-foreground mt-1.5">{r.d}</div>
                  </div>
                  <span className="font-mono text-[11px] text-primary uppercase tracking-[0.08em] border border-primary px-2 py-1 h-fit">{r.r}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-foreground text-background grid grid-cols-[1fr_auto] items-center gap-8">
              <div>
                <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-background/60 mb-2">Primary Region</div>
                <div className="font-display font-black text-[24px] tracking-[-0.02em] text-background">Pan-Africa</div>
              </div>
              <div className="font-mono text-[12px] text-background/60 flex items-center gap-2">
                <span className="text-primary font-bold text-xl">→</span> 
                Global mandates via network
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 md:h-32" />
    </div>
  )
}
