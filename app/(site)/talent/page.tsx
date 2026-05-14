import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  talentArchetypes,
  talentRoster,
  talentSpotlightCards,
  talentTrainingModules,
} from '@/lib/talent'

export const metadata: Metadata = {
  title: 'Specialist Talent — Comcorpᵉ',
  description: 'Deploy curated, world-class strategic operators and commercial architects directly into your enterprise.',
}

export default function TalentPage() {
  return (
    <div className="bg-paper min-h-screen">
      
      {/* Hero Section */}
      <section className="px-6 md:px-24 pt-16 md:pt-24 pb-20 border-b border-ink">
        <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-12 flex items-center gap-3">
          <span className="w-2 h-2 bg-blue rounded-full" />
          Comcorpᵉ / Talent
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-12 lg:gap-24 items-start">
          <div>
            <h1 className="font-display font-black text-[clamp(48px,6vw,96px)] leading-[0.92] tracking-[-0.03em] text-ink m-0 mb-8">
              Access the deepest pool of <span className="text-blue">strategic operators.</span>
            </h1>
            <p className="font-text text-[20px] leading-relaxed text-ink-80 max-w-[38ch]">
              Embedded directly into your enterprise to build, integrate, and scale growth systems across complex markets.
            </p>
            <div className="mt-12">
              <Link
                href="/book"
                className="font-text text-sm font-semibold px-6 py-3.5 bg-ink text-paper rounded-full inline-flex items-center gap-2.5 hover:bg-blue transition-colors duration-[120ms]"
              >
                Deploy a Pod
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {talentSpotlightCards.map((card, i) => (
              <div
                key={card.title}
                className={`p-6 flex gap-6 items-center ${card.inverted ? 'bg-ink text-paper' : 'bg-ink-10 border border-ink-20'}`}
              >
                <div className={`w-20 h-20 rounded-xl shrink-0 overflow-hidden relative border ${card.inverted ? 'bg-paper/10 border-paper/10' : 'bg-ink-20 border-ink-10'}`}>
                  <Image 
                    src={i === 0 ? '/images/talent/Sarah M.png' : '/images/talent/Tunde A.png'} 
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-blue mb-1">{card.eyebrow}</div>
                  <div className={`font-display font-black text-[20px] leading-tight ${card.inverted ? 'text-paper' : 'text-ink'}`}>
                    {card.title}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`font-mono text-[9px] uppercase px-2 py-1 border ${
                          card.inverted ? 'border-paper/20 text-paper/60' : 'border-ink-20 text-ink-60'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="px-6 md:px-24 py-12 border-b border-ink overflow-hidden flex items-center justify-center">
        <div className="font-mono text-xs text-ink-40 uppercase tracking-widest text-center">
          Delivering strategic talent the market cannot supply
        </div>
      </section>

      {/* Archetypes */}
      <section className="px-6 md:px-24 py-24 border-b border-ink">
        <div className="mb-20">
          <h2 className="font-display font-black text-[clamp(40px,5vw,64px)] leading-tight tracking-[-0.02em] text-ink max-w-[24ch]">
            Three strategic archetypes powering enterprise growth.
          </h2>
          <p className="font-text text-[18px] leading-relaxed text-ink-60 mt-6 max-w-[42ch]">
            Successful growth systems require multiple capabilities. Our specialist pods continuously bring these three archetypes together to turn ambition into execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink border border-ink">
          {talentArchetypes.map((arch, i) => (
            <div key={i} className="bg-paper p-8 md:p-12 hover:bg-blue/[0.02] transition-colors">
              <div className="font-mono text-[13px] text-blue mb-4">0{i+1}.</div>
              <div className="font-display font-black text-[32px] leading-tight tracking-[-0.01em] text-ink mb-2">
                {arch.title}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-40 mb-6 pb-6 border-b border-ink-10">
                {arch.role}
              </div>
              <p className="font-text text-[16px] leading-relaxed text-ink-60 m-0">
                {arch.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Training / Curation Pipeline */}
      <section className="px-6 md:px-24 py-24 bg-ink text-paper">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 mb-20">
          <div>
            <h2 className="font-display font-black text-[clamp(40px,5vw,72px)] leading-[0.92] tracking-[-0.02em] text-paper mb-8">
              How we build the strategic talent market.
            </h2>
            <p className="font-text text-[19px] leading-relaxed text-paper/70 max-w-[36ch]">
              We operate a continuous curation pipeline of operators, trained specifically for real-world commercial delivery in complex emerging markets.
            </p>
          </div>
          
          <div className="flex flex-col gap-12">
            {talentTrainingModules.map((mod, i) => (
              <div key={i}>
                <div className="font-display font-black text-[24px] tracking-[-0.01em] text-blue mb-2">{mod.title}</div>
                <div className="font-text text-[15px] text-paper/60 mb-6">{mod.desc}</div>
                <div className="flex flex-col gap-3">
                  {mod.progress.map((p, j) => (
                    <div key={j} className="flex items-center gap-4">
                      <div className={`w-4 h-4 flex items-center justify-center border ${p.completed ? 'bg-blue border-blue' : 'border-paper/20'}`}>
                        {p.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                      <span className={`font-mono text-[11px] uppercase tracking-widest ${p.completed ? 'text-paper' : 'text-paper/40'}`}>
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Roster */}
      <section className="px-6 md:px-24 py-24 border-b border-ink bg-paper">
        <div className="mb-20">
          <h2 className="font-display font-black text-[clamp(40px,5vw,64px)] leading-tight tracking-[-0.02em] text-ink max-w-[24ch]">
            Deploy curated talent trained to scale your enterprise.
          </h2>
          <p className="font-text text-[18px] leading-relaxed text-ink-60 mt-6 max-w-[42ch]">
            Augment your existing operations with individual specialists, or deploy a fully-managed pod to build and scale your commercial growth engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink border border-ink">
          {talentRoster.map((talent, i) => (
            <Link key={i} href={`/talent/${talent.id}`} className="block bg-paper p-8 group hover:bg-ink-10/60 transition-colors duration-[120ms]">
              <p className="font-text text-[16px] leading-relaxed text-ink mb-8 h-[72px]">
                {talent.desc}
              </p>
              <div className="flex items-center gap-4 border-t border-ink-10 pt-6">
                <div className="w-16 h-16 rounded-xl border border-ink-10 overflow-hidden relative flex items-center justify-center bg-ink-10 shrink-0">
                  {talent.image ? (
                    <Image src={talent.image} alt={talent.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <span className="font-display font-black text-xs text-ink-40">{talent.initials}</span>
                  )}
                </div>
                <div>
                  <div className="font-display font-black text-[20px] leading-tight text-ink group-hover:text-blue transition-colors mb-1">{talent.name}</div>
                  <div className="font-mono text-[10px] text-blue uppercase tracking-widest mb-1">{talent.role}</div>
                  <div className="font-text text-[12px] text-ink-40">{talent.bg}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link
            href="/book"
            className="font-text text-[15px] font-semibold px-8 py-4 bg-ink text-paper rounded-full hover:bg-blue transition-colors duration-[120ms] inline-flex"
          >
            Explore our Pod model
          </Link>
        </div>
      </section>

    </div>
  )
}
