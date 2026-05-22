'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { featuredBlogPost, getBlogHref } from '@/lib/blog'

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
    <div className="w-full bg-primary text-primary-foreground px-4 py-2.5 flex items-center justify-center gap-4 text-sm">
      <span className="font-mono text-[10px] uppercase tracking-eyebrow opacity-70 shrink-0">
        {featuredBlogPost.category}
      </span>
      <p className="font-text font-semibold truncate">
        {featuredBlogPost.title}
      </p>
      <Link
        href={getBlogHref(featuredBlogPost.slug)}
        className="inline-flex items-center gap-1.5 shrink-0 font-text text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        Read more <ArrowRight size={12} />
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  )
}
