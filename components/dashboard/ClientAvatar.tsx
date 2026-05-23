'use client'

import Image from 'next/image'
import { Briefcase } from 'lucide-react'
import type { User } from '@/lib/user'

export default function ClientAvatar({
  client,
  sizeClass,
  iconSize,
  roundedClass = 'rounded-xl',
}: {
  client: User
  sizeClass: string
  iconSize: number
  roundedClass?: string
}) {
  return (
    <div className={`${sizeClass} ${roundedClass} bg-muted border border-border flex items-center justify-center text-input shrink-0 overflow-hidden relative`}>
      {client.image ? (
        <Image src={client.image} alt={client.name} fill className="object-cover" />
      ) : client.initials ? (
        <span className="font-display font-black text-[11px] text-foreground">{client.initials}</span>
      ) : (
        <Briefcase size={iconSize} strokeWidth={1.5} />
      )}
    </div>
  )
}
