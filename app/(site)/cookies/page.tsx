import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { legalPages } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Cookie Policy — Comcorpᵉ',
  description: 'How Comcorpe uses cookies and browser storage.',
}

export default function CookiesPage() {
  return <LegalPage page={legalPages.cookies} />
}
