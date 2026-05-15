import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { legalPages } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy — Comcorpᵉ',
  description: 'How Comcorpe handles account, engagement, and contact information.',
}

export default function PrivacyPage() {
  return <LegalPage page={legalPages.privacy} />
}
