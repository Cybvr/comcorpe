import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import { cases, getCaseBySlug } from '@/lib/cases'

export function generateStaticParams() {
  return cases.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const c = getCaseBySlug(slug)
  if (!c) return {}
  return {
    title: `${c.title} — ${c.solution} — Comcorpᵉ`,
    description: c.lede,
  }
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getCaseBySlug(slug)
  if (!c) notFound()

  return (
    <div className="bg-background">

      {/* Hero */}
      <div className="px-6 md:px-24 pt-14 md:pt-20 pb-16 md:pb-24 border-b border-foreground">
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Link href="/case-studies" className="font-mono text-xs text-muted-foreground/70 hover:text-primary transition-colors duration-[120ms]">
            Case Studies
          </Link>
          <span className="font-mono text-xs text-input">/</span>
          <span className="font-mono text-xs text-muted-foreground/70 uppercase tracking-eyebrow">{c.number}</span>
          <span className="w-px h-3 bg-input inline-block" />
          <span className="font-mono text-[11px] text-primary uppercase tracking-eyebrow border border-primary px-2 py-1">
            Solution / {c.solution}
          </span>
          <span className="font-mono text-xs text-muted-foreground/70 uppercase tracking-eyebrow">{c.arena}</span>
        </div>

        <h1 className="font-display font-black text-[clamp(64px,9vw,144px)] leading-[0.88] tracking-hero text-foreground m-0">
          {c.title}<span className="text-primary">.</span>
        </h1>

        <ImagePlaceholder
          label={`${c.title} case study image placeholder`}
          className="mt-10 md:mt-14 aspect-[16/7] w-full"
        />

        <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-8 md:gap-24 items-end">
          <div className="flex flex-col gap-6">
            <div>
              <div className="font-mono text-[11px] text-muted-foreground/70 uppercase tracking-eyebrow mb-2">The Solution</div>
              <div className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground">{c.solution}</div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-muted-foreground/70 uppercase tracking-eyebrow mb-2">The Client</div>
              <p className="font-text text-[16px] leading-relaxed text-muted-foreground m-0">
                {c.client.description}
              </p>
            </div>
          </div>
          <blockquote className="m-0 pl-6 border-l-2 border-primary">
            <p className="font-display font-black text-[clamp(20px,2.4vw,30px)] leading-tight tracking-[-0.02em] text-foreground m-0 text-balance italic">
              &ldquo;{c.problem}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* What Comcorpᵉ Did */}
      <div className="px-6 md:px-24 py-16 md:py-24 border-b border-foreground">
        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-eyebrow mb-12 inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-muted-foreground/70 inline-block" />
          What Comcorpᵉ Did
        </div>

        <div className="flex flex-col">
          {c.phases.map((phase, i) => (
            <div
              key={phase.label}
              className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-16 py-10 md:py-14 border-t border-border first:border-t-0"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-primary uppercase tracking-eyebrow">0{i + 1}</span>
                <span className="font-display font-black text-[32px] md:text-[40px] leading-none tracking-h3 text-foreground">
                  {phase.label}
                </span>
              </div>
              <p className="font-text text-[17px] md:text-[19px] leading-relaxed text-muted-foreground m-0 max-w-[56ch] md:pt-1">
                {phase.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Outcome */}
      <div className="bg-foreground dark-inv-section">
        <div className="px-6 md:px-24 py-16 md:py-24 border-b border-background/[0.12]">
          <div className="font-mono text-xs text-background/50 uppercase tracking-eyebrow mb-10 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-background/50 inline-block" />
            The Outcome
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:border md:border-background/[0.16] mb-14">
                {c.outcome.stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex flex-col gap-2 md:p-8 ${i < c.outcome.stats.length - 1 ? 'md:border-r md:border-background/[0.16]' : ''}`}
                  >
                    <span className="font-display font-black text-[clamp(36px,4.5vw,64px)] leading-none tracking-[-0.04em] text-background">
                      {s.value}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-eyebrow text-background/50">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="font-text text-[18px] md:text-[22px] leading-lede text-background/80 m-0 max-w-[52ch]">
                {c.outcome.summary}
              </p>
            </div>

            <ImagePlaceholder
              label="Outcome image placeholder"
              className="aspect-[4/3] w-full"
              tone="dark"
            />
          </div>
        </div>

        <div className="px-6 md:px-24 py-12 md:py-16 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div>
            <div className="font-mono text-xs text-background/40 uppercase tracking-eyebrow mb-2">Build your own playbook</div>
            <p className="font-text text-[16px] text-background/60 m-0 max-w-[36ch]">
              Every engagement Comcorpᵉ runs produces a documented, reusable asset — owned by you.
            </p>
          </div>
          <Link
            href="/book"
            className="font-text text-sm font-semibold px-6 py-3.5 bg-primary text-white hover:bg-primary/85 transition-colors duration-[120ms] inline-flex items-center gap-2.5 whitespace-nowrap"
          >
            Book a session call
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

    </div>
  )
}
