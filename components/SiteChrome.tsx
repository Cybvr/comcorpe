'use client'

import React from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useCurrentUser } from '@/lib/user'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const authState = useCurrentUser()

  return (
    <>
      <Nav authState={authState} />
      {children}
      {authState.isAuthenticated && <Footer />}
    </>
  )
}
