'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useUsers } from '@/lib/user-client'

const talentSpotlightCards = [
  {
    eyebrow: 'Commercial Architect',
    title: 'Growth Strategy & Design',
    tags: ['Fintech', 'Unit Economics'],
  },
  {
    eyebrow: 'Execution Lead',
    title: 'Revenue Ops & Performance',
    tags: ['CRM', 'Automation'],
    inverted: true,
  },
]

const talentArchetypes = [
  {
    title: 'The Architect',
    role: 'Commercial Strategy & Design',
    desc: 'Builds the foundational growth system. Maps unit economics, channel architecture, and go-to-market strategies that turn business ambition into measurable commercial logic.',
  },
  {
    title: 'The Integrator',
    role: 'Market Entry & Partnerships',
    desc: 'Connects the strategy to the reality of the market. Navigates regulatory landscapes, builds local partnership networks, and embeds operations into complex emerging markets.',
  },
  {
    title: 'The Operator',
    role: 'Execution & Revenue Ops',
    desc: 'Drives day-to-day implementation. Manages the performance marketing, sales activation, and revenue pipelines, ensuring the growth system operates efficiently at scale.',
  },
]

const talentTrainingModules = [
  {
    title: 'Commercial Architecture',
    desc: 'Design reliable, production-grade business models',
    progress: [
      { label: 'Unit Economics Mapping', completed: true },
      { label: 'Go-to-Market Strategy', completed: true },
      { label: 'Pricing & Monetization', completed: true },
    ],
  },
  {
    title: 'Market Intelligence',
    desc: 'Architect localized strategies for complex African markets',
    progress: [
      { label: 'Regulatory Navigation', completed: true },
      { label: 'Partnership Ecosystems', completed: true },
      { label: 'Consumer Trust Dynamics', completed: false },
    ],
  },
  {
    title: 'Growth Operations',
    desc: 'Deploy scalable revenue infrastructure in live environments',
    progress: [
      { label: 'Performance Marketing', completed: true },
      { label: 'Pipeline Automation', completed: true },
      { label: 'Data & Analytics', completed: false },
    ],
  },
]

