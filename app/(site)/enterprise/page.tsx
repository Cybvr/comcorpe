import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Oversight by Comcorpᵉ — Enterprise AI Management',
  description: 'Enterprise AI requires human judgment. We provide the organizational transformation, human capital, and strategic advisory to oversee your AI deployments.',
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
              The Missing Layer for Enterprise AI
            </div>
            <p className="font-text text-[22px] leading-lede text-ink-80 max-w-[34ch]">
              Enterprises are rushing to deploy AI. But generic models don't understand the nuances of complex markets, and isolated technology cannot drive a business. AI systems break.
              <br /><br />
              Enterprise AI requires human judgment. We provide the strategic advisory, organizational transformation, human capital, and marketing services required to oversee, guide, and correct your AI systems in real-time.
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
              { label: 'African Markets', value: '20+' },
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
            Safely integrate AI into your enterprise.
          </h2>
          <p className="font-text text-[18px] leading-relaxed text-ink-60">
            Technology alone is a liability. We convert your enterprise AI ambitions into functioning growth engines—managed, structured, and overseen by our specialist operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-px md:bg-ink md:border md:border-ink">
          {[
            {
              time: 'Phase 01',
              title: 'Strategic Advisory',
              desc: 'We map your commercial workflows, identify where AI can safely generate value, and establish the baseline for human oversight.',
            },
            {
              time: 'Phase 02',
              title: 'Organizational Transformation',
              desc: 'We restructure your enterprise operations to safely integrate AI, defining strict quality guardrails and feedback loops.',
            },
            {
              time: 'Phase 03',
              title: 'Human Capital & Tech',
              desc: 'We deploy specialist pods. Expert human operators step in to oversee the AI models in real-time, catching errors before they compound.',
            },
            {
              time: 'Phase 04+',
              title: 'Marketing & Comm.',
              desc: 'Scale your output safely. We ensure automated campaigns and communications retain human nuance, cultural context, and brand safety.',
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
              Enterprise AI doesn't fail from weak models.
            </h2>
            <h3 className="font-display font-black text-[clamp(32px,4vw,48px)] leading-[0.92] tracking-[-0.02em] text-blue">
              It fails from a lack of Oversight.
            </h3>
          </div>
          <div className="flex flex-col justify-end">
            <p className="font-text text-[19px] leading-relaxed text-paper/70 max-w-[40ch]">
              We built this model because pure technology deployments collapse when faced with the nuances of emerging markets. Every AI system we integrate across Africa is supported by world-class strategic advisory and on-the-ground human oversight.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-paper/20 border border-paper/20">
          {[
            {
              title: 'Rapid system iteration',
              desc: 'Our human experts quickly identify gaps in AI performance and optimize workflows in tight feedback loops.',
            },
            {
              title: 'Eliminate silent failures',
              desc: 'We surface edge cases and contextual hallucinations with clear paths for human correction—no more invisible mistakes compounding.',
            },
            {
              title: 'Safe deployment',
              desc: 'Rigorous strategic oversight and human capital deployment de-risk your technology in complex, high-stakes African markets.',
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

      {/* Core Services */}
      <section className="px-6 md:px-24 py-24 border-b border-ink">
        <div className="mb-16">
          <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-ink-60 inline-block" />
            Core Services
          </div>
          <h2 className="font-display font-black text-[clamp(40px,5vw,64px)] leading-tight tracking-[-0.02em] text-ink max-w-[20ch]">
            Oversight across every complex workflow.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink border border-ink">
          {[
            { title: 'Marketing & Communications', desc: 'Ensure automated campaigns and content generation remain aligned with nuanced cultural sentiment, brand safety, and market reality.' },
            { title: 'Digital Technology', desc: 'Modernize your infrastructure and de-risk your AI deployments with hybrid systems that combine human intelligence with digital efficiency.' },
            { title: 'Human Capital & Outsourcing', desc: 'Inject specialized human operators directly into the loop. We provide the talent required to guide and manage automated processes.' },
            { title: 'Organizational Transformation', desc: 'Restructure your enterprise pipeline to maximize the efficiency of AI tools without losing the critical layer of strategic judgment.' },
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
          Ready to empower your enterprise AI with human oversight?
        </h2>
        <p className="font-text text-[18px] leading-relaxed text-ink-60 mb-10 max-w-[42ch]">
          From initial strategic advisory to on-the-ground implementation across Africa.
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
