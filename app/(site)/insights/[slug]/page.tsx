import type { Metadata } from 'next'
import InsightContent from './InsightContent'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return {
    title: 'Insight — Comcorpᵉ',
    description: 'Pan-African telecoms and fintech insights for market growth systems.',
  }
}

export default function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  return <InsightContent params={params} />
}
