import { Metadata } from 'next'
import React from 'react'
import './globals.css'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import CookieConsent from '@/components/CookieConsent'
import FloatingVideoAvatar from '@/components/FloatingVideoAvatar'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Comcorpᵉ — A Growth Systems Company',
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
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="bg-background text-foreground font-text antialiased leading-body tracking-body">
        <ServiceWorkerRegistration />
        {children}
        <FloatingVideoAvatar />
        <CookieConsent />
      </body>
    </html>
  )
}
