'use client'

import { BadgeCheck } from 'lucide-react'

interface NetworkAffiliateBadgeProps {
  affiliations: string[]
  size?: number
}

export default function NetworkAffiliateBadge({
  affiliations,
  size = 16,
}: NetworkAffiliateBadgeProps) {
  if (!affiliations || affiliations.length === 0) return null

  return (
    <BadgeCheck
      size={size}
      strokeWidth={2}
      className="text-green-500 shrink-0"
      aria-label="Network Affiliate"
    />
  )
}
