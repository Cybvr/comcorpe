'use client'

import Link from 'next/link'
import type { DashboardAudience } from '@/components/dashboard/DashboardSidebar'

const EVENT_NAME = 'Comcorpe Signal'
const EVENT_HREF = '/blog'
const EVENT_LABELS: Record<DashboardAudience, string> = {
  talent: 'Talent event',
  client: 'Whats Happening',
  admin: 'Internal event',
}

export default function DashboardEventBanner({
  audience,
  collapsed = false,
  onNavigate,
}: {
  audience: DashboardAudience
  collapsed?: boolean
  onNavigate?: () => void
}) {
  if (collapsed) {
    return (
      <Link
        href={EVENT_HREF}
        onClick={onNavigate}
        title={EVENT_NAME}
        className="flex h-11 w-full items-center justify-center rounded-xl border border-primary/20 bg-primary/8 px-2 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary/12"
      >
        Live
      </Link>
    )
  }

  return (
    <Link
      href={EVENT_HREF}
      onClick={onNavigate}
      className="group block rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-background to-background px-4 py-4 transition-colors hover:border-primary/35"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
        {EVENT_LABELS[audience]}
      </p>
      <h3 className="mt-1 font-display text-[18px] leading-tight tracking-[-0.03em] text-foreground">
        {EVENT_NAME}
      </h3>
    </Link>
  )
}
