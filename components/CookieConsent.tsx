'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cc_cookie_consent')) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem('cc_cookie_consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cc_cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-foreground text-background rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
        <p className="font-text text-sm text-background/80 flex-1">
          We use essential cookies to keep you signed in. See our{' '}
          <Link href="/cookies" className="underline underline-offset-2 hover:text-primary transition-colors">
            Cookie Policy
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-primary transition-colors">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="font-text text-sm text-background/60 hover:text-background transition-colors px-4 py-2"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="font-text text-sm font-semibold bg-primary text-white rounded-xl px-5 py-2 hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
