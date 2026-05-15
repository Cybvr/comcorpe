'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Settings, Shield, Sun, SwitchCamera, User } from 'lucide-react'
import Link from 'next/link'
import { currentUser } from '@/lib/user'
import type { DashboardAudience } from './DashboardSidebar'

const searchPlaceholder: Record<DashboardAudience, string> = {
  talent: 'Search jobs, cases and resources',
  client: 'Search briefs, projects, talent and invoices',
  admin: 'Search talent, jobs and clients',
}

export default function DashboardHeader({
  audience = 'talent',
  onMenuClick,
}: {
  audience?: DashboardAudience
  onMenuClick?: () => void
}) {
  const [darkMode, setDarkMode] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

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

  // Close user menu on outside click
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

  const profileHref = audience === 'talent'
    ? '/talent/dashboard/profile'
    : '/client/dashboard/profile'

  const dashboardLinks = [
    { audience: 'client' as const, label: 'Client dashboard', href: '/client/dashboard', Icon: SwitchCamera },
    { audience: 'talent' as const, label: 'Talent dashboard', href: '/talent/dashboard', Icon: SwitchCamera },
    { audience: 'admin' as const, label: 'Admin', href: '/admin', Icon: Shield },
  ].filter((item) => item.audience !== audience)

  return (
    <header className="h-13 shrink-0 border-b border-ink-10 flex items-center gap-3 px-4 lg:px-6 bg-paper">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-1.5 -ml-1 text-ink-60 hover:text-ink hover:bg-ink-10 rounded-md transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 relative max-w-md">
        <Search size={14} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-40" />
        <input
          type="text"
          placeholder={searchPlaceholder[audience]}
          className="w-full pl-9 pr-4 py-2 text-sm bg-ink-10/60 border border-transparent rounded-lg text-ink placeholder:text-ink-40 focus:outline-none focus:border-ink-20 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          aria-label="Notifications"
          className="w-8 h-8 flex items-center justify-center rounded-full text-ink-60 hover:bg-ink-10 transition-colors cursor-pointer relative"
        >
          <Bell size={14} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue rounded-full" />
        </button>
        {/* User avatar + dropdown */}
        <div className="relative ml-1" ref={userMenuRef}>
          <button
            id="user-menu-button"
            type="button"
            aria-label="Open user menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-ink-10 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center font-display font-black text-[10px] text-paper shrink-0">
              {currentUser.initials}
            </div>
            <ChevronDown
              size={12}
              strokeWidth={2}
              className={`text-ink-40 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {userMenuOpen && (
            <div
              role="menu"
              aria-labelledby="user-menu-button"
              className="absolute right-0 top-full mt-2 w-56 bg-paper border border-ink-10 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-ink-10">
                <p className="font-display font-black text-[14px] tracking-[-0.01em] text-ink leading-tight">{currentUser.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mt-0.5 capitalize">{currentUser.role} · {currentUser.company}</p>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <Link
                  href={profileHref}
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 font-text text-sm text-ink-60 hover:bg-ink-10 hover:text-ink transition-colors"
                >
                  <User size={14} strokeWidth={1.5} className="shrink-0" />
                  My profile
                </Link>
                {dashboardLinks.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-text text-sm text-ink-60 hover:bg-ink-10 hover:text-ink transition-colors"
                  >
                    <Icon size={14} strokeWidth={1.5} className="text-blue shrink-0" />
                    {label}
                  </Link>
                ))}
                <button
                  role="menuitem"
                  onClick={() => { toggleDark(); setUserMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 font-text text-sm text-ink-60 hover:bg-ink-10 hover:text-ink transition-colors"
                >
                  {darkMode
                    ? <Sun size={14} strokeWidth={1.5} className="text-blue shrink-0" />
                    : <Moon size={14} strokeWidth={1.5} className="text-blue shrink-0" />}
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </button>
                <Link
                  href="#settings"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 font-text text-sm text-ink-60 hover:bg-ink-10 hover:text-ink transition-colors"
                >
                  <Settings size={14} strokeWidth={1.5} className="shrink-0" />
                  Settings
                </Link>
              </div>

              <div className="border-t border-ink-10 py-1.5">
                <button
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 font-text text-sm text-ink-60 hover:bg-red-50 hover:text-red-600 transition-colors"
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
