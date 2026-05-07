'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scroll = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const items = [
    { label: 'Provocation', id: 'provocation' },
    { label: 'Model', id: 'model' },
    { label: 'Arenas', id: 'arenas' },
    { label: 'Cases', id: 'cases' },
  ]

  return (
    <>
      <nav className={`sticky top-0 z-50 h-16 flex items-center px-6 md:px-24 border-b transition-all duration-[240ms] ${scrolled || menuOpen ? 'bg-paper/95 backdrop-blur-md border-ink-10' : 'border-transparent bg-transparent'}`}>
        <a href="#top" className="block">
          <img src="/images/comcorpe.png" alt="Comcorpe" className="h-6 md:h-7 w-auto object-contain" />
        </a>

        {/* Desktop links */}
        <div className="ml-auto hidden md:flex gap-9 items-center">
          {items.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scroll(id)}
              className="font-text text-sm font-medium tracking-body text-ink cursor-pointer pb-0.5 border-b border-transparent hover:border-blue hover:text-blue transition-colors duration-[120ms] bg-transparent border-0"
            >
              {label}
            </button>
          ))}
          <Link
            href="/request"
            className="font-text text-[13px] font-semibold px-[18px] py-[10px] rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]"
          >
            Request a brief
          </Link>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="ml-auto flex md:hidden items-center gap-3">
          <Link
            href="/request"
            className="font-text text-[12px] font-semibold px-4 py-2.5 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]"
          >
            Request a brief
          </Link>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-9 h-9 flex flex-col justify-center items-center gap-1.5 bg-transparent border-0 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-ink transition-all duration-[240ms] ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-px bg-ink transition-all duration-[240ms] ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-ink transition-all duration-[240ms] ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div className={`fixed inset-0 top-16 z-40 bg-paper flex flex-col md:hidden transition-all duration-[300ms] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col px-6 py-8 gap-1">
          {items.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scroll(id)}
              className="font-display font-black text-[32px] tracking-hero text-ink text-left py-4 border-b border-ink-10 bg-transparent border-x-0 border-t-0 cursor-pointer hover:text-blue transition-colors duration-[120ms] w-full"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
