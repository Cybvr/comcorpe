'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CreditCard, Gift, Settings, ShieldCheck, User } from 'lucide-react'
import type React from 'react'

const settingsItems = [
  { label: 'General', href: '/client/dashboard/settings', icon: User },
  { label: 'Billing', href: '/client/dashboard/settings/billing', icon: CreditCard },
  { label: 'Refer & grow', href: '/client/dashboard/settings/referrals', icon: Gift },
  { label: 'Quality', href: '/client/dashboard/settings/quality', icon: ShieldCheck },
]

function isActive(pathname: string, href: string) {
  if (href === '/client/dashboard/settings') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function ClientSettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto">
      <div className="mb-8 border-b border-border pb-5">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Settings size={16} strokeWidth={1.5} />
          <p className="font-mono text-xs uppercase tracking-eyebrow font-black">Settings</p>
        </div>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">
          Client settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
        <nav className="lg:sticky lg:top-6 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" aria-label="Client settings">
          {settingsItems.map((item) => {
            const Icon = item.icon
            const active = isActive(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-text text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-border hover:text-foreground'
                }`}
              >
                <Icon size={15} strokeWidth={1.7} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
