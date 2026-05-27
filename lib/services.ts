export type Service = {
  id: string
  slug: string
  title: string
  shortTitle: string
  strapline: string
  summary: string
  category: string
  idealFor: string[]
  deliverables: string[]
  outcomes: string[]
}

export const typicalJobs = [
  'Market entry',
  'Brand refresh',
  'Consumer research',
  'Growth strategy',
  'Influencer strategy',
  'Regional expansion',
  'Analytics / dashboarding',
]

export const services: Service[] = [
  {
    id: '01',
    slug: 'market-entry',
    title: 'Market Entry',
    shortTitle: 'Entry',
    strapline: 'Entry plans for brands expanding into unfamiliar markets with different category codes, media dynamics, and customer behavior.',
    summary:
      'We help teams enter new territories with a working market thesis, operating assumptions, and activation path grounded in local commercial reality.',
    category: 'Expansion',
    idealFor: [
      'Brands entering Nigeria or broader African markets',
      'Regional teams testing a new city or country',
      'Operators needing local insight before media spend scales',
    ],
    deliverables: [
      'Market landscape and competitor framing',
      'Audience, proposition, and go-to-market recommendations',
      'Entry roadmap with near-term experiments and risk flags',
    ],
    outcomes: [
      'Faster path from research to action',
      'Reduced waste from copying foreign playbooks',
      'Clearer confidence on where and how to enter',
    ],
  },
  {
    id: '02',
    slug: 'brand-refresh',
    title: 'Brand Refresh',
    shortTitle: 'Refresh',
    strapline: 'Brand recalibration for companies that have outgrown their current look, language, or market meaning.',
    summary:
      'We identify where the brand is lagging the business, then rebuild the visible system so the company can show up with more clarity, credibility, and edge.',
    category: 'Brand',
    idealFor: [
      'Businesses evolving into a new category or customer segment',
      'Teams with inconsistent identity across channels',
      'Operators preparing for a major growth phase or relaunch',
    ],
    deliverables: [
      'Brand audit and strategic repositioning',
      'Updated messaging, verbal cues, and design direction',
      'Implementation guidance for digital and campaign touchpoints',
    ],
    outcomes: [
      'Stronger brand coherence across teams',
      'A more credible market presence',
      'A sharper platform for future campaigns and sales',
    ],
  },
  {
    id: '03',
    slug: 'consumer-research',
    title: 'Consumer Research',
    shortTitle: 'Research',
    strapline: 'Decision-ready research that turns customer ambiguity into practical direction for product, brand, and growth teams.',
    summary:
      'We structure focused research programs that surface motivations, blockers, language, and category cues that teams can actually build around.',
    category: 'Insight',
    idealFor: [
      'Teams needing clarity before repositioning or launching',
      'Operators seeing stagnant conversion without obvious cause',
      'Leaders making high-cost bets with weak customer evidence',
    ],
    deliverables: [
      'Research design and interview or survey framework',
      'Insight synthesis with patterns, tensions, and opportunities',
      'Actionable recommendations tied to product and marketing choices',
    ],
    outcomes: [
      'Better strategic decisions with less internal guesswork',
      'Sharper customer language and proposition design',
      'Improved alignment between teams on what users actually need',
    ],
  },
  {
    id: '04',
    slug: 'growth-strategy',
    title: 'Growth Strategy',
    shortTitle: 'Strategy',
    strapline: 'Integrated growth planning that connects ambition to channel choices, capability gaps, and measurable operating priorities.',
    summary:
      'We help leadership teams translate broad growth goals into a system of choices about positioning, acquisition, retention, experimentation, and execution ownership.',
    category: 'Strategy',
    idealFor: [
      'Founders and executives navigating a new growth phase',
      'Teams with activity but no shared growth model',
      'Companies needing one plan across product, sales, and marketing',
    ],
    deliverables: [
      'Growth diagnosis and priority map',
      'Strategic roadmap with metrics, experiments, and owners',
      'Operating cadence for review, iteration, and accountability',
    ],
    outcomes: [
      'Clearer focus on the highest-leverage bets',
      'Improved coordination across teams',
      'A reusable operating model for growth decisions',
    ],
  },
  {
    id: '05',
    slug: 'influencer-strategy',
    title: 'Influencer Strategy',
    shortTitle: 'Influence',
    strapline: 'Influence programs designed around credibility, narrative fit, and measurable business contribution rather than vanity.',
    summary:
      'We define the right creator roles, partnerships, and amplification mechanics for brands that need influence to move perception or action.',
    category: 'Communications',
    idealFor: [
      'Brands launching culture-facing products or campaigns',
      'Teams with creator spend but weak outcomes',
      'Operators needing a more disciplined influence model',
    ],
    deliverables: [
      'Creator ecosystem mapping and selection criteria',
      'Campaign structure, content guardrails, and briefing system',
      'Measurement model for brand and commercial impact',
    ],
    outcomes: [
      'Better creator-brand fit',
      'More defensible influence investments',
      'Stronger downstream performance from partnership activity',
    ],
  },
  {
    id: '06',
    slug: 'regional-expansion',
    title: 'Regional Expansion',
    shortTitle: 'Expansion',
    strapline: 'Regional scaling support for companies moving from one stronghold to a wider multi-market footprint.',
    summary:
      'We help businesses expand with operating clarity across market sequencing, proposition adaptation, and the governance required to keep growth coherent.',
    category: 'Scale',
    idealFor: [
      'Companies scaling from one core market into several',
      'Regional operators needing coordinated rollout logic',
      'Leaders balancing local nuance with group consistency',
    ],
    deliverables: [
      'Expansion sequencing and readiness criteria',
      'Localized rollout framework and shared standards',
      'Cross-market reporting and learning loops',
    ],
    outcomes: [
      'Fewer expansion missteps',
      'Better transfer of what works across markets',
      'A more resilient regional operating system',
    ],
  },
  {
    id: '07',
    slug: 'analytics-dashboarding',
    title: 'Analytics and Dashboarding',
    shortTitle: 'Analytics',
    strapline: 'Measurement systems that turn scattered reporting into a usable decision surface for operators and leadership.',
    summary:
      'We audit metrics, define the reporting spine, and structure dashboards so teams can see what is happening, why it matters, and what needs attention next.',
    category: 'Measurement',
    idealFor: [
      'Teams with fragmented reporting across tools or vendors',
      'Leaders lacking confidence in current metrics',
      'Operators who need clearer visibility into funnel and campaign performance',
    ],
    deliverables: [
      'Measurement framework and KPI definitions',
      'Dashboard specification and reporting logic',
      'Cadence for review, interpretation, and action',
    ],
    outcomes: [
      'Better visibility into performance',
      'Faster, more grounded decision-making',
      'A cleaner reporting foundation for growth operations',
    ],
  },
]

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug)
}