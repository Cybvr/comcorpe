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
  Settings,
  Shield,
  Sparkles,
  Users,
  Users2,
  BookOpen,
  CalendarDays,
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
  intelligenceItems?: SidebarItem[]
  supportItems: SidebarItem[]
}> = {
  talent: {
    label: 'Talent',
    root: '/talent/dashboard',
    primaryItems: [
      { icon: Home, label: 'Home', href: '/talent/dashboard' },
      { icon: Briefcase, label: 'Jobs', href: '/talent/dashboard/jobs' },
      { icon: FolderOpen, label: 'My work', href: '/talent/dashboard/work' },
      { icon: BookOpen, label: 'Articles', href: '/talent/dashboard/community', badge: 3 },
      { icon: Gift, label: 'Refer & grow', href: '/talent/dashboard/referrals' },
    ],
    supportItems: [
      { icon: Settings, label: 'Settings', href: '/talent/dashboard/settings' },
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
      { icon: Sparkles, label: 'Analytics', href: '/client/dashboard/analytics' },
      { icon: BookOpen, label: 'Insights', href: '/client/dashboard/insights' },
    ],
    supportItems: [
      { icon: Settings, label: 'Settings', href: '/client/dashboard/settings' },
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
      { icon: Users, label: 'Users', href: '/admin/users' },
      { icon: Users, label: 'People', href: '/admin/people' },
      { icon: Users2, label: 'Pods', href: '/admin/pods' },
      { icon: BookOpen, label: 'Articles', href: '/admin/posts' },
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
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-muted-foreground hover:bg-border hover:text-foreground'
        }`}
    >
      <Icon size={16} strokeWidth={1.8} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="font-mono text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

function DashboardSwitch({ audience }: { audience: DashboardAudience }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg bg-border p-1 mt-4">
      {(['talent', 'client'] as DashboardAudience[]).map((option) => {
        const config = dashboardConfig[option]
        const active = option === audience

        return (
          <Link
            key={option}
            href={config.root}
            className={`text-center rounded-md px-2 py-1.5 font-text text-xs font-semibold transition-colors ${active ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
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
    <aside className="w-64 lg:w-56 shrink-0 border-r border-border flex flex-col h-full overflow-y-auto bg-background shadow-2xl lg:shadow-none">
      <div className="px-4 pt-5 pb-4 border-b border-border relative">
        <Link href={config.root} className="flex items-center gap-2.5" onClick={onClose}>
          <Image src="/images/comcorpe.png" alt="Comcorpe" width={118} height={24} className="h-6 w-auto object-contain dark:invert" priority />
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 border-l border-input pl-2">
            {config.label}
          </span>
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute right-3 top-5 p-1 text-muted-foreground/70 hover:text-foreground transition-colors"
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

      {config.intelligenceItems && config.intelligenceItems.length > 0 && (
        <div className="px-3 py-2">
          <p className="px-3 mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-primary font-black">Intelligence Suite</p>
          <div className="flex flex-col gap-0.5">
            {config.intelligenceItems.map((item) => (
              <div key={item.href} onClick={onClose}>
                <SidebarLink item={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {config.supportItems.length > 0 && (
        <div className="p-3 border-t border-border">
          {audience === 'client' && (
            <button
              type="button"
              onClick={onClose}
              className="mb-2 flex w-full items-center gap-3 rounded-lg bg-foreground px-3 py-2.5 font-text text-sm font-semibold text-background transition-colors duration-150 hover:bg-primary hover:text-primary-foreground"
            >
              <CalendarDays size={16} strokeWidth={1.8} />
              <span className="flex-1 text-left">Book call</span>
            </button>
          )}
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
