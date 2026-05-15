'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/lib/admin/store'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (adminLogin(password)) {
      router.replace('/admin')
    } else {
      setError('Incorrect password.')
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 font-text">
      <div className="w-full max-w-[360px]">
        <div className="mb-10">
          <p className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-40 mb-4">
            COMCORP<span className="text-blue">E</span>
          </p>
          <h1 className="font-display text-[28px] tracking-hero text-ink leading-tight">
            Admin access
          </h1>
          <p className="font-text text-sm text-ink-60 mt-2">
            Internal use only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              autoFocus
              className="w-full px-4 py-3.5 border border-ink-20 bg-white font-text text-sm text-ink placeholder:text-ink-40 focus:outline-none focus:border-ink transition-colors duration-100"
            />
          </div>

          {error && (
            <p className="font-text text-sm text-red-600 bg-red-50 px-4 py-3 border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-ink text-paper font-text text-sm font-semibold hover:bg-blue transition-colors duration-100"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
