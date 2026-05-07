import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  const { email } = await request.json()

  const cookieStore = await cookies()
  cookieStore.set('cc_auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
