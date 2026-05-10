import { Metadata } from 'next'
import Link from 'next/link'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const metadata: Metadata = {
  title: 'Oversight by Comcorpᵉ — Enterprise Growth',
  description: 'AI systems break. Growth requires expert human oversight. We provide the talent that guides and drives enterprise growth engines.',
}

export default function EnterprisePage() {
  return (
    <div className="bg-paper min-h-screen">
      
      {/* Hero Section */}
      <section className="px-6 md:px-24 pt-16 md:pt-24 pb-20 border-b border-ink">
        <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-12 flex items-center gap-3">
          <span className="w-2 h-2 bg-blue rounded-full" />
          Comcorpᵉ / Enterprise
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24 items-start">
          <div>
            <h1 className="font-display font-black text-[clamp(64px,8vw,120px)] leading-[0.88] tracking-[-0.03em] text-ink m-0 mb-8">
              Oversight<span className="text-blue">.</span>
            </h1>
            <div className="font-mono text-[13px] text-ink-60 uppercase tracking-widest mb-4">
              The Missing Layer: Human Judgment
            </div>
            <p className="font-text text-[22px] leading-lede text-ink-80 max-w-[34ch]">
              Technology is a commodity. Generic AI models are powerful, but they don't know how complex markets actually work. AI systems break. 
              <br /><br />
              Enterprise growth requires expert human talent to guide, drive, and course-correct the technology. We provide the Oversight.
            </p>
            <div className="mt-12 flex gap-4">
              <Link
                href="/book"
                className="font-text text-sm font-semibold px-6 py-3.5 bg-blue text-white rounded-full inline-flex items-center gap-2.5 hover:bg-blue-hover transition-colors duration-[120ms]"
              >
                Book a session call
              </Link>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-px bg-ink border border-ink mt-8 lg:mt-0">
            {[
              { label: 'Markets Covered', value: '20+' },
              { label: 'Specialist Pods', value: '17' },
              { label: 'Strategic Plays', value: '50+' },
              { label: 'Growth Engines', value: 'Active' },
            ].map((stat, i) => (
              <div key={i} className="bg-paper p-8 flex flex-col justify-center min-h-[160px]">
                <div className="font-display font-black text-[clamp(32px,4vw,48px)] tracking-[-0.02em] text-ink leading-none mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-ink-60 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Timeline */}
      <section className="px-6 md:px-24 py-24 border-b border-ink">
        <div className="max-w-[42ch] mb-20">
          <h2 className="font-display font-black text-[clamp(40px,5vw,64px)] leading-tight tracking-[-0.02em] text-ink mb-6">
            Build growth engines designed for your enterprise.
          </h2>
          <p className="font-text text-[18px] leading-relaxed text-ink-60">
            Weeks, not years. We convert your commercial logic, data, and workflows into functioning systems—managed and overseen by our specialist operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-px md:bg-ink md:border md:border-ink">
          {[
            {
              time: 'Phase 01',
              title: 'Absorb organizational context',
              desc: 'We map your commercial logic, ingest company data, and conduct expert-led diagnostics to build an operational baseline.',
            },
            {
              time: 'Phase 02',
              title: 'Assemble the engine',
              desc: 'Turn the commercial strategy into programmatically defined workflows, utilizing AI frameworks wrapped in strict quality guardrails.',
            },
            {
              time: 'Phase 03',
              title: 'Deploy specialist pods',
              desc: 'Technology is handed over to curated human operators. We deploy specialist pods to oversee the system in real-time.',
            },
            {
              time: 'Phase 04+',
              title: 'Iterate & Oversite',
              desc: 'Catch system failures. Feed human-driven corrections back into the engine, compounding accuracy and revenue over time.',
            },
          ].map((step, i) => (
            <div key={i} className="bg-paper md:p-8 flex flex-col">
              <div className="font-mono text-[11px] text-blue uppercase tracking-widest mb-6">
                {step.time}
              </div>
              <div className="font-display font-black text-[22px] leading-tight tracking-[-0.01em] text-ink mb-4">
                {step.title}
              </div>
              <p className="font-text text-[15px] leading-relaxed text-ink-60 m-0">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Oversight Matters */}
      <section className="px-6 md:px-24 py-24 bg-ink text-paper">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 mb-20">
          <div>
            <h2 className="font-display font-black text-[clamp(40px,5vw,72px)] leading-[0.92] tracking-[-0.02em] text-paper mb-8">
              Enterprise growth doesn't fail from weak technology.
            </h2>
            <h3 className="font-display font-black text-[clamp(32px,4vw,48px)] leading-[0.92] tracking-[-0.02em] text-blue">
              It fails from a lack of Oversight.
            </h3>
          </div>
          <div className="flex flex-col justify-end">
            <p className="font-text text-[19px] leading-relaxed text-paper/70 max-w-[40ch]">
              We built this system because pure technology deployments collapse when faced with the nuances of emerging markets. Every deployment we run is supported by world-class strategic talent and on-the-ground operational oversight.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-paper/20 border border-paper/20">
          {[
            {
              title: 'Rapid system iteration',
              desc: 'Human experts quickly identify gaps in automated performance and optimize workflows in tight feedback loops.',
            },
            {
              title: 'Eliminate silent failures',
              desc: 'We surface edge cases and contextual errors with clear paths for human correction—no more invisible mistakes compounding.',
            },
            {
              title: 'Safe deployment',
              desc: 'Expert guardrails and strict observability de-risk technology deployment in high-stakes commercial environments.',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-ink p-8 md:p-12">
              <div className="font-mono text-[13px] text-blue mb-4">0{i+1}.</div>
              <div className="font-display font-black text-[24px] leading-tight tracking-[-0.01em] text-paper mb-4">
                {feature.title}
              </div>
              <p className="font-text text-[16px] leading-relaxed text-paper/60 m-0">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 md:px-24 py-24 border-b border-ink">
        <div className="mb-16">
          <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-ink-60 inline-block" />
            Use Cases
          </div>
          <h2 className="font-display font-black text-[clamp(40px,5vw,64px)] leading-tight tracking-[-0.02em] text-ink max-w-[20ch]">
            Suited for every complex workflow.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink border border-ink">
          {[
            { title: 'Commercial Strategy', desc: 'Oversee complex go-to-market motions, dynamic pricing models, and competitive positioning with real-time market feedback.' },
            { title: 'Market Entry', desc: 'De-risk expansion into new territories with hybrid engines that combine local human intelligence with scaled data scraping.' },
            { title: 'Revenue Operations', desc: 'Monitor and optimize the entire revenue pipeline, catching leakage that automated CRM logic misses.' },
            { title: 'Brand Orchestration', desc: 'Ensure automated campaigns and content generation remain aligned with nuanced cultural sentiment and brand safety.' },
          ].map((uc, i) => (
            <div key={i} className="bg-paper p-8 md:p-12 group hover:bg-blue/[0.02] transition-colors">
              <div className="font-display font-black text-[28px] leading-tight tracking-[-0.01em] text-ink mb-4 group-hover:text-blue transition-colors">
                {uc.title}
              </div>
              <p className="font-text text-[16px] leading-relaxed text-ink-60 m-0 max-w-[40ch]">
                {uc.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-24 py-24 bg-ink-10 text-center flex flex-col items-center">
        <h2 className="font-display font-black text-[clamp(40px,5vw,64px)] leading-tight tracking-[-0.02em] text-ink mb-6 max-w-[24ch]">
          Ready to empower your enterprise with human oversight?
        </h2>
        <p className="font-text text-[18px] leading-relaxed text-ink-60 mb-10 max-w-[42ch]">
          From initial discovery to production-grade growth engines delivering measurable ROI in 4–6 weeks.
        </p>
        <Link
          href="/book"
          className="font-text text-[15px] font-semibold px-8 py-4 bg-blue text-white rounded-full hover:bg-blue-hover transition-colors duration-[120ms]"
        >
          Get in touch with Oversight
        </Link>
      </section>

    </div>
  )
}
