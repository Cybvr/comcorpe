import type { Metadata } from 'next'
import ParallaxImage from '@/components/ParallaxImage'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Comcorpᵉ — A Growth Systems Company',
}

export default function Home() {
  const sections = [
    {
      label: 'Provocation',
      title: 'Rewiring growth systems',
      href: '/provocation',
      description: 'Growth is the most mismanaged function in emerging markets. We treat growth as architecture, not effort.',
      image: '/images/site/Koi Fish _ Flow 1.png',
    },
    {
      label: 'Model',
      title: 'Architect. Assemble. Operate.',
      href: '/model',
      description: 'We build growth engines that run by collapsing the gap between strategy and execution.',
      image: '/images/site/Moth Wings _ Patterned Systems 1.png',
    },
    {
      label: 'Arenas',
      title: 'Concentration over coverage',
      href: '/arenas',
      description: 'Focusing on high-impact sectors across Pan-Africa: Fintech, Infrastructure, and Consumer Ecosystems.',
      image: '/images/site/Protea Bloom _ Emergence 1.png',
    },
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
        className="flex flex-col border-b border-foreground overflow-hidden"
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 md:px-24 pt-24 pb-24 md:pt-36 md:pb-32">
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

          <div className="relative w-full aspect-[4/3] md:aspect-[21/9] border-t border-foreground overflow-hidden">
            <ParallaxImage
              src="/images/site/Eagle in Motion _ Velocity Study 1.png"
              alt=""
              imageClassName="grayscale"
              strength={50}
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

    </>
  )
}
