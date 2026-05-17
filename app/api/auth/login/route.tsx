import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// In-memory rate limiter: 5 attempts per 15 minutes per IP
const attempts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const window = 15 * 60 * 1000
  const max = 5
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + window })
    return false
  }
  if (entry.count >= max) return true
  entry.count++
  return false
}

function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  const host = request.headers.get('host') ?? ''
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const idToken =
    body && typeof body === 'object' && 'idToken' in body
      ? (body as { idToken: unknown }).idToken
      : undefined

  if (!idToken || typeof idToken !== 'string') {
    return NextResponse.json({ error: 'Missing ID token' }, { status: 400 })
  }

  // Verify the Firebase ID token via Firebase REST API
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const verifyRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  )

  if (!verifyRes.ok) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const data = await verifyRes.json()
  const firebaseUser = data.users?.[0]

  if (!firebaseUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 })
  }

  const email: string = firebaseUser.email ?? ''
  const allowed =
    email.endsWith('@comcorpe.com') ||
    process.env.NODE_ENV !== 'production'

  if (!allowed) {
    return NextResponse.json({ error: 'Unauthorised email domain' }, { status: 403 })
  }

  const role =
    body && typeof body === 'object' && 'role' in body && typeof (body as any).role === 'string'
      ? (body as any).role
      : 'client'

  // Store the Firebase UID and role in session cookies
  const cookieStore = await cookies()
  cookieStore.set('cc_auth', firebaseUser.localId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  cookieStore.set('cc_role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
