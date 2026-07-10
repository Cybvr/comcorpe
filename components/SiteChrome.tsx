'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HomeEventBanner from '@/components/site/HomeEventPopup'
import SiteWideHeading from '@/components/site/SiteWideHeading'
import { useCurrentUser } from '@/lib/user'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const authState = useCurrentUser()
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <div className="site-shell">
      {!isHomePage && <HomeEventBanner />}
      {!isHomePage && <Nav authState={authState} />}
      {!isHomePage && <SiteWideHeading />}
      {children}
      {!isHomePage && authState.isAuthenticated && <Footer />}
    </div>
  )
}
