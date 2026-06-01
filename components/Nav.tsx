'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  MoveRight,
  Zap, Landmark, ShoppingBag,
  Lightbulb, Network, Users, Target, BriefcaseBusiness, Brush, Microscope, Megaphone, Radio, BarChart3,
  ChevronDown, LogOut, Settings, Shield, SwitchCamera, Sun, Moon
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/lib/user'

type DropdownItem = {
  label: string
  href: string
  desc: string
  icon: LucideIcon
}

type NavItem = {
  label: string
  href?: string
  id?: string
  dropdown?: DropdownItem[]
}

type NavAuthState = ReturnType<typeof useCurrentUser>

interface NavProps {
  authState: NavAuthState
}

export default function Nav({ authState }: NavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user: currentUser, isAuthenticated } = authState
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleNav = (item: { label: string; id?: string; href?: string }) => {
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

  const items: NavItem[] = [
    {
      label: 'Arenas',
      dropdown: [
        {
          label: 'Technology & Fintech',
          href: '/arenas',
          desc: 'Growth systems for high-velocity tech and regulated financial platforms.',
          icon: Zap,
        },
        {
          label: 'Public Infrastructure',
          href: '/arenas',
          desc: 'Behaviour-shifting communication for civic and impact-led organisations.',
          icon: Landmark,
        },
        {
          label: 'Consumer & Brand',
          href: '/arenas',
          desc: 'Brand worlds and commercial systems for consumer companies across every channel.',
          icon: ShoppingBag,
        },
      ],
    },
    {
      label: 'Services',
      dropdown: [
        {
          label: 'Campaign Launch',
          href: '/services/campaign-launch',
          desc: 'Launch systems for products, offers, partnerships, and market moments.',
          icon: BriefcaseBusiness,
        },
        {
          label: 'Market Entry',
          href: '/services/market-entry',
          desc: 'Entry strategy for brands expanding into new and unfamiliar markets.',
          icon: MoveRight,
        },
        {
          label: 'Brand Refresh',
          href: '/services/brand-refresh',
          desc: 'Repositioning and identity recalibration for brands in transition.',
          icon: Brush,
        },
        {
          label: 'Consumer Research',
          href: '/services/consumer-research',
          desc: 'Decision-ready insight into customer behavior, language, and demand.',
          icon: Microscope,
        },
        {
          label: 'Growth Strategy',
          href: '/services/growth-strategy',
          desc: 'Integrated planning across positioning, channels, and operating priorities.',
          icon: Megaphone,
        },
        {
          label: 'Influencer Strategy',
          href: '/services/influencer-strategy',
          desc: 'Creator and influence systems built for credibility and measurable impact.',
          icon: Radio,
        },
        {
          label: 'Regional Expansion',
          href: '/services/regional-expansion',
          desc: 'Regional rollout planning for multi-market growth and operating coherence.',
          icon: Target,
        },
        {
          label: 'Analytics and Dashboarding',
          href: '/services/analytics-dashboarding',
          desc: 'Measurement systems and dashboards for sharper operating decisions.',
          icon: BarChart3,
        },
      ],
    },
    {
      label: 'About',
      dropdown: [
        { label: 'The Provocation', href: '/provocation', desc: 'Why emerging markets demand a new approach to growth.', icon: Lightbulb },
        { label: 'Our Model', href: '/model', desc: 'How we architect, assemble, and operate growth systems.', icon: Network },
        { label: 'Team & Advisory', href: '/about', desc: 'The people and the global network behind Comcorpᵉ.', icon: Users },
        { label: 'Oversight', href: '/enterprise', desc: 'How Comcorpe pairs AI systems with strategic and human oversight.', icon: Microscope },
        { label: 'Why Comcorpe', href: '/why', desc: 'Designed for complexity. Built for structural advantage.', icon: Target },
      ],
    },
    { label: 'Talent', href: '/talent' },
    { label: 'Insights', href: '/insights' },
  ]

  const dashboardHref = currentUser?.role === 'admin'
    ? '/admin'
    : currentUser?.role === 'talent'
      ? '/talent/dashboard'
      : '/client/dashboard'

  const profileHref = currentUser?.role === 'talent'
    ? '/talent/dashboard/settings/profile'
    : '/client/dashboard/settings/profile'

  const audience = currentUser?.role || 'client'
  const dashboardLinks = [
    { audience: 'client' as const, label: 'Client dashboard', href: '/client/dashboard', Icon: SwitchCamera },
    { audience: 'talent' as const, label: 'Talent dashboard', href: '/talent/dashboard', Icon: SwitchCamera },
    { audience: 'admin' as const, label: 'Admin', href: '/admin', Icon: Shield },
  ].filter((item) => item.audience !== audience)

  return (
    <>
      <nav className={`sticky top-0 z-50 h-16 grid grid-cols-[auto_1fr_auto] items-center px-6 md:px-24 border-b transition-all duration-[240ms] ${scrolled || menuOpen ? 'bg-background/95 backdrop-blur-md border-border' : 'border-transparent bg-transparent'}`}>

        {/* Logo */}
        <Link href="/" className="block justify-self-start">
          <img src="/images/comcorpe.png" alt="Comcorpe" className="h-6 md:h-7 w-auto object-contain dark:invert" />
        </Link>

        {/* Actions & Hamburger */}
        <div className="flex items-center gap-2 lg:gap-4 justify-self-end col-start-3">
          <Button asChild size="icon" className="sm:hidden">
            <Link href="/book" aria-label="Book a session call">
              <CalendarDays size={15} strokeWidth={1.6} />
            </Link>
          </Button>
          <Button asChild className="hidden font-text sm:inline-flex">
            <Link href="/book">Book a session call</Link>
          </Button>

          <Button
            onClick={() => setMenuOpen(o => !o)}
            variant="ghost"
            size="icon"
            className="flex flex-col gap-1.5 ml-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-foreground transition-all duration-[240ms] ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-px bg-foreground transition-all duration-[240ms] ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-foreground transition-all duration-[240ms] ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </Button>

          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                id="nav-user-menu-button"
                type="button"
                aria-label="Open user menu"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-foreground/5 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0 overflow-hidden relative flex items-center justify-center">
                  {currentUser?.image ? (
                    <Image src={currentUser.image} alt={currentUser.name ?? ''} fill className="object-cover" />
                  ) : (
                    <span className="font-display font-black text-[12px] text-foreground">{currentUser?.initials ?? ''}</span>
                  )}
                </div>
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  className={`text-foreground/50 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  aria-labelledby="nav-user-menu-button"
                  className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border flex flex-col gap-0.5">
                    <p className="font-display font-black text-[14px] tracking-[-0.01em] text-foreground leading-tight">{currentUser?.name ?? 'Loading profile'}</p>
                    {currentUser?.email && (
                      <p className="font-text text-[12px] text-muted-foreground/80 lowercase truncate leading-tight">
                        {currentUser.email}
                      </p>
                    )}
                    <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mt-1 capitalize">
                      {currentUser ? `${currentUser.role} - ${currentUser.company ?? 'Comcorpe'}` : 'Firebase'}
                    </p>
                  </div>

                  <div className="py-1.5">
                    <Link
                      href={dashboardHref}
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 font-text text-sm text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
                    >
                      <LayoutDashboard size={14} strokeWidth={1.5} className="text-primary shrink-0" />
                      Dashboard
                    </Link>
                    <Link
                      href={profileHref}
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 font-text text-sm text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
                    >
                      <Settings size={14} strokeWidth={1.5} className="shrink-0" />
                      Settings
                    </Link>
                    {dashboardLinks.map(({ href, label, Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 font-text text-sm text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
                      >
                        <Icon size={14} strokeWidth={1.5} className="text-primary shrink-0" />
                        {label}
                      </Link>
                    ))}
                    <button
                      role="menuitem"
                      onClick={() => { toggleDark(); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 font-text text-sm text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
                    >
                      {darkMode
                        ? <Sun size={14} strokeWidth={1.5} className="text-primary shrink-0" />
                        : <Moon size={14} strokeWidth={1.5} className="text-primary shrink-0" />}
                      {darkMode ? 'Light mode' : 'Dark mode'}
                    </button>
                  </div>

                  <div className="border-t border-border py-1.5">
                    <button
                      role="menuitem"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 font-text text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={14} strokeWidth={1.5} className="shrink-0" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div className={`fixed inset-0 top-16 z-40 bg-background flex flex-col transition-all duration-[300ms] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} overflow-y-auto pb-12`}>
        <div className="flex flex-col px-6 md:px-24 py-8 gap-1 max-w-7xl mx-auto w-full">
          {items.map((item) => (
            <div key={item.label}>
              {item.dropdown ? (
                <div className="py-4 border-b border-border">
                  <div className="font-display font-black text-[28px] tracking-hero text-foreground text-left w-full mb-5 opacity-40">
                    {item.label}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-1">
                    {item.dropdown.map(subItem => {
                      const Icon = subItem.icon
                      return (
                        <button
                          key={subItem.label}
                          onClick={() => handleNav(subItem)}
                          className="text-left bg-transparent border-0 cursor-pointer flex gap-4 items-center group/mob w-full"
                        >
                          <div className="w-11 h-11 shrink-0 bg-border border border-border flex items-center justify-center text-muted-foreground group-hover/mob:border-primary group-hover/mob:text-primary group-hover/mob:bg-primary/10 transition-colors duration-200">
                            <Icon size={18} strokeWidth={1.5} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-display font-black text-[19px] tracking-[-0.01em] text-foreground group-hover/mob:text-primary transition-colors duration-200 leading-tight">{subItem.label}</span>
                            <span className="font-text text-[12px] leading-relaxed text-muted-foreground">{subItem.desc}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNav(item)}
                  className="font-display font-black text-[32px] tracking-hero text-foreground text-left py-4 border-b border-border bg-transparent border-x-0 border-t-0 cursor-pointer hover:text-primary transition-colors duration-[120ms] w-full"
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
