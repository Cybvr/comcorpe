'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth'
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'

function dashboardPathForRole(role: string | undefined) {
  if (role === 'admin') return '/admin'
  if (role === 'talent') return '/talent/dashboard'
  return '/client/dashboard'
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

export default function ClientLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  function openDashboard(role: string | undefined) {
    router.push(dashboardPathForRole(role))
  }

  useEffect(() => {
    getRedirectResult(auth)
      .then(result => {
        if (result?.user) {
          setLoading('google')
          finishLogin(result.user)
        }
      })
      .catch(() => setError('Google sign-in failed. Please try again.'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function finishLogin(user: User) {
    const emailLower = user.email?.toLowerCase().trim() ?? ''
    let role = 'client'
    let matchedDocId: string | null = null

    try {
      const usersSnap = await getDocs(collection(db, 'users'))
      const existingDoc = usersSnap.docs.find(d => d.data().email?.toLowerCase() === emailLower)
      if (existingDoc) {
        role = existingDoc.data().role ?? 'client'
        matchedDocId = existingDoc.id
        await setDoc(doc(db, 'users', matchedDocId), { firebaseUid: user.uid }, { merge: true })
      }
    } catch (err) {
      console.error('Error matching user:', err)
    }

    if (!matchedDocId) {
      const prefix = emailLower.split('@')[0].replace(/[\._]/g, '-')
      const defaultName = user.displayName || prefix.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
      await setDoc(doc(db, 'users', prefix), {
        id: prefix,
        firebaseUid: user.uid,
        name: defaultName,
        email: emailLower,
        role: 'client',
        isOnboarded: false,
      })
    }

    openDashboard(role)
  }

  async function handleGoogle() {
    setError('')
    setLoading('google')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await finishLogin(result.user)
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider)
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.')
        setLoading(null)
      } else {
        setLoading(null)
      }
    }
  }

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading('email')
    try {
      const result = await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password)
      await finishLogin(result.user)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
        setError('Incorrect email or password.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many login attempts. Try again later.')
      } else {
        setError('Sign-in failed. Please try again.')
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-12">
          <Image src="/images/comcorpe.png" alt="Comcorpᵉ" width={160} height={40} className="h-10 w-auto object-contain" priority />
        </div>

        <div className="mb-8">
          <h1 className="font-display font-black text-[32px] tracking-hero text-foreground leading-tight mb-2">
            Client access
          </h1>
          <p className="font-text text-sm text-muted-foreground">
            Sign in to your Comcorpᵉ client dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogle}
            disabled={loading !== null}
            className="w-full flex items-center gap-3 px-4 py-3.5 border border-input bg-card font-text text-sm text-foreground hover:bg-card/80 hover:border-foreground/30 transition-colors duration-[120ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            <span className="flex-1 text-left">{loading === 'google' ? 'Signing in…' : 'Continue with Google'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-input" />
          <span className="font-mono text-[11px] text-muted-foreground/60 tracking-eyebrow uppercase">or</span>
          <div className="flex-1 h-px bg-input" />
        </div>

        <form onSubmit={handleEmailPassword} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
              className="w-full px-4 py-3.5 border border-input bg-card font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-[120ms]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 pr-12 border border-input bg-card font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-[120ms]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none transition-colors duration-[120ms]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading !== null}
            className="w-full py-3.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-[120ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'email' ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {error && (
          <p className="mt-4 font-text text-sm text-red-600 bg-red-50 px-4 py-3 border border-red-200">{error}</p>
        )}

        <p className="mt-10 font-mono text-[11px] text-muted-foreground/70 text-center tracking-[0.06em]">
          COMCORP<span className="gradient-e">E</span> · CLIENT PORTAL
        </p>
      </div>
    </div>
  )
}
