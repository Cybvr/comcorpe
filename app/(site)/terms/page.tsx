import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { legalPages } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Terms of Service — Comcorpᵉ',
  description: 'Baseline terms for using Comcorpe websites, dashboards, and related services.',
}

export default function TermsPage() {
  return <LegalPage page={legalPages.terms} />
}
