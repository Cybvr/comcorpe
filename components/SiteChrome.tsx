'use client'

import React from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HomeEventBanner from '@/components/site/HomeEventPopup'
import { useCurrentUser } from '@/lib/user'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const authState = useCurrentUser()

  return (
    <div className="site-shell">
      <HomeEventBanner />
      <Nav authState={authState} />
      {children}
      {authState.isAuthenticated && <Footer />}
    </div>
  )
}
