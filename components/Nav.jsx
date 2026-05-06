'use client'
import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const items = [
    { label: 'Provocation', id: 'provocation' },
    { label: 'Model', id: 'model' },
    { label: 'Arenas', id: 'arenas' },
    { label: 'Cases', id: 'cases' },
  ]

  return (
    <nav className={`sticky top-0 z-50 h-16 flex items-center px-6 md:px-24 border-b transition-all duration-[240ms] ${scrolled ? 'bg-paper/70 backdrop-blur-md border-ink-10' : 'border-transparent bg-transparent'}`}>
      <a href="#top" className="block">
        <img src="/images/comcorpe.png" alt="Comcorpᵉ" className="h-6 md:h-7 w-auto object-contain" />
      </a>
      <div className="ml-auto flex gap-6 md:gap-9 items-center">
        <div className="hidden md:flex gap-9 items-center">
          {items.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scroll(id)}
              className="font-text text-sm font-medium tracking-body text-ink cursor-pointer pb-0.5 border-b border-transparent hover:border-blue hover:text-blue transition-colors duration-[120ms] bg-transparent"
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('closing')}
          className="font-text text-[13px] font-semibold px-[18px] py-[10px] rounded-full bg-ink text-paper border-none cursor-pointer hover:bg-blue transition-colors duration-[120ms]"
        >
          Request a brief
        </button>
      </div>
    </nav>
  )
}
