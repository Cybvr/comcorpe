'use client'

import Image from 'next/image'
import { BadgeCheck } from 'lucide-react'
import { getOmnicomAffiliate } from '@/lib/user'

interface NetworkAffiliateBadgeProps {
  affiliations: string[]
  size?: number
}

export default function NetworkAffiliateBadge({
  affiliations,
  size = 16,
}: NetworkAffiliateBadgeProps) {
  if (!affiliations || affiliations.length === 0) return null

  const uniqueAffiliations = affiliations.filter(
    (affiliation, index) => affiliations.indexOf(affiliation) === index
  )

  return (
    <div className="flex items-center gap-1.5" aria-label="Network Affiliations">
      <BadgeCheck
        size={size}
        strokeWidth={2}
        className="text-green-500 shrink-0"
        aria-label="Network Affiliate"
      />

      {uniqueAffiliations.map((affiliation) => {
        const affiliate = getOmnicomAffiliate(affiliation)
        const logoSize = Math.max(size * 3, 36)

        if (affiliate?.logo) {
          return (
            <span
              key={affiliation}
              className="inline-flex h-6 items-center bg-white px-2 py-1"
              title={affiliate.label}
            >
              <Image
                src={affiliate.logo}
                alt={affiliate.label}
                width={logoSize}
                height={size + 8}
                className="h-3.5 w-auto object-contain"
              />
            </span>
          )
        }

        return (
          <span
            key={affiliation}
            className="inline-flex h-6 items-center rounded-md border border-border bg-muted px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground"
            title={affiliation}
          >
            {affiliation}
          </span>
        )
      })}
    </div>
  )
}
