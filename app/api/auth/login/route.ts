import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signSession, SESSION_COOKIE } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const { uid, role } = await request.json()
    if (!uid || !role) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const token = await signSession(uid, role)
    const store = await cookies()
    store.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
