import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { insights } from '@/lib/insights'

export const metadata: Metadata = {
  title: 'Insights — Comcorpᵉ',
  description: 'Pan-African telecoms and fintech insights for market growth systems.',
}

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-24 md:pb-40">
        <div className="mb-16 md:mb-24 border-b border-ink pb-14 md:pb-20">
          <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-ink-60 inline-block" />
            Insights
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
            <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-ink m-0 text-balance">
              Pan-African<br />
              <span className="text-blue">market signals.</span>
            </h1>
            <p className="font-text text-[18px] leading-lede text-ink-60 max-w-[36ch] md:mb-2">
              Insights on the telecoms, fintech, and trust systems shaping financial access
              and mobile-led growth across Africa.
            </p>
          </div>
          <Image
            src="/images/site/insights.png"
            alt="Pan-African market insights"
            width={1248}
            height={832}
            priority
            sizes="(min-width: 768px) calc(100vw - 12rem), calc(100vw - 3rem)"
            className="mt-12 md:mt-16 h-auto w-full border border-ink-10 object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink border border-ink overflow-hidden rounded-sm">
          {insights.map((insight, index) => (
            <Link
              key={insight.slug}
              href={`/insights/${insight.slug}`}
              className="group p-8 md:p-10 bg-paper hover:bg-blue/[0.03] transition-all duration-300 flex flex-col min-h-[340px]"
            >
              <div className="flex items-center justify-between gap-6 mb-10">
                <span className="font-mono text-xs text-ink-40 uppercase tracking-widest">
                  0{index + 1}
                </span>
                <span className="font-mono text-[10px] text-blue uppercase tracking-eyebrow border border-blue px-2 py-1">
                  {insight.meta}
                </span>
              </div>
              <div className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-4">
                {insight.eyebrow}
              </div>
              <h2 className="font-display font-black text-[30px] md:text-[38px] leading-tight tracking-h3 text-ink group-hover:text-blue transition-colors duration-300 mb-6">
                {insight.title}
              </h2>
              <p className="font-text text-[15px] leading-relaxed text-ink-60 m-0 mb-auto">
                {insight.description}
              </p>
              <div className="mt-12 font-mono text-xs text-blue flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                Read sourced note <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
