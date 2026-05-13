import { NextResponse } from 'next/server'

function talentProxy(request) {
  const { pathname } = request.nextUrl

  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = pathname.replace('/dashboard', '/talent/dashboard')
    return NextResponse.redirect(dashboardUrl)
  }

  const auth = request.cookies.get('cc_auth')?.value

  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  if (!auth) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const proxy = talentProxy
export default talentProxy

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
