export interface ClientInsight {
  id: number
  slug: string
  authorId: string
  author: string
  role: string
  badge: string
  title: string
  body: string
  detail: string
  likes: number
  replies: number
  category: string
}

export interface GrowthHeadline {
  id: number
  source: string
  headline: string
  href: string
}

export const clientInsights: ClientInsight[] = []

export const growthConsultingHeadlines: GrowthHeadline[] = []

export function getClientInsightBySlug(slug: string) {
  return clientInsights.find((insight) => insight.slug === slug) ?? null
}