export default function TalentPage() {
  const { users, loading } = useUsers()
  const talentRoster = users.filter(u => u.role === 'talent' && u.featured)

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading talent roster from Firestore...</p>
      </div>
    )
  }
  return (
    <div className="bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="px-6 md:px-24 pt-16 md:pt-24 pb-20 border-b border-foreground">
        <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-12 flex items-center gap-3">
          <span className="w-2 h-2 bg-primary rounded-full" />
          Comcorpᵉ / Talent
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-12 lg:gap-24 items-start">
          <div>
            <h1 className="font-display font-black text-[clamp(48px,6vw,96px)] leading-[0.92] tracking-[-0.03em] text-foreground m-0 mb-8">
              Access the deepest pool of <span className="text-primary">strategic operators.</span>
            </h1>
            <p className="font-text text-[20px] leading-relaxed text-foreground/80 max-w-[38ch]">
              Embedded directly into your enterprise to build, integrate, and scale growth systems across complex markets.
            </p>
            <div className="mt-12">
              <Link
                href="/book"
                className="font-text text-sm font-semibold px-6 py-3.5 bg-foreground text-background rounded-full inline-flex items-center gap-2.5 hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]"
              >
                Deploy a Pod
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {talentSpotlightCards.map((card, i) => (
              <div
                key={card.title}
                className={`p-6 flex gap-6 items-center ${card.inverted ? 'bg-foreground text-background' : 'bg-border border border-input'}`}
              >
                <div className={`w-20 h-20 rounded-xl shrink-0 overflow-hidden relative border ${card.inverted ? 'bg-background/10 border-background/10' : 'bg-input border-border'}`}>
                  <Image 
                    src={i === 0 ? '/images/talent/Sarah M.png' : '/images/talent/Tunde A.png'} 
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">{card.eyebrow}</div>
                  <div className={`font-display font-black text-[20px] leading-tight ${card.inverted ? 'text-background' : 'text-foreground'}`}>
                    {card.title}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`font-mono text-[9px] uppercase px-2 py-1 border ${
                          card.inverted ? 'border-background/20 text-background/60' : 'border-input text-muted-foreground'
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
      <section className="px-6 md:px-24 py-12 border-b border-foreground overflow-hidden flex items-center justify-center">
        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-widest text-center">
          Delivering strategic talent the market cannot supply
        </div>
      </section>

      {/* Archetypes */}
      <section className="px-6 md:px-24 py-24 border-b border-foreground">
        <div className="mb-20">
          <h2 className="font-display font-black text-[clamp(40px,5vw,64px)] leading-tight tracking-[-0.02em] text-foreground max-w-[24ch]">
            Three strategic archetypes powering enterprise growth.
          </h2>
          <p className="font-text text-[18px] leading-relaxed text-muted-foreground mt-6 max-w-[42ch]">
            Successful growth systems require multiple capabilities. Our specialist pods continuously bring these three archetypes together to turn ambition into execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground border border-foreground">
          {talentArchetypes.map((arch, i) => (
            <div key={i} className="bg-background p-8 md:p-12 hover:bg-primary/[0.02] transition-colors">
              <div className="font-mono text-[13px] text-primary mb-4">0{i+1}.</div>
              <div className="font-display font-black text-[32px] leading-tight tracking-[-0.01em] text-foreground mb-2">
                {arch.title}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70 mb-6 pb-6 border-b border-border">
                {arch.role}
              </div>
              <p className="font-text text-[16px] leading-relaxed text-muted-foreground m-0">
                {arch.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Training / Curation Pipeline */}
      <section className="px-6 md:px-24 py-24 bg-foreground text-background">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 mb-20">
          <div>
            <h2 className="font-display font-black text-[clamp(40px,5vw,72px)] leading-[0.92] tracking-[-0.02em] text-background mb-8">
              How we build the strategic talent market.
            </h2>
            <p className="font-text text-[19px] leading-relaxed text-background/70 max-w-[36ch]">
              We operate a continuous curation pipeline of operators, trained specifically for real-world commercial delivery in complex emerging markets.
            </p>
          </div>
          
          <div className="flex flex-col gap-12">
            {talentTrainingModules.map((mod, i) => (
              <div key={i}>
                <div className="font-display font-black text-[24px] tracking-[-0.01em] text-primary mb-2">{mod.title}</div>
                <div className="font-text text-[15px] text-background/60 mb-6">{mod.desc}</div>
                <div className="flex flex-col gap-3">
                  {mod.progress.map((p, j) => (
                    <div key={j} className="flex items-center gap-4">
                      <div className={`w-4 h-4 flex items-center justify-center border ${p.completed ? 'bg-primary border-primary' : 'border-background/20'}`}>
                        {p.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                      <span className={`font-mono text-[11px] uppercase tracking-widest ${p.completed ? 'text-background' : 'text-background/40'}`}>
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
      <section className="px-6 md:px-24 py-24 border-b border-foreground bg-background">
        <div className="mb-20">
          <h2 className="font-display font-black text-[clamp(40px,5vw,64px)] leading-tight tracking-[-0.02em] text-foreground max-w-[24ch]">
            Deploy curated talent trained to scale your enterprise.
          </h2>
          <p className="font-text text-[18px] leading-relaxed text-muted-foreground mt-6 max-w-[42ch]">
            Augment your existing operations with individual specialists, or deploy a fully-managed pod to build and scale your commercial growth engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground border border-foreground">
          {talentRoster.map((talent, i) => (
            <Link key={i} href={`/talent/${talent.id}`} className="block bg-background p-8 group hover:bg-border/60 transition-colors duration-[120ms]">
              <p className="font-text text-[16px] leading-relaxed text-foreground mb-8 h-[72px]">
                {talent.desc}
              </p>
              <div className="flex items-center gap-4 border-t border-border pt-6">
                <div className="w-16 h-16 rounded-xl border border-border overflow-hidden relative flex items-center justify-center bg-border shrink-0">
                  {talent.image ? (
                    <Image src={talent.image} alt={talent.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <span className="font-display font-black text-xs text-muted-foreground/70">{talent.initials}</span>
                  )}
                </div>
                <div>
                  <div className="font-display font-black text-[20px] leading-tight text-foreground group-hover:text-primary transition-colors mb-1">{talent.name}</div>
                  <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">{talent.talentRole}</div>
                  <div className="font-text text-[12px] text-muted-foreground/70">{talent.bg}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link
            href="/book"
            className="font-text text-[15px] font-semibold px-8 py-4 bg-foreground text-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms] inline-flex"
          >
            Explore our Pod model
          </Link>
        </div>
      </section>

    </div>
  )
}
