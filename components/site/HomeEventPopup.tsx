'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const DISMISS_KEY = 'comcorpe-home-event-popup-dismissed-v1'

export default function HomeEventBanner() {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === 'true'
    const frame = window.requestAnimationFrame(() => {
      setOpen(!dismissed)
      setReady(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, 'true')
    setOpen(false)
  }

  if (!ready || !open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={dismiss}
    >
      <div
        className="relative bg-background border border-foreground/20 max-w-sm w-full mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>

        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground block mb-4">
          What&apos;s Happening
        </span>

        <Link href="/blog" onClick={dismiss} className="block group">
          <h2 className="font-display font-black text-[28px] leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
            Comcorpe Signals
          </h2>
        </Link>
      </div>
    </div>
  )
}
