'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Settings, Shield, Sun, SwitchCamera } from 'lucide-react'
import Link from 'next/link'
import { useJobs } from '@/lib/jobs'
import { getClientUser, useCurrentUser } from '@/lib/user'
import type { DashboardAudience } from './DashboardSidebar'

export default function DashboardHeader({
  audience = 'talent',
  onMenuClick,
}: {
  audience?: DashboardAudience
  onMenuClick?: () => void
}) {
  const router = useRouter()
  const { user: currentUser } = useCurrentUser()
  const { jobs } = useJobs()
  const [darkMode, setDarkMode] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const searchableJobs = jobs.filter((job) => {
    if (audience === 'client') return job.clientId === currentUser?.clientId
    return true
  })

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const matchingJobs = normalizedSearch
    ? searchableJobs
      .filter((job) =>
        [job.title, job.clientId, job.summary, job.location, ...job.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      )
      .slice(0, 6)
    : []

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)

    if (isDark) {
      document.documentElement.classList.add('dark')
    }

    const frame = requestAnimationFrame(() => setDarkMode(isDark))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchQuery('')
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

  const profileHref = audience === 'talent'
    ? '/talent/dashboard/settings'
    : '/client/dashboard/settings'

  const dashboardLinks = [
    { audience: 'client' as const, label: 'Client dashboard', href: '/client/dashboard', Icon: SwitchCamera },
    { audience: 'talent' as const, label: 'Talent dashboard', href: '/talent/dashboard', Icon: SwitchCamera },
    { audience: 'admin' as const, label: 'Admin', href: '/admin', Icon: Shield },
  ].filter((item) => item.audience !== audience)

  const getJobHref = (slug: string) => {
    if (audience === 'client') return `/client/dashboard/jobs/${slug}`
    if (audience === 'talent') return `/talent/dashboard/jobs/${slug}`
    return '/admin/jobs'
  }

  const handleJobSelect = (slug: string) => {
    setSearchQuery('')
    router.push(getJobHref(slug))
  }

  return (
    <header className="h-13 shrink-0 border-b border-border flex items-center gap-3 px-4 lg:px-6 bg-background">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 -ml-1 text-muted-foreground hover:text-foreground hover:bg-border rounded-md transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Search size={14} strokeWidth={1.8} className="text-muted-foreground/70" />
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-border/60 border border-transparent rounded-lg text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-input transition-all"
        />
        {normalizedSearch && (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
            {matchingJobs.length > 0 ? (
              matchingJobs.map((job) => {
                const clientName = getClientUser(job.clientId).name

                return (
                  <button
                    key={job.slug}
                    type="button"
                    onClick={() => handleJobSelect(job.slug)}
                    className="flex w-full items-start justify-between gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-text text-sm font-semibold text-foreground">{job.title}</span>
                      <span className="block truncate font-text text-xs text-muted-foreground">
                        {clientName} - {job.status}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                      Job
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="px-4 py-3 font-text text-sm text-muted-foreground">
                No jobs found.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          aria-label="Notifications"
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-border transition-colors cursor-pointer relative"
        >
          <Bell size={14} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        <div className="relative ml-1" ref={userMenuRef}>
          <button
            id="user-menu-button"
            type="button"
            aria-label="Open user menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-border transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center font-display font-black text-[10px] text-background shrink-0">
              {currentUser?.initials ?? ''}
            </div>
            <ChevronDown
              size={12}
              strokeWidth={2}
              className={`text-muted-foreground/70 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {userMenuOpen && (
            <div
              role="menu"
              aria-labelledby="user-menu-button"
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
      </div>
    </header>
  )
}
