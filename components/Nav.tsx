'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Initialise from localStorage / system preference
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    }
  }, [])

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scroll = (id: string) => {
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
          <img src="/images/comcorpe.png" alt="Comcorpe" className="h-6 md:h-7 w-auto object-contain dark:invert" />
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

          {/* Dark mode toggle — desktop */}
          <button
            onClick={toggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-full text-ink hover:bg-ink-10 transition-colors duration-[120ms] cursor-pointer"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link
            href="/request"
            className="font-text text-[13px] font-semibold px-[18px] py-[10px] rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]"
          >
            Request a brief
          </Link>
        </div>

        {/* Mobile: dark toggle + CTA + hamburger */}
        <div className="ml-auto flex md:hidden items-center gap-2">
          <button
            onClick={toggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-full text-ink hover:bg-ink-10 transition-colors duration-[120ms] cursor-pointer"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
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
