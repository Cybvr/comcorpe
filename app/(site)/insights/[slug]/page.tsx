import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getInsightBySlug, insights } from '@/lib/insights'

export function generateStaticParams() {
  return insights.map(insight => ({ slug: insight.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const insight = getInsightBySlug(slug)
  if (!insight) return {}

  return {
    title: `${insight.title} — Insights — Comcorpᵉ`,
    description: insight.description,
  }
}

function SourceRefs({ refs }: { refs: number[] }) {
  return (
    <sup className="ml-2 inline-flex gap-1 align-super">
      {refs.map(ref => (
        <a
          key={ref}
          href={`#source-${ref}`}
          className="font-mono text-[10px] text-primary hover:underline"
        >
          [{ref}]
        </a>
      ))}
    </sup>
  )
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const insight = getInsightBySlug(slug)
  if (!insight) notFound()

  return (
    <div className="bg-background">
      <div className="px-6 md:px-24 pt-14 md:pt-20 pb-16 md:pb-24 border-b border-foreground">
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Link href="/insights" className="font-mono text-xs text-muted-foreground/70 hover:text-primary transition-colors duration-[120ms]">
            Insights
          </Link>
          <span className="font-mono text-xs text-input">/</span>
          <span className="font-mono text-xs text-muted-foreground/70 uppercase tracking-eyebrow">{insight.eyebrow}</span>
          <span className="w-px h-3 bg-input inline-block" />
          <span className="font-mono text-[11px] text-primary uppercase tracking-eyebrow border border-primary px-2 py-1">
            {insight.meta}
          </span>
        </div>

        <h1 className="font-display font-black text-[clamp(56px,8vw,124px)] leading-[0.9] tracking-hero text-foreground m-0 max-w-[12ch]">
          {insight.title}
        </h1>

        <Image
          src="/images/site/insights.png"
          alt={`${insight.eyebrow} market insight`}
          width={1248}
          height={832}
          priority
          sizes="(min-width: 768px) calc(100vw - 12rem), calc(100vw - 3rem)"
          className="mt-10 md:mt-14 h-auto w-full border border-border object-cover"
        />

        <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-[4fr_8fr] gap-8 md:gap-24 items-start">
          <div>
            <div className="font-mono text-[11px] text-muted-foreground/70 uppercase tracking-eyebrow mb-2">Sector Signal</div>
            <div className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground">{insight.meta}</div>
          </div>
          <p className="font-text text-[20px] md:text-[24px] leading-lede text-muted-foreground m-0 max-w-[52ch]">
            {insight.lede}
          </p>
        </div>
      </div>

      <div className="px-6 md:px-24 py-16 md:py-24 border-b border-foreground">
        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-eyebrow mb-12 inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-muted-foreground/70 inline-block" />
          Reading the Signal
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-12 lg:gap-20">
          <div className="flex flex-col gap-6">
            {insight.thesis.map(paragraph => (
              <p key={paragraph} className="font-text text-[17px] leading-relaxed text-muted-foreground m-0">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-col border-t border-foreground">
            {insight.signals.map((signal, index) => (
              <div key={signal.title} className="grid grid-cols-1 md:grid-cols-[96px_1fr] gap-5 md:gap-8 py-8 md:py-10 border-b border-border">
                <span className="font-mono text-xs text-primary uppercase tracking-eyebrow">0{index + 1}</span>
                <div>
                  <h2 className="font-display font-black text-[26px] md:text-[34px] leading-tight tracking-h3 text-foreground m-0 mb-4">
                    {signal.title}
                  </h2>
                  <p className="font-text text-[16px] md:text-[18px] leading-relaxed text-muted-foreground m-0">
                    {signal.body}
                    <SourceRefs refs={signal.refs} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-foreground dark-inv-section">
        <div className="px-6 md:px-24 py-16 md:py-24 border-b border-background/[0.12]">
          <div className="font-mono text-xs text-background/50 uppercase tracking-eyebrow mb-10 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-background/50 inline-block" />
            Operating Implications
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-background/[0.16]">
            {insight.implications.map((implication, index) => (
              <div
                key={implication}
                className={`p-7 md:p-8 ${index < insight.implications.length - 1 ? 'border-b md:border-b-0 md:border-r border-background/[0.16]' : ''}`}
              >
                <div className="font-mono text-xs text-primary uppercase tracking-eyebrow mb-6">0{index + 1}</div>
                <p className="font-display font-black text-[24px] md:text-[30px] leading-tight tracking-h3 text-background m-0">
                  {implication}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 md:px-24 py-14 md:py-18">
          <div className="font-mono text-xs text-background/50 uppercase tracking-eyebrow mb-8 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-background/50 inline-block" />
            Footnotes
          </div>

          <ol className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            {insight.sources.map((source, index) => (
              <li key={source.href} id={`source-${index + 1}`} className="grid grid-cols-[32px_1fr] gap-4 scroll-mt-24">
                <span className="font-mono text-xs text-background/40">[{index + 1}]</span>
                <a
                  href={source.href}
                  className="font-text text-sm leading-relaxed text-background/70 hover:text-primary transition-colors duration-[120ms]"
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.publisher}, <span className="italic">{source.title}</span> ({source.year})
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
