'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getLeadership, getAdvisors } from '@/lib/people'
import type { LeadershipMember, AdvisorMember } from '@/lib/people'

const leadershipImages = [
  '/images/site/Architectural Lattice _ Motion Study 1.png',
  '/images/site/Panther Prowl _ Concentration 1.png',
  '/images/site/Flowing Ribbon _ Orchestration Study 1.png',
]

const advisorImages = [
  '/images/site/Crane in Flight _ Velocity 1.png',
  '/images/site/Coiled Serpent _ Strategy 1.png',
  '/images/site/Woman in Profile _ Vision 1.png',
]

export default function AboutPage() {
  const [leadershipData, setLeadershipData] = useState<LeadershipMember[]>([])
  const [advisorsData, setAdvisorsData] = useState<AdvisorMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const [lData, aData] = await Promise.all([
          getLeadership(),
          getAdvisors(),
        ])
        setLeadershipData(lData)
        setAdvisorsData(aData)
      } catch (err) {
        console.error('Error fetching about page data:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 border border-foreground divide-y md:divide-y-0 md:divide-x divide-foreground">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-8 md:p-12 flex flex-col gap-6 animate-pulse">
                  <div className="w-full aspect-[4/5] bg-border border border-border flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-muted-foreground/10" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted-foreground/10 w-1/3 rounded" />
                    <div className="h-8 bg-muted-foreground/20 w-3/4 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted-foreground/10 w-full rounded" />
                    <div className="h-4 bg-muted-foreground/10 w-full rounded" />
                    <div className="h-4 bg-muted-foreground/10 w-5/6 rounded" />
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-border mt-auto">
                    <div className="h-7 bg-muted-foreground/10 w-16 rounded border border-border/50" />
                    <div className="h-7 bg-muted-foreground/10 w-20 rounded border border-border/50" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 border border-foreground">
              {leadershipData.map((p, i) => (
                <div
                  key={i}
                  className={`p-8 md:p-12 flex flex-col gap-6 ${i < leadershipData.length - 1 ? 'border-b md:border-b-0 md:border-r border-foreground' : ''}`}
                >
                  <div className="w-full aspect-[4/5] relative overflow-hidden border border-border">
                    <Image
                      src={leadershipImages[i] ?? leadershipImages[0]}
                      alt={p.name}
                      fill
                      className="object-cover grayscale"
                    />
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
                    {p.tags?.map(t => (
                      <span key={t} className="font-mono text-[11px] tracking-[0.06em] uppercase text-foreground px-2.5 py-1.5 border border-input">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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

          {loading ? (
            <div className="border border-foreground divide-y divide-foreground bg-background">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[200px_1.5fr_2.5fr] gap-8 lg:gap-16 px-8 md:px-12 py-10 md:py-14 animate-pulse"
                >
                  <div className="w-full aspect-square md:aspect-[4/5] bg-border border border-border" />
                  <div className="space-y-4">
                    <div className="h-4 bg-muted-foreground/10 w-1/4 rounded" />
                    <div className="h-10 bg-muted-foreground/20 w-3/4 rounded" />
                    <div className="h-4 bg-muted-foreground/10 w-1/2 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted-foreground/10 w-full rounded" />
                    <div className="h-4 bg-muted-foreground/10 w-full rounded" />
                    <div className="h-4 bg-muted-foreground/10 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-foreground border border-foreground">
              {advisorsData.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[200px_1.5fr_2.5fr] gap-8 lg:gap-16 px-8 md:px-12 py-10 md:py-14 bg-background"
                >
                  <div className="w-full aspect-square md:aspect-[4/5] relative overflow-hidden border border-border">
                    <Image
                      src={advisorImages[i % advisorImages.length]}
                      alt={m.name}
                      fill
                      className="object-cover grayscale"
                    />
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
                    {m.fullBio?.split('\n\n').map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Provocation */}
        <div className="border-t border-foreground mt-20 md:mt-28 pt-20 md:pt-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div>
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-muted-foreground inline-block" />
                The Provocation
              </div>
              <h2 className="font-display font-black text-[clamp(36px,4.5vw,64px)] leading-[0.92] tracking-hero text-foreground mb-6">
                Growth is the most mismanaged function.
              </h2>
              <p className="font-text text-[17px] leading-relaxed text-muted-foreground max-w-[40ch] mb-8">
                Across emerging markets, growth is treated as effort rather than architecture. The result is reactive, fragmented, non-compounding. We are here to rewire that assumption.
              </p>
              <Link href="/provocation" className="font-mono text-xs text-primary inline-flex items-center gap-2 hover:gap-4 transition-all duration-200">
                Read the provocation <span>→</span>
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-foreground">
              <Image src="/images/site/Koi Fish _ Flow 1.png" alt="" fill className="object-cover grayscale" />
            </div>
          </div>
        </div>

        {/* Model */}
        <div className="border-t border-foreground mt-20 md:mt-28 pt-20 md:pt-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative aspect-[4/3] overflow-hidden border border-foreground order-2 md:order-1">
              <Image src="/images/site/Moth Wings _ Patterned Systems 1.png" alt="" fill className="object-cover grayscale" />
            </div>
            <div className="order-1 md:order-2">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-muted-foreground inline-block" />
                The Model
              </div>
              <h2 className="font-display font-black text-[clamp(36px,4.5vw,64px)] leading-[0.92] tracking-hero text-foreground mb-6">
                Architect. Assemble. Operate.
              </h2>
              <p className="font-text text-[17px] leading-relaxed text-muted-foreground max-w-[40ch] mb-8">
                Three pillars. One system. We design the commercial logic, configure specialist pods to the brief, and drive implementation until outcomes compound.
              </p>
              <Link href="/model" className="font-mono text-xs text-primary inline-flex items-center gap-2 hover:gap-4 transition-all duration-200">
                Explore the model <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Oversight */}
        <div className="border-t border-foreground mt-20 md:mt-28 pt-20 md:pt-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div>
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-muted-foreground inline-block" />
                Oversight
              </div>
              <h2 className="font-display font-black text-[clamp(36px,4.5vw,64px)] leading-[0.92] tracking-hero text-foreground mb-6">
                Governance that accelerates.
              </h2>
              <p className="font-text text-[17px] leading-relaxed text-muted-foreground max-w-[40ch] mb-8">
                The International Board and Advisory Network provide the institutional spine — strategic counsel, geographic reach, and sector depth. Oversight is not compliance here; it is accelerant.
              </p>
              <Link href="/about#advisors" className="font-mono text-xs text-primary inline-flex items-center gap-2 hover:gap-4 transition-all duration-200">
                Meet the board <span>→</span>
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-foreground">
              <Image src="/images/site/Orchid Bloom _ Emergence 1.png" alt="" fill className="object-cover grayscale" />
            </div>
          </div>
        </div>

        {/* Why Comcorpᵉ */}
        <div className="border-t border-foreground mt-20 md:mt-28 pt-20 md:pt-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative aspect-[4/3] overflow-hidden border border-foreground order-2 md:order-1">
              <Image src="/images/site/Protea Bloom _ Emergence 1.png" alt="" fill className="object-cover grayscale" />
            </div>
            <div className="order-1 md:order-2">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-muted-foreground inline-block" />
                Why Comcorpᵉ
              </div>
              <h2 className="font-display font-black text-[clamp(36px,4.5vw,64px)] leading-[0.92] tracking-hero text-foreground mb-6">
                Designed for complexity.
              </h2>
              <p className="font-text text-[17px] leading-relaxed text-muted-foreground max-w-[40ch] mb-8">
                Emerging markets don&apos;t reward standard playbooks. They reward systems that adapt, scale, and execute flawlessly under friction. Every decision we have made — structural, commercial, operational — is a response to that reality.
              </p>
              <Link href="/preview/why" className="font-mono text-xs text-primary inline-flex items-center gap-2 hover:gap-4 transition-all duration-200">
                The full case <span>→</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
      <div className="h-24 md:h-32" />
    </div>
  )
}
