import type { Metadata } from 'next'
import Closing from '@/components/Closing'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Comcorpᵉ — A Growth Systems Company',
}

export default function Home() {
  const sections = [
    { label: 'Provocation', title: 'Rewiring growth systems', href: '/provocation', description: 'Growth is the most mismanaged function in emerging markets. We treat growth as architecture, not effort.' },
    { label: 'Model', title: 'Architect. Assemble. Operate.', href: '/model', description: 'We build growth engines that run by collapsing the gap between strategy and execution.' },
    { label: 'Arenas', title: 'Concentration over coverage', href: '/arenas', description: 'Focusing on high-impact sectors across Pan-Africa: Fintech, Infrastructure, and Consumer Ecosystems.' },
  ]

  const tickerWords = [
    'ARCHITECT', 'ASSEMBLE', 'OPERATE',
    'TECHNOLOGY & FINTECH', 'PUBLIC INFRASTRUCTURE', 'CONSUMER & BRAND',
    'GROWTH PLAYS', 'SPECIALIST PODS', 'INTERNATIONAL BOARD',
  ]

  return (
    <>
      <section
        id="top"
        className="flex flex-col md:h-[calc(100vh-4rem)] md:[height:calc(100dvh-4rem)] border-b border-foreground overflow-hidden"
      >
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_42%] overflow-hidden">
          <div className="px-6 md:px-24 pt-12 pb-14 md:my-auto">
            <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5 mb-8">
              <span className="w-6 h-px bg-foreground inline-block" />
              A Growth Systems Company
            </span>
            <h1 className="font-display text-[clamp(36px,6.5vw,96px)] leading-[0.92] tracking-[-0.04em] text-foreground m-0 mb-6">
              The Operating Layer for High-Velocity Growth<span className="text-primary">.</span>
            </h1>
            <p className="font-text text-[17px] md:text-[20px] leading-lede text-muted-foreground m-0 max-w-[34ch]">
              Comcorpᵉ orchestrates data, creativity, technology and strategy into unified growth systems —
              built to perform in complex markets.
            </p>
          </div>

          <div className="hidden md:block relative border-l border-foreground">
            <Image
              src="/images/site/Eagle in Motion _ Velocity Study 1.png"
              alt=""
              fill
              className="object-cover grayscale"
              priority
            />
          </div>
        </div>

        <div className="border-t border-foreground overflow-hidden py-3.5 whitespace-nowrap">
          <div className="inline-block animate-ticker font-display font-black text-[32px] tracking-[-0.03em] text-foreground">
            {[...tickerWords, ...tickerWords].map((w, i) => (
              <span key={i} className="inline-block px-8">
                {w}<span className="text-primary inline-block px-2">●</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* High-level navigation section */}
      <section className="py-24 md:py-40 px-6 md:px-24 bg-background">
        <div className="flex items-baseline gap-6 mb-20">
          <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-foreground inline-block" />
            The Foundation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground border border-foreground overflow-hidden rounded-sm">
          {sections.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group p-8 md:p-12 bg-background hover:bg-primary/[0.03] transition-all duration-300 flex flex-col min-h-[320px]"
            >
              <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-widest mb-8">{s.label}</div>
              <h2 className="font-display font-black text-[32px] md:text-[42px] leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-6">
                {s.title}
              </h2>
              <p className="font-text text-[16px] leading-relaxed text-muted-foreground m-0 mb-auto">
                {s.description}
              </p>
              <div className="mt-12 font-mono text-xs text-primary flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                Explore section <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Closing />
    </>
  )
}
