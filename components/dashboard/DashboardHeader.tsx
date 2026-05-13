'use client'

import { useEffect, useState } from 'react'
import { Bell, Menu, Moon, Search, Settings, Sun } from 'lucide-react'
import { currentUser } from '@/lib/user'

type DashboardAudience = 'talent' | 'client'

const searchPlaceholder: Record<DashboardAudience, string> = {
  talent: 'Search jobs, cases and resources',
  client: 'Search briefs, projects, talent and invoices',
}

export default function DashboardHeader({
  audience = 'talent',
  onMenuClick,
}: {
  audience?: DashboardAudience
  onMenuClick?: () => void
}) {
  const [darkMode, setDarkMode] = useState(false)

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

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

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
          onClick={toggleDark}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-8 h-8 flex items-center justify-center rounded-full text-ink-60 hover:bg-ink-10 transition-colors cursor-pointer"
        >
          {darkMode ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="w-8 h-8 flex items-center justify-center rounded-full text-ink-60 hover:bg-ink-10 transition-colors cursor-pointer relative"
        >
          <Bell size={14} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue rounded-full" />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="w-8 h-8 flex items-center justify-center rounded-full text-ink-60 hover:bg-ink-10 transition-colors cursor-pointer"
        >
          <Settings size={14} strokeWidth={1.5} />
        </button>
        <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center font-display font-black text-[11px] text-paper ml-1">
          {currentUser.initials}
        </div>
      </div>
    </header>
  )
}
