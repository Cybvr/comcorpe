'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, ListChecks } from 'lucide-react'
import { CARD_FIELDS, type CardField } from '../config'

export default function CardFieldsMenu({
  fields,
  onToggle,
}: {
  fields: CardField[]
  onToggle: (id: CardField) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close when clicking outside the menu.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div ref={ref} className="relative self-start">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-text text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
      >
        <ListChecks size={13} />
        Card properties
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-border bg-background p-1.5 shadow-xl">
          <p className="px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            Show on cards
          </p>
          {CARD_FIELDS.map((field) => {
            const shown = fields.includes(field.id)
            return (
              <button
                key={field.id}
                onClick={() => onToggle(field.id)}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left hover:bg-muted transition-colors"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    shown ? 'border-foreground bg-foreground text-background' : 'border-border'
                  }`}
                >
                  {shown && <Check size={11} strokeWidth={3} />}
                </span>
                <span className="font-text text-xs text-foreground">{field.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
