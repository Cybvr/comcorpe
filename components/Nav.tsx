'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
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

  const handleNav = (item: { label: string, id?: string, href?: string }) => {
    setMenuOpen(false)
    if (item.href) {
      router.push(item.href)
    } else if (item.id) {
      if (pathname === '/') {
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        router.push(`/#${item.id}`)
      }
    }
  }

  const items = [
    { label: 'Arenas', href: '/arenas' },
    { 
      label: 'About', 
      dropdown: [
        { label: 'The Provocation', href: '/about#provocation', desc: 'Why emerging markets demand a new approach to growth.' },
        { label: 'Our Model', href: '/about#model', desc: 'How we architect, assemble, and operate growth systems.' },
        { label: 'Team & Advisory', href: '/about#team', desc: 'The people and the global network behind Comcorpᵉ.' },
        { label: 'Why Comcorpe', href: '/why', desc: 'Designed for complexity. Built for structural advantage.' },
      ]
    },
    { label: 'Cases', href: '/case-studies' },
  ]

  return (
    <>
      <nav className={`sticky top-0 z-50 h-16 flex items-center px-6 md:px-24 border-b transition-all duration-[240ms] ${scrolled || menuOpen ? 'bg-paper/95 backdrop-blur-md border-ink-10' : 'border-transparent bg-transparent'}`}>
        <Link href="/" className="block">
          <img src="/images/comcorpe.png" alt="Comcorpe" className="h-6 md:h-7 w-auto object-contain dark:invert" />
        </Link>

        {/* Desktop links */}
        <div className="ml-auto hidden md:flex gap-9 items-center">
          {items.map((item) => (
            <div key={item.label} className="relative group">
              {item.dropdown ? (
                <div className="py-5 cursor-default">
                  <span className="font-text text-sm font-medium tracking-body text-ink pb-0.5 border-b border-transparent group-hover:border-blue group-hover:text-blue transition-colors duration-[120ms]">
                    {item.label}
                  </span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[640px] bg-paper border border-ink-10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 grid grid-cols-2 p-4 gap-2">
                    {item.dropdown.map(subItem => (
                      <button
                        key={subItem.label}
                        onClick={() => handleNav(subItem)}
                        className="text-left p-4 font-text text-ink hover:bg-ink/[0.04] transition-colors duration-150 border-0 bg-transparent cursor-pointer flex gap-4 items-start rounded-sm"
                      >
                        <div className="w-12 h-12 shrink-0 bg-ink-10 border border-ink-10 flex items-center justify-center">
                          <span className="font-mono text-[8px] text-ink-40 uppercase tracking-widest text-center italic opacity-60">IMG</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-display font-black text-[17px] tracking-[-0.01em] text-ink">{subItem.label}</span>
                          <span className="font-text text-[13px] leading-relaxed text-ink-60">{subItem.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNav(item)}
                  className="font-text text-sm font-medium tracking-body text-ink cursor-pointer pb-0.5 border-b border-transparent hover:border-blue hover:text-blue transition-colors duration-[120ms] bg-transparent border-0"
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}

          {/* Dark mode toggle — desktop */}
          <button
            onClick={toggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-full text-ink hover:bg-ink-10 transition-colors duration-[120ms] cursor-pointer"
          >
            {darkMode ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          </button>

          <Link
            href="/book"
            className="font-text text-[13px] font-semibold px-[18px] py-[10px] rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]"
          >
            Book a session call
          </Link>
        </div>

        {/* Mobile: dark toggle + CTA + hamburger */}
        <div className="ml-auto flex md:hidden items-center gap-2">
          <button
            onClick={toggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-full text-ink hover:bg-ink-10 transition-colors duration-[120ms] cursor-pointer"
          >
            {darkMode ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          </button>
          <Link
            href="/book"
            className="font-text text-[12px] font-semibold px-4 py-2.5 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]"
          >
            Book a session call
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
      <div className={`fixed inset-0 top-16 z-40 bg-paper flex flex-col md:hidden transition-all duration-[300ms] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} overflow-y-auto pb-12`}>
        <div className="flex flex-col px-6 py-8 gap-1">
          {items.map((item) => (
            <div key={item.label}>
              {item.dropdown ? (
                <div className="py-4 border-b border-ink-10">
                  <div className="font-display font-black text-[32px] tracking-hero text-ink text-left w-full mb-6 opacity-50">
                    {item.label}
                  </div>
                  <div className="flex flex-col gap-6 pl-2">
                    {item.dropdown.map(subItem => (
                      <button
                        key={subItem.label}
                        onClick={() => handleNav(subItem)}
                        className="text-left bg-transparent border-0 cursor-pointer flex gap-4 items-center group w-full"
                      >
                        <div className="w-14 h-14 shrink-0 bg-ink-10 border border-ink-10 flex items-center justify-center group-hover:border-blue transition-colors duration-200">
                          <span className="font-mono text-[8px] text-ink-40 uppercase tracking-widest text-center italic opacity-60">IMG</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-display font-black text-[20px] tracking-[-0.01em] text-ink group-hover:text-blue transition-colors duration-200">{subItem.label}</span>
                          <span className="font-text text-[13px] leading-relaxed text-ink-60">{subItem.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNav(item)}
                  className="font-display font-black text-[32px] tracking-hero text-ink text-left py-4 border-b border-ink-10 bg-transparent border-x-0 border-t-0 cursor-pointer hover:text-blue transition-colors duration-[120ms] w-full"
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
