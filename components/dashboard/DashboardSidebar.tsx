'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Briefcase,
  CreditCard,
  FolderOpen,
  Gift,
  HelpCircle,
  Home,
  LayoutDashboard,
  MessageCircle,
  Search,
  Shield,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type DashboardAudience = 'talent' | 'client' | 'admin'

type SidebarItem = {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
}

const dashboardConfig: Record<DashboardAudience, {
  label: string
  root: string
  primaryItems: SidebarItem[]
  supportItems: SidebarItem[]
}> = {
  talent: {
    label: 'Talent',
    root: '/talent/dashboard',
    primaryItems: [
      { icon: Home, label: 'Home', href: '/talent/dashboard' },
      { icon: Briefcase, label: 'Jobs', href: '/talent/dashboard/jobs' },
      { icon: FolderOpen, label: 'My work', href: '/talent/dashboard/work' },
      { icon: MessageCircle, label: 'Community', href: '/talent/dashboard/community', badge: 3 },
      { icon: CreditCard, label: 'Billing', href: '/talent/dashboard/billing' },
      { icon: Gift, label: 'Refer & grow', href: '/talent/dashboard/referrals' },
    ],
    supportItems: [
      { icon: HelpCircle, label: 'Help centre', href: '/talent/dashboard/help' },
    ],
  },
  client: {
    label: 'Client',
    root: '/client/dashboard',
    primaryItems: [
      { icon: Home, label: 'Home', href: '/client/dashboard' },
      { icon: Briefcase, label: 'My Jobs', href: '/client/dashboard/jobs' },
      { icon: Search, label: 'Search', href: '/client/dashboard/search', badge: 3 },
      { icon: MessageCircle, label: 'Community', href: '/client/dashboard/community' },
      { icon: CreditCard, label: 'Billing', href: '/client/dashboard/billing' },
      { icon: Gift, label: 'Refer & grow', href: '/client/dashboard/referrals' },
    ],
    supportItems: [
      { icon: HelpCircle, label: 'Help centre', href: '/client/dashboard/help' },
    ],
  },
  admin: {
    label: 'Admin',
    root: '/admin',
    primaryItems: [
      { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
      { icon: Users, label: 'Talent', href: '/admin/talent' },
      { icon: Briefcase, label: 'Jobs', href: '/admin/jobs' },
      { icon: Shield, label: 'Clients', href: '/admin/clients' },
    ],
    supportItems: [],
  },
}

function isActivePath(pathname: string, href: string) {
  if (href === '/talent/dashboard' || href === '/client/dashboard' || href === '/admin') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarLink({ item }: { item: SidebarItem }) {
  const pathname = usePathname()
  const active = isActivePath(pathname, item.href)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-text text-sm transition-colors duration-150 ${active
          ? 'bg-blue/10 text-blue font-semibold'
          : 'text-ink-60 hover:bg-ink-10 hover:text-ink'
        }`}
    >
      <Icon size={16} strokeWidth={1.8} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="font-mono text-[10px] font-bold bg-blue text-paper px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

function DashboardSwitch({ audience }: { audience: DashboardAudience }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg bg-ink-10 p-1 mt-4">
      {(['talent', 'client', 'admin'] as DashboardAudience[]).map((option) => {
        const config = dashboardConfig[option]
        const active = option === audience

        return (
          <Link
            key={option}
            href={config.root}
            className={`text-center rounded-md px-2 py-1.5 font-text text-xs font-semibold transition-colors ${active ? 'bg-paper text-blue shadow-sm' : 'text-ink-60 hover:text-ink'
              }`}
          >
            {config.label}
          </Link>
        )
      })}
    </div>
  )
}

export default function DashboardSidebar({
  audience,
  onClose,
}: {
  audience: DashboardAudience
  onClose?: () => void
}) {
  const config = dashboardConfig[audience]

  return (
    <aside className="w-64 lg:w-56 shrink-0 border-r border-ink-10 flex flex-col h-full overflow-y-auto bg-paper shadow-2xl lg:shadow-none">
      <div className="px-4 pt-5 pb-4 border-b border-ink-10 relative">
        <Link href={config.root} className="flex items-center gap-2.5" onClick={onClose}>
          <Image src="/images/comcorpe.png" alt="Comcorpe" width={118} height={24} className="h-6 w-auto object-contain dark:invert" priority />
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 border-l border-ink-20 pl-2">
            {config.label}
          </span>
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute right-3 top-5 p-1 text-ink-40 hover:text-ink transition-colors"
        >
          <X size={18} />
        </button>

        <DashboardSwitch audience={audience} />
      </div>

      <nav className="flex flex-col gap-0.5 p-3 flex-1" aria-label="Dashboard">
        {config.primaryItems.map((item) => (
          <div key={item.href} onClick={onClose}>
            <SidebarLink item={item} />
          </div>
        ))}
      </nav>

      {config.supportItems.length > 0 && (
        <div className="p-3 border-t border-ink-10">
          {config.supportItems.map((item) => (
            <div key={item.href} onClick={onClose}>
              <SidebarLink item={item} />
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
