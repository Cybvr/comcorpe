'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import DashboardEventBanner from '@/components/dashboard/DashboardEventBanner'
import {
  BookOpen,
  Newspaper,
  Briefcase,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Gift,
  HelpCircle,
  Home,
  LayoutDashboard,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users,
  Users2,
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

const dashboardConfig: Record<
  DashboardAudience,
  {
    label: string
    root: string
    primaryItems: SidebarItem[]
    intelligenceItems?: SidebarItem[]
    supportItems: SidebarItem[]
  }
> = {
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
      { icon: Newspaper, label: 'Blog', href: '/admin/blog' },
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

function SidebarLink({
  item,
  collapsed = false,
}: {
  item: SidebarItem
  collapsed?: boolean
}) {
  const pathname = usePathname()
  const active = isActivePath(pathname, item.href)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      className={`flex items-center rounded-lg px-2.5 py-2 font-text text-sm transition-[color,background-color,padding] duration-150 ${
        collapsed ? 'justify-center' : 'gap-3'
      } ${
        active
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-muted-foreground hover:bg-border hover:text-foreground'
      }`}
    >
      <Icon size={16} strokeWidth={1.8} />
      {!collapsed && <span className="flex-1">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="min-w-[18px] rounded-full bg-primary px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

function DashboardSwitch({
  audience,
  collapsed = false,
}: {
  audience: DashboardAudience
  collapsed?: boolean
}) {
  if (collapsed) {
    return null
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-border p-1">
      {(['talent', 'client'] as DashboardAudience[]).map((option) => {
        const config = dashboardConfig[option]
        const active = option === audience

        return (
          <Link
            key={option}
            href={config.root}
            className={`rounded-md px-2 py-1.5 text-center font-text text-xs font-semibold transition-colors ${
              active ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
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
  collapsed = false,
  onToggleCollapse,
}: {
  audience: DashboardAudience
  onClose?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}) {
  const config = dashboardConfig[audience]

  return (
    <aside
      className={`flex h-full shrink-0 flex-col overflow-y-auto border-r border-border bg-background shadow-2xl transition-[width] duration-300 lg:shadow-none ${
        collapsed ? 'w-64 lg:w-20' : 'w-64 lg:w-56'
      }`}
    >
      <div className={`relative border-b border-border pt-4 pb-3 ${collapsed ? 'px-2.5' : 'px-3'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <Link
            href={config.root}
            className={`flex min-w-0 items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}
            onClick={onClose}
          >
            {collapsed ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground font-display text-sm font-black text-background">
                C
              </span>
            ) : (
              <>
                <Image
                  src="/images/comcorpe.png"
                  alt="Comcorpe"
                  width={118}
                  height={24}
                  className="h-6 w-auto object-contain dark:invert"
                  priority
                />
                <span className="border-l border-input pl-2 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                  {config.label}
                </span>
              </>
            )}
          </Link>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={`hidden h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-border hover:text-foreground lg:flex ${
                collapsed ? 'absolute top-4 right-3' : 'ml-auto'
              }`}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-5 right-3 p-1 text-muted-foreground/70 transition-colors hover:text-foreground lg:hidden"
        >
          <X size={18} />
        </button>

        {collapsed ? (
          <div className="mt-4 hidden justify-center lg:flex">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
              {config.label}
            </span>
          </div>
        ) : (
          <DashboardSwitch audience={audience} />
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Dashboard">
        {config.primaryItems.map((item) => (
          <div key={item.href} onClick={onClose}>
            <SidebarLink item={item} collapsed={collapsed} />
          </div>
        ))}
      </nav>

      <div className="px-2 pb-2">
        <DashboardEventBanner
          audience={audience}
          collapsed={collapsed}
          onNavigate={onClose}
        />
      </div>

      {config.intelligenceItems && config.intelligenceItems.length > 0 && (
        <div className="px-2 py-1.5">
          {!collapsed && (
            <p className="mb-1.5 px-2.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-primary">
              Intelligence Suite
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {config.intelligenceItems.map((item) => (
              <div key={item.href} onClick={onClose}>
                <SidebarLink item={item} collapsed={collapsed} />
              </div>
            ))}
          </div>
        </div>
      )}

      {config.supportItems.length > 0 && (
        <div className="border-t border-border p-2">
          {audience === 'client' && (
            <button
              type="button"
              onClick={onClose}
              title={collapsed ? 'Book call' : undefined}
              className={`mb-1.5 flex w-full items-center rounded-lg bg-foreground px-2.5 py-2 font-text text-sm font-semibold text-background transition-colors duration-150 hover:bg-primary hover:text-primary-foreground ${
                collapsed ? 'justify-center' : 'gap-3'
              }`}
            >
              <CalendarDays size={16} strokeWidth={1.8} />
              {!collapsed && <span className="flex-1 text-left">Book call</span>}
            </button>
          )}
          {config.supportItems.map((item) => (
            <div key={item.href} onClick={onClose}>
              <SidebarLink item={item} collapsed={collapsed} />
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
