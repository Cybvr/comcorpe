import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/session'

const PUBLIC_PATHS = ['/', '/login', '/blog', '/provocation', '/model', '/arenas']

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith('/blog/')) return true
  if (pathname.startsWith('/api/')) return true
  if (pathname.startsWith('/_next/')) return true
  if (pathname.startsWith('/images/')) return true
  return false
}

const ROLE_PREFIXES: Record<string, string[]> = {
  admin:  ['/admin'],
  client: ['/client'],
  talent: ['/talent'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access: redirect to their own dashboard if hitting the wrong area
  const allowedPrefixes = ROLE_PREFIXES[session.role] ?? []
  const isAdmin = session.role === 'admin'
  if (!isAdmin && allowedPrefixes.every(p => !pathname.startsWith(p))) {
    const fallback = session.role === 'talent' ? '/talent/dashboard' : '/client/dashboard'
    return NextResponse.redirect(new URL(fallback, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
