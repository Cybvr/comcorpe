import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Why Comcorpᵉ — A Growth Systems Company',
  description: 'We orchestrate data, creativity, technology, and strategy into unified growth systems built to perform in complex markets.',
}

export default function WhyPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-24">
        
        {/* Page header */}
        <div className="mb-16 md:mb-24 border-b border-ink pb-14 md:pb-20">
          <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-ink-60 inline-block" />
            Why Comcorpᵉ
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
            <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-ink m-0 text-balance">
              Designed for<br />
              <span className="text-blue">complexity.</span>
            </h1>
            <p className="font-text text-[18px] leading-lede text-ink-60 max-w-[36ch] md:mb-2">
              Emerging markets don't reward standard playbooks. They reward systems that can adapt, scale, and execute flawlessly amidst friction.
            </p>
          </div>
        </div>

        {/* Feature 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24 md:mb-32 items-center">
          <div className="order-2 md:order-1">
            <div className="font-mono text-[13px] text-blue mb-4">01.</div>
            <h2 className="font-display font-black text-[32px] md:text-[48px] leading-tight tracking-h3 text-ink mb-6">
              Structural Advantage
            </h2>
            <p className="font-text text-[18px] leading-relaxed text-ink-60 max-w-[40ch]">
              We bypass the traditional agency and consultancy models by building bespoke, high-velocity specialist pods. This gives us the structural advantage to move faster and hit harder without the overhead drag.
            </p>
          </div>
          <div className="order-1 md:order-2 w-full aspect-[4/3] bg-ink-10 border border-ink-10 flex items-center justify-center transition-colors duration-300 hover:border-ink">
            <span className="font-mono text-[11px] text-ink-40 uppercase tracking-widest italic">Structural Model Visualization Placeholder</span>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24 md:mb-32 items-center">
          <div className="w-full aspect-[4/3] bg-ink-10 border border-ink-10 flex items-center justify-center transition-colors duration-300 hover:border-ink">
            <span className="font-mono text-[11px] text-ink-40 uppercase tracking-widest italic">Execution Engine Visualization Placeholder</span>
          </div>
          <div>
            <div className="font-mono text-[13px] text-blue mb-4">02.</div>
            <h2 className="font-display font-black text-[32px] md:text-[48px] leading-tight tracking-h3 text-ink mb-6">
              Execution as Architecture
            </h2>
            <p className="font-text text-[18px] leading-relaxed text-ink-60 max-w-[40ch]">
              Strategy is only as good as its implementation. We don't hand over decks; we engineer the execution architecture to ensure that every opportunity is captured and measurable.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-12 items-center">
          <div className="order-2 md:order-1">
            <div className="font-mono text-[13px] text-blue mb-4">03.</div>
            <h2 className="font-display font-black text-[32px] md:text-[48px] leading-tight tracking-h3 text-ink mb-6">
              Compounding Value
            </h2>
            <p className="font-text text-[18px] leading-relaxed text-ink-60 max-w-[40ch]">
              Every engagement with Comcorpᵉ is designed to produce a reusable asset. We turn transient project knowledge into institutional capability that belongs to you.
            </p>
          </div>
          <div className="order-1 md:order-2 w-full aspect-[4/3] bg-ink-10 border border-ink-10 flex items-center justify-center transition-colors duration-300 hover:border-ink">
            <span className="font-mono text-[11px] text-ink-40 uppercase tracking-widest italic">Value Compounding Visualization Placeholder</span>
          </div>
        </div>

      </div>
      <div className="h-24 md:h-32" />
    </div>
  )
}
