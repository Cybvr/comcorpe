export interface InsightSource {
  title: string
  publisher: string
  year: string
  href: string
}

export interface InsightSignal {
  title: string
  body: string
  refs: number[]
}

export interface Insight {
  slug: string
  eyebrow: string
  title: string
  description: string
  meta: string
  lede: string
  thesis: string[]
  signals: InsightSignal[]
  implications: string[]
  sources: InsightSource[]
}

export const insights: Insight[] = []

export function getInsightBySlug(slug: string): Insight | null {
  return insights.find(insight => insight.slug === slug) ?? null
}
