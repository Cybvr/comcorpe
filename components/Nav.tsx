'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  MoveRight,
  Zap, Landmark, ShoppingBag,
  Lightbulb, Network, Users, Target, BriefcaseBusiness, Brush, Microscope, Megaphone, Radio, BarChart3,
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

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
        { label: 'Team & Advisory', href: '/about', desc: 'The people and the global network behind Comcorpáµ‰.', icon: Users },
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

  return (
    <>
      <nav className={`sticky top-0 z-50 h-16 grid grid-cols-[auto_1fr_auto] items-center px-6 md:px-24 border-b transition-all duration-[240ms] ${scrolled || menuOpen ? 'bg-background/95 backdrop-blur-md border-border' : 'border-transparent bg-transparent'}`}>

        {/* Logo */}
        <Link href="/" className="block justify-self-start">
          <img src="/images/comcorpe.png" alt="Comcorpe" className="h-6 md:h-7 w-auto object-contain dark:invert" />
        </Link>

        {/* Desktop center nav */}
        {isAuthenticated ? (
          <div className="hidden lg:flex gap-4 xl:gap-6 items-center justify-self-center">
            {items.map((item) => (
              <div key={item.label} className="relative group">
                {item.dropdown ? (
                  <div className="py-5 cursor-default">
                    <span className="font-text text-sm font-medium tracking-body text-foreground pb-0.5 border-b border-transparent group-hover:border-primary group-hover:text-primary transition-colors duration-[120ms] inline-flex items-center gap-1.5">
                      {item.label}
                      <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-40 group-hover:opacity-100 transition-opacity mt-px" fill="none">
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>

                    <div className={`absolute top-full mt-0 bg-background border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-3 gap-1
                      ${item.dropdown.length >= 7
                        ? 'left-1/2 -translate-x-1/2 w-[920px] grid grid-cols-4'
                        : item.dropdown.length === 3
                        ? 'left-1/2 -translate-x-1/2 w-[600px] grid grid-cols-3'
                        : 'left-1/2 -translate-x-1/2 w-[640px] grid grid-cols-2'
                      }`}
                    >
                      {item.dropdown.map(subItem => {
                        const Icon = subItem.icon
                        return (
                          <button
                            key={subItem.label}
                            onClick={() => handleNav(subItem)}
                            className="text-left p-4 hover:bg-foreground/[0.04] transition-colors duration-150 border-0 bg-transparent cursor-pointer flex flex-col gap-3 rounded-sm group/sub"
                          >
                            <div className="w-10 h-10 shrink-0 bg-border border border-border flex items-center justify-center text-muted-foreground group-hover/sub:bg-primary/10 group-hover/sub:border-primary/20 group-hover/sub:text-primary transition-colors duration-150">
                              <Icon size={18} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-display font-black text-[16px] tracking-[-0.01em] text-foreground group-hover/sub:text-primary transition-colors duration-150 leading-tight">{subItem.label}</span>
                              <span className="font-text text-[12px] leading-relaxed text-muted-foreground">{subItem.desc}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleNav(item)}
                    variant="ghost"
                    size="sm"
                    className="px-0 font-text font-medium tracking-body hover:bg-transparent"
                  >
                    {item.label}
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-4 justify-self-end">
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" className="font-text">
                <Link href={dashboardHref}>
                  <LayoutDashboard size={14} strokeWidth={1.6} />
                  Dashboard
                </Link>
              </Button>
              <Button asChild className="font-text">
                <Link href="/book">Book a session call</Link>
              </Button>
            </>
          ) : null}
        </div>

        {/* Mobile actions */}
        <div className="flex lg:hidden items-center gap-2 justify-self-end">
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" size="icon">
                <Link href={dashboardHref} aria-label="Dashboard">
                  <LayoutDashboard size={15} strokeWidth={1.6} />
                </Link>
              </Button>
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
                className="flex flex-col gap-1.5"
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-px bg-foreground transition-all duration-[240ms] ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block w-5 h-px bg-foreground transition-all duration-[240ms] ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-px bg-foreground transition-all duration-[240ms] ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </Button>
            </>
          ) : null}
        </div>
      </nav>

      {/* Mobile menu drawer â€” only rendered when authenticated */}
      {isAuthenticated && (
        <div className={`fixed inset-0 top-16 z-40 bg-background flex flex-col lg:hidden transition-all duration-[300ms] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} overflow-y-auto pb-12`}>
          <div className="flex flex-col px-6 py-8 gap-1">
            {items.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <div className="py-4 border-b border-border">
                    <div className="font-display font-black text-[28px] tracking-hero text-foreground text-left w-full mb-5 opacity-40">
                      {item.label}
                    </div>
                    <div className="flex flex-col gap-4 pl-1">
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
      )}
    </>
  )
}
