'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const emailLower = email.toLowerCase().trim()
    const isComcorpeEmail = emailLower.endsWith('@comcorpe.e') || emailLower.endsWith('@comcorpe.com')
    const isCorrectPassword = password === 'growthengine2026'

    await new Promise(r => setTimeout(r, 400)) // brief loading feel

    if (!isComcorpeEmail) {
      setError('Access is restricted to Comcorpᵉ team members.')
      setLoading(false)
      return
    }

    if (!isCorrectPassword) {
      setError('Incorrect password.')
      setLoading(false)
      return
    }

    // Set auth cookie via API route
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailLower }),
    })

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Image
            src="/images/comcorpe.png"
            alt="Comcorpᵉ"
            width={160}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>

        <div className="mb-8">
          <h1 className="font-display font-black text-[32px] tracking-hero text-ink leading-tight mb-2">
            Team access
          </h1>
          <p className="font-text text-sm text-ink-60">
            Sign in with your Comcorpᵉ email address.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-60">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@comcorpe.e"
              required
              className="w-full px-4 py-3.5 border border-ink-20 bg-white font-text text-sm text-ink placeholder:text-ink-40 focus:outline-none focus:border-ink transition-colors duration-[120ms]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••••"
              required
              className="w-full px-4 py-3.5 border border-ink-20 bg-white font-text text-sm text-ink placeholder:text-ink-40 focus:outline-none focus:border-ink transition-colors duration-[120ms]"
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
            className="mt-2 w-full py-4 bg-ink text-paper font-text text-sm font-semibold hover:bg-blue transition-colors duration-[120ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 font-mono text-[11px] text-ink-40 text-center tracking-[0.06em]">
          COMCORP<span className="gradient-e">E</span> · TEAM PORTAL
        </p>
      </div>
    </div>
  )
}
