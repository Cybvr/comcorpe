import Link from 'next/link'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import { cases } from '@/lib/cases'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies — Comcorpᵉ',
  description: 'How Comcorpᵉ architects and executes growth for clients in complex markets.',
}

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-24 md:pb-40">

        {/* Page header */}
        <div className="mb-16 md:mb-24 border-b border-ink pb-14 md:pb-20">
          <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-ink-60 inline-block" />
            Case Studies
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
            <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-ink m-0 text-balance">
              Work that<br />
              <span className="text-blue">compounds.</span>
            </h1>
            <p className="font-text text-[18px] leading-lede text-ink-60 max-w-[36ch] md:mb-2">
              Each engagement is documented as a reusable asset — for the client and for us.
              These are the cases that shaped the model.
            </p>
          </div>
          <ImagePlaceholder
            label="Case studies image placeholder"
            className="mt-12 md:mt-16 aspect-[16/7] w-full"
          />
        </div>

        {/* Case list */}
        <div className="flex flex-col gap-0">
          {cases.map((c) => (
            <Link
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="group grid grid-cols-1 md:grid-cols-[220px_1.6fr_0.9fr] gap-8 md:gap-12 py-12 md:py-14 border-b border-ink-10 hover:bg-ink-10/40 transition-colors duration-[120ms] -mx-6 md:-mx-24 px-6 md:px-24"
            >
              {/* Left: number + arena */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow">{c.number}</span>
                  <span className="font-mono text-[11px] text-blue uppercase tracking-eyebrow border border-blue px-2 py-1 w-fit">
                    {c.arena}
                  </span>
                </div>
                <ImagePlaceholder
                  label={`${c.title} case image placeholder`}
                  className="aspect-[4/3] w-full"
                />
              </div>

              {/* Centre: title + lede */}
              <div className="flex flex-col gap-3">
                <h2 className="font-display font-black text-[clamp(28px,3.5vw,48px)] leading-tight tracking-h3 text-ink m-0 group-hover:text-blue transition-colors duration-[120ms]">
                  {c.title}
                </h2>
                <p className="font-text text-[15px] leading-relaxed text-ink-60 m-0 max-w-[48ch]">
                  {c.lede}
                </p>
              </div>

              {/* Right: outcome stats + arrow */}
              <div className="flex flex-col gap-6 md:items-end md:text-right">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-3">
                  {c.outcome.stats.slice(0, 3).map(s => (
                    <div key={s.label}>
                      <div className="font-display font-black text-[26px] tracking-[-0.03em] leading-none text-ink">
                        {s.value}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-60 mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
                <span className="font-mono text-xs text-blue inline-flex items-center gap-1.5 group-hover:gap-3 transition-all duration-[200ms]">
                  Read case <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* More coming callout */}
        <div className="mt-20 pt-12 border-t border-ink-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div>
            <div className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-2">Coming soon</div>
            <p className="font-text text-[17px] text-ink-60 m-0 max-w-[40ch]">
              Cases 02 and 03 are in the pipeline — covering growth stagnation and opportunity creation.
            </p>
          </div>
          <Link
            href="/book"
            className="font-text text-sm font-semibold px-6 py-3.5 bg-ink text-paper hover:bg-blue transition-colors duration-[120ms] inline-flex items-center gap-2.5 whitespace-nowrap"
          >
            Become a case study
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </Link>
        </div>

      </div>
    </div>
  )
}
