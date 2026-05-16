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

export const clientInsights: ClientInsight[] = [
  {
    id: 1,
    slug: 'route-to-market-redesign-high-trust-channels',
    authorId: 'yetunde-bello',
    author: 'Yetunde Bello',
    role: 'Market Entry Lead',
    badge: 'Market Entry',
    title: 'Route-to-market redesign for entering high-trust African channels',
    body: 'The growth plan usually breaks when distribution, trust, and service coverage are designed separately. We map the route-to-market motion around the partners buyers already trust, then sequence direct acquisition once the operating rhythm is proven.',
    detail:
      'For client teams, the useful pattern is to treat route-to-market as an operating system: partner selection, service standards, commercial incentives, sales enablement, and feedback loops all need to reinforce the same growth thesis.',
    likes: 18,
    replies: 5,
    category: 'Growth Ops',
  },
  {
    id: 2,
    slug: 'revenue-operations-scorecard-growth-handoffs',
    authorId: 'daniel-osei',
    author: 'Daniel Osei',
    role: 'Revenue Operations Advisor',
    badge: 'Revenue Ops',
    title: 'Revenue operations scorecard: when growth stalls inside handoffs',
    body: 'Pipeline problems are often operating model problems. Before adding spend, audit the conversion handoffs between demand, sales, onboarding, customer success, and finance to see where revenue momentum is leaking.',
    detail:
      'The scorecard should make ownership visible: stage conversion, response time, pricing discipline, onboarding cycle time, churn risk, and expansion signals. That gives leadership a practical view of which operating fixes will move growth fastest.',
    likes: 12,
    replies: 4,
    category: 'Operations',
  },
  {
    id: 3,
    slug: 'ai-pilots-measurable-commercial-growth',
    authorId: 'kemi-adaora',
    author: 'Kemi Adaora',
    role: 'Transformation Strategist',
    badge: 'Transformation',
    title: 'Operating model moves that turn AI pilots into measurable growth',
    body: 'AI pilots rarely create growth unless the surrounding workflow changes. The teams getting value are redesigning decision rights, data quality, frontline routines, and performance management around the new capability.',
    detail:
      'Start with the work, not the tool. Pick one commercial workflow with clear value at stake, define the decision that should get better, then wire the process, data, adoption routines, and KPIs around that decision.',
    likes: 24,
    replies: 9,
    category: 'AI Enablement',
  },
]

export const growthConsultingHeadlines: GrowthHeadline[] = [
  {
    id: 1,
    source: 'Bain & Company',
    headline: 'B2B Growth Masters’ Formula for Repeatably Capturing New Customers',
    href: 'https://www.bain.com/insights/b2b-growth-masters-formula-for-repeatably-capturing-new-customers-b2b-growth-agenda-2026/',
  },
  {
    id: 2,
    source: 'Bain & Company',
    headline: 'The New Sales Productivity Equation',
    href: 'https://www.bain.com/insights/the-new-sales-productivity-equation-b2b-growth-agenda-2026/',
  },
  {
    id: 3,
    source: 'Bain & Company',
    headline: 'AI Won’t Transform Your Go-to-Market Until You Transform the Work',
    href: 'https://www.bain.com/insights/ai-wont-transform-your-go-to-market-until-you-transform-the-work-b2b-growth-agenda-2026/',
  },
  {
    id: 4,
    source: 'McKinsey & Company',
    headline: 'The race to rewire operations: How the story unfolded in 2025',
    href: 'https://www.mckinsey.com/capabilities/operations/our-insights/the-race-to-rewire-operations-how-the-story-unfolded-in-2025',
  },
  {
    id: 5,
    source: 'BCG',
    headline: 'Reduce Costs or Grow? Successful Transformations Achieve Both.',
    href: 'https://www.bcg.com/publications/2025/cut-costs-or-grow-great-transformations-achieve-both',
  },
]

export function getClientInsightBySlug(slug: string) {
  return clientInsights.find((insight) => insight.slug === slug) ?? null
}
