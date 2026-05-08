import { NextResponse } from 'next/server'

export default function proxy(request) {
  const { pathname } = request.nextUrl
  const auth = request.cookies.get('cc_auth')?.value

  // Allow login page and API routes through
  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login
  if (!auth) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
