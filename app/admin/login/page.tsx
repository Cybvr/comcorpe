'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import HighTechLoading from '@/components/HighTechLoading'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const emailLower = email.toLowerCase().trim()
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    const isComcorpeEmail = emailLower.endsWith('@comcorpe.com') || isLocalhost

    if (!isComcorpeEmail) {
      setError('Access restricted to internal admin team.')
      setLoading(false)
      return
    }

    // Set auth cookie via API route
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailLower }),
    })

    setShowLoadingOverlay(true)
    
    // Artificial delay to show the cool loading screen
    setTimeout(() => {
      router.push('/admin')
      router.refresh()
    }, 4500)
  }

  if (showLoadingOverlay) {
    return <HighTechLoading />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-[360px]">
        <div className="mb-10 text-center lg:text-left">
          <p className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground/70 mb-4">
            COMCORP<span className="text-primary">E</span>
          </p>
          <h1 className="font-display text-[28px] tracking-hero text-foreground leading-tight">
            Admin access
          </h1>
          <p className="font-text text-sm text-muted-foreground mt-2">
            Internal use only. Sign in with your team email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@comcorpe.com"
              required
              autoFocus
              className="w-full px-4 py-3.5 border border-input bg-card font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100"
            />
          </div>

          {error && (
            <p className="font-text text-sm text-red-600 bg-red-50 px-4 py-3 border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-50"
          >
            {loading ? 'Entering…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
