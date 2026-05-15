'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isAdminAuthed, adminLogout } from '@/lib/admin/store'

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/talent', label: 'Talent' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/clients', label: 'Clients' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAdminAuthed() && pathname !== '/admin/login') {
      router.replace('/admin/login')
    } else {
      setReady(true)
    }
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>
  if (!ready) return null

  function handleLogout() {
    adminLogout()
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col font-text">
      {/* Top bar */}
      <header className="border-b border-ink-10 bg-paper sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-mono text-[11px] tracking-eyebrow uppercase text-ink font-semibold">
              COMCORP<span className="text-blue">E</span> · Admin
            </span>
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map(item => {
                const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 font-text text-sm transition-colors duration-100 ${
                      active
                        ? 'bg-ink text-paper'
                        : 'text-ink-60 hover:text-ink hover:bg-ink-10'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-40 hover:text-ink transition-colors duration-100"
          >
            Sign out
          </button>
        </div>
        {/* Mobile nav */}
        <div className="flex md:hidden px-6 pb-3 gap-1 overflow-x-auto">
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 font-text text-sm whitespace-nowrap transition-colors duration-100 ${
                  active
                    ? 'bg-ink text-paper'
                    : 'text-ink-60 hover:text-ink hover:bg-ink-10'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </header>

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </div>
  )
}
