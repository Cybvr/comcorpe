'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface TalentCard {
  id: string
  name: string
  role: string
  category: string
  quote: string
  image: string
  clientLogo?: string
  clientName: string
}

const talentShowcase: TalentCard[] = [
  {
    id: 'sarah-m',
    name: 'Sarah M.',
    role: 'Commercial Architect',
    category: 'Growth Strategy',
    quote: '"We redesigned the entire go-to-market engine in 6 weeks — what used to take two quarters."',
    image: '/images/talent/Sarah M.png',
    clientName: 'Volks Bank',
  },
  {
    id: 'tunde-a',
    name: 'Tunde A.',
    role: 'Revenue Operations Lead',
    category: 'Revenue Ops',
    quote: '"The pipeline automation alone tripled qualified lead volume within the first month."',
    image: '/images/talent/Tunde A.png',
    clientName: 'T-Finance',
  },
  {
    id: 'kemi-adaora',
    name: 'Kemi Adaora',
    role: 'Market Entry Strategist',
    category: 'Market Expansion',
    quote: '"We cracked three new markets in West Africa — each with a tailored regulatory playbook."',
    image: '/images/talent/Kemi Adaora.png',
    clientName: 'Gridwell',
  },
  {
    id: 'daniel-osei',
    name: 'Daniel Osei',
    role: 'Performance Marketing Lead',
    category: 'Performance Marketing',
    quote: '"Cost per acquisition dropped 40% while doubling conversion — the system just works."',
    image: '/images/talent/Daniel Osei.png',
    clientName: 'Volta Pay',
  },
  {
    id: 'elena-r',
    name: 'Elena R.',
    role: 'Brand & Creative Strategist',
    category: 'Brand Systems',
    quote: '"We built a brand architecture that scales across five product lines and three languages."',
    image: '/images/talent/Elena R.png',
    clientName: 'Gridwell',
  },
  {
    id: 'james-k',
    name: 'James K.',
    role: 'Data & Analytics Lead',
    category: 'Data Intelligence',
    quote: '"Real-time dashboards replaced guesswork — now every growth decision is data-backed."',
    image: '/images/talent/James K.png',
    clientName: 'T-Finance',
  },
]

const categoryColors: Record<string, string> = {
  'Growth Strategy': 'from-emerald-500 to-emerald-600',
  'Revenue Ops': 'from-blue-500 to-blue-600',
  'Market Expansion': 'from-amber-500 to-amber-600',
  'Performance Marketing': 'from-violet-500 to-violet-600',
  'Brand Systems': 'from-rose-500 to-rose-600',
  'Data Intelligence': 'from-cyan-500 to-cyan-600',
}

const categoryBgColors: Record<string, string> = {
  'Growth Strategy': 'bg-emerald-500',
  'Revenue Ops': 'bg-blue-500',
  'Market Expansion': 'bg-amber-500',
  'Performance Marketing': 'bg-violet-500',
  'Brand Systems': 'bg-rose-500',
  'Data Intelligence': 'bg-cyan-500',
}

export default function TalentCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector<HTMLElement>('[data-talent-card]')?.offsetWidth ?? 400
    const gap = 20
    const scrollAmount = cardWidth + gap
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="py-24 md:py-32 overflow-hidden bg-background">
      {/* Header */}
      <div className="px-6 md:px-24 mb-16">
        <div className="flex items-start md:items-end justify-between gap-8 flex-col md:flex-row">
          <div>
            <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5 mb-6">
              <span className="w-6 h-px bg-foreground inline-block" />
              Featured Talent
            </span>
            <h2 className="font-display font-black text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-tight text-foreground max-w-[20ch] m-0">
              Operators who deliver
              <span className="text-primary">.</span>
            </h2>
            <p className="font-text text-[17px] md:text-[19px] leading-lede text-muted-foreground mt-5 max-w-[42ch]">
              Strategic talent embedded in live growth systems — trained, tested, and trusted to perform in the most complex markets.
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="w-12 h-12 rounded-full border border-foreground/15 flex items-center justify-center transition-all duration-200 hover:bg-foreground hover:text-background disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground bg-background text-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="w-12 h-12 rounded-full border border-foreground/15 flex items-center justify-center transition-all duration-200 hover:bg-foreground hover:text-background disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground bg-background text-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-6 md:px-24 pb-4 snap-x snap-mandatory hide-scrollbar"
      >
        {talentShowcase.map((talent) => (
          <Link
            key={talent.id}
            href={`/talent/${talent.id}`}
            data-talent-card
            className="group relative flex-none w-[320px] md:w-[380px] aspect-[3/4] rounded-2xl overflow-hidden snap-start cursor-pointer"
          >
            {/* Background image */}
            <Image
              src={talent.image}
              alt={talent.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 320px, 380px"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white ${categoryBgColors[talent.category] ?? 'bg-foreground'}`}
              >
                {talent.category}
              </span>
              <span className="font-display font-black text-[13px] text-white/90 tracking-tight">
                {talent.clientName}
              </span>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <p className="font-display font-black text-[20px] md:text-[22px] leading-[1.2] text-white mb-5 tracking-tight">
                {talent.quote}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="font-text text-[14px] font-bold text-white">
                  {talent.name}
                </span>
                <span className="text-white/40 text-[14px]">·</span>
                <span className="font-text text-[13px] text-white/60">
                  {talent.role}
                </span>
              </div>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300 pointer-events-none" />
          </Link>
        ))}

        {/* CTA card */}
        <div
          data-talent-card
          className="group relative flex-none w-[320px] md:w-[380px] aspect-[3/4] rounded-2xl overflow-hidden snap-start border border-foreground/10 bg-foreground flex flex-col items-center justify-center text-center p-10"
        >
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-background/30 flex items-center justify-center mb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-background/50">
              <path d="M5 12h14M12 5v14" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="font-display font-black text-[28px] leading-tight tracking-tight text-background mb-4">
            Deploy your
            <br />
            growth pod
          </h3>
          <p className="font-text text-[15px] text-background/60 leading-relaxed mb-8 max-w-[28ch]">
            Access our full roster of strategic operators built for complex markets.
          </p>
          <Link
            href="/talent"
            className="font-text text-[13px] font-semibold px-6 py-3 bg-background text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-150 inline-flex items-center gap-2"
          >
            Browse all talent
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
