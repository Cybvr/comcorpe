import { NextResponse } from 'next/server'

function matchesPath(pathname, path) {
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function proxy(request) {
  const { pathname } = request.nextUrl

  if (matchesPath(pathname, '/dashboard')) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = pathname.replace('/dashboard', '/talent/dashboard')
    return NextResponse.redirect(dashboardUrl)
  }

  const auth = request.cookies.get('cc_auth')?.value

  if (!auth) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/talent/dashboard/:path*', '/client/dashboard/:path*'],
}
