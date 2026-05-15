import { Metadata } from 'next'
import { leadership, advisors } from '@/lib/people'

export const metadata: Metadata = {
  title: 'About Us — Comcorpᵉ',
  description: 'The people behind Comcorpᵉ — founding leadership and advisory network.',
}

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-0">

        {/* Page header */}
        <div className="mb-16 md:mb-24 border-b border-foreground pb-14 md:pb-20">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-muted-foreground inline-block" />
            About Comcorpᵉ
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
            <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-foreground m-0 text-balance">
              Named, credible<br />
              <span className="text-primary">people.</span>
            </h1>
            <p className="font-text text-[18px] leading-lede text-muted-foreground max-w-[36ch] md:mb-2">
              Comcorpᵉ assembles modular capability. The leadership and board provide
              the institutional spine — strategic counsel, geographic reach, and sector depth.
            </p>
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-baseline gap-6 mb-10">
            <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-foreground inline-block" />
              Founding Team
            </span>
            <span className="font-mono text-xs text-muted-foreground/70 ml-auto">01 / 02</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-foreground">
            {leadership.map((p, i) => (
              <div
                key={i}
                className={`p-8 md:p-12 flex flex-col gap-6 ${i < leadership.length - 1 ? 'border-b md:border-b-0 md:border-r border-foreground' : ''}`}
              >
                <div className="w-full aspect-[4/5] bg-border border border-border flex items-center justify-center group-hover:border-foreground transition-colors duration-300">
                  <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest italic">Portrait Placeholder</span>
                </div>
                <div>
                  <div className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground/70 mb-3">{p.title}</div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-display font-black text-[clamp(32px,3.5vw,52px)] leading-tight tracking-h3 text-foreground">{p.name}</div>
                    {p.linkedin && (
                      <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] tracking-widest uppercase text-primary hover:text-foreground transition-colors">
                        IN ↗
                      </a>
                    )}
                  </div>
                </div>
                <p className="font-text text-[17px] leading-relaxed text-muted-foreground m-0 max-w-[32ch]">{p.bio}</p>
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
                  {p.tags.map(t => (
                    <span key={t} className="font-mono text-[11px] tracking-[0.06em] uppercase text-foreground px-2.5 py-1.5 border border-input">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Network */}
        <div id="advisors" className="mb-0">
          <div className="flex items-baseline gap-6 mb-10">
            <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-foreground inline-block" />
              Advisory Network
            </span>
            <span className="font-mono text-xs text-muted-foreground/70 ml-auto">02 / 02</span>
          </div>

          <p className="font-text text-[17px] leading-relaxed text-muted-foreground max-w-[52ch] mb-12">
            The network brings pedigree, perspective and access across three continents.
            Deep technical expertise combined with strategic leadership in global markets.
          </p>

          <div className="grid grid-cols-1 gap-px bg-foreground border border-foreground">
            {advisors.map((m, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[200px_1.5fr_2.5fr] gap-8 lg:gap-16 px-8 md:px-12 py-10 md:py-14 bg-background"
              >
                <div className="w-full aspect-square md:aspect-[4/5] bg-border border border-border flex items-center justify-center group-hover:border-foreground transition-colors duration-300">
                  <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest italic">Portrait</span>
                </div>
                <div>
                  <div className="font-mono text-[11px] tracking-eyebrow uppercase text-primary mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {m.geo}
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="font-display font-black text-[clamp(28px,3vw,42px)] leading-tight tracking-h3 text-foreground">{m.name}</div>
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] tracking-widest uppercase text-primary hover:text-foreground transition-colors mt-1">
                        IN ↗
                      </a>
                    )}
                  </div>
                  <div className="font-mono text-[12px] tracking-widest uppercase text-muted-foreground/70">{m.title}</div>
                </div>
                <div className="font-text text-[16px] leading-relaxed text-muted-foreground space-y-4 max-w-[72ch]">
                  {m.fullBio.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <div className="h-24 md:h-32" />
    </div>
  )
}
