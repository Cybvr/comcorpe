import { NextResponse } from 'next/server'

const isDev = process.env.NODE_ENV === 'development'

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' blob: data:",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com wss://*.firebaseio.com",
  "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://login.microsoftonline.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ')

function matchesPath(pathname, path) {
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function proxy(request) {
  const { pathname } = request.nextUrl

  if (matchesPath(pathname, '/dashboard')) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = pathname.replace('/dashboard', '/client/dashboard')
    return NextResponse.redirect(dashboardUrl)
  }

  const auth = request.cookies.get('cc_auth')?.value
  const role = request.cookies.get('cc_role')?.value ?? 'client'

  if (!auth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 1. Admin area protection: only admins can access /admin
  if (matchesPath(pathname, '/admin') && pathname !== '/admin/login') {
    if (role !== 'admin') {
      const fallbackUrl = new URL(role === 'talent' ? '/talent/dashboard' : '/client/dashboard', request.url)
      return NextResponse.redirect(fallbackUrl)
    }
  }

  // 2. Talent area protection: only talent and admins can access /talent/dashboard
  if (matchesPath(pathname, '/talent/dashboard')) {
    if (role !== 'talent' && role !== 'admin') {
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }
  }

  // 3. Client area protection: only clients and admins can access /client/dashboard
  if (matchesPath(pathname, '/client/dashboard')) {
    if (role !== 'client' && role !== 'admin') {
      return NextResponse.redirect(new URL('/talent/dashboard', request.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', CSP)
  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/talent/dashboard/:path*',
    '/client/dashboard/:path*',
    '/admin',
    '/admin/:path*',
  ],
}
