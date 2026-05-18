import type { Metadata } from 'next'
import InsightsContent from './InsightsContent'

export const metadata: Metadata = {
  title: 'Insights — Comcorpᵉ',
  description: 'Pan-African telecoms and fintech insights for market growth systems.',
}

export default function InsightsPage() {
  return <InsightsContent />
}
