import { Metadata } from 'next'
import React from 'react'
import './globals.css'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import CookieConsent from '@/components/CookieConsent'
import FloatingVideoAvatar from '@/components/FloatingVideoAvatar'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Comcorpᵉ — A Growth Systems Company',
    template: '%s — Comcorpᵉ',
  },
  description: 'Comcorpᵉ orchestrates data, creativity, technology and strategy into unified growth systems.',
  robots: 'noindex, nofollow',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Comcorpe',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-background text-foreground font-text antialiased leading-body tracking-body">
        <ServiceWorkerRegistration />
        <div className="bg-black px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-white">
          Comcorpe: Alpha Version V1.
        </div>
        {children}
        <FloatingVideoAvatar />
        <CookieConsent />
      </body>
    </html>
  )
}
