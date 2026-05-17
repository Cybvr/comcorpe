import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

  const cookieStore = await cookies()
  cookieStore.delete('cc_auth')

  return NextResponse.json({ ok: true })
}
