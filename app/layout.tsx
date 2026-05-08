import { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Comcorpᵉ — A Growth Systems Company',
  description: 'Comcorpᵉ orchestrates data, creativity, technology and strategy into unified growth systems.',
  robots: 'noindex, nofollow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-paper text-ink font-text antialiased leading-body tracking-body">
        {children}
      </body>
    </html>
  )
}
