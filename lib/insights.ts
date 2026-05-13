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

export const insights: Insight[] = [
  {
    slug: 'distribution-is-africas-real-network',
    eyebrow: 'Pan-African Telecoms',
    title: "Distribution is Africa's real network.",
    description: 'Across African markets, mobile reach is only the starting point. Advantage sits in agent density, local trust, product packaging, and everyday utility.',
    meta: 'Market Rails',
    lede: 'Mobile coverage creates the possibility of participation. Distribution, trust, affordability, and everyday usefulness decide whether people actually use the rail.',
    thesis: [
      'Africa has moved past the simple question of whether mobile networks matter. They already sit under finance, retail, media, public services, and informal commerce.',
      'The more useful question is where adoption stalls. In many markets, the constraint is no longer only network reach. It is device affordability, confidence, digital safety, agent support, and whether the product earns a place in daily routines.',
    ],
    signals: [
      {
        title: 'Coverage is not the same as usage.',
        body: "GSMA's 2025 Africa mobile economy work puts mobile internet users at 416 million, while noting that almost three quarters of the population remain unconnected and that the usage gap is the bigger barrier than coverage.",
        refs: [1],
      },
      {
        title: 'The mobile sector is already system-level infrastructure.',
        body: 'GSMA estimates that mobile technologies and services contributed $220 billion to African GDP in 2024, or 7.7% of GDP, with the contribution expected to rise by 2030.',
        refs: [1],
      },
      {
        title: 'Trust and safety are part of the adoption stack.',
        body: 'The World Bank Global Findex 2025 added mobile ownership, internet use, and digital safety to its financial inclusion dataset, a useful reminder that connectivity and confidence have to be read together.',
        refs: [2],
      },
    ],
    implications: [
      'Treat mobile distribution as a behaviour system, not a media channel.',
      'Design around affordability, device constraints, field support, and local trust cues before scaling spend.',
      'Build feedback loops from agents, retailers, and frontline teams into product and pricing decisions.',
    ],
    sources: [
      {
        title: 'The Mobile Economy Africa 2025',
        publisher: 'GSMA',
        year: '2025',
        href: 'https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/africa/',
      },
      {
        title: 'The Global Findex Database 2025: Report',
        publisher: 'World Bank',
        year: '2025',
        href: 'https://www.worldbank.org/en/publication/globalfindex/report',
      },
    ],
  },
  {
    slug: 'trust-compounds-before-transactions',
    eyebrow: 'African Fintech',
    title: 'Trust compounds before transactions.',
    description: 'Fintech growth across Africa depends on more than acquisition. Users, merchants, regulators, liquidity partners, and support channels all have to reinforce the promise.',
    meta: 'Financial Systems',
    lede: 'The fintech race is not simply a race for sign-ups. Durable growth comes from making money movement feel reliable, useful, and safe enough to repeat.',
    thesis: [
      'African fintech has strong structural demand because financial access, payments, merchant tools, credit, and informal commerce are still being reorganised by digital rails.',
      'But the winners are not just the fastest acquirers. They are the operators that turn onboarding into confidence, confidence into usage, and usage into monetisation without losing regulatory or customer trust.',
    ],
    signals: [
      {
        title: 'Fintech is still the anchor sector in African tech.',
        body: 'Partech reports that fintech remained the largest African tech funding sector in 2025, with $1.49 billion in total equity and debt funding and the highest deal count.',
        refs: [1],
      },
      {
        title: 'The upside remains tied to cash displacement.',
        body: 'McKinsey described African fintech as coming of age in 2022, while noting that cash still accounted for roughly 90% of transactions across the continent.',
        refs: [2],
      },
      {
        title: 'Mobile money is becoming daily financial infrastructure.',
        body: "GSMA's 2026 mobile-money report says mobile money processed more than $2 trillion in 2025, with merchant payments growing fastest as usage shifts from access toward everyday transactions.",
        refs: [3],
      },
      {
        title: 'Digital finance depends on digital confidence.',
        body: 'Global Findex 2025 brings digital safety into the same frame as account ownership, payments, saving, and borrowing, which is the right lens for African fintech adoption.',
        refs: [4],
      },
    ],
    implications: [
      'Make reliability, reversals, support, and dispute handling visible in the product experience.',
      'Treat merchants and agents as trust infrastructure, not only acquisition channels.',
      'Sequence credit, wallets, payments, and merchant services around observed usage rather than abstract total addressable market.',
    ],
    sources: [
      {
        title: '2025 Africa Tech Venture Capital Report',
        publisher: 'Partech',
        year: '2026',
        href: 'https://partechpartners.com/africa-reports/2025-africa-tech-venture-capital-report',
      },
      {
        title: 'Fintech in Africa: The end of the beginning',
        publisher: 'McKinsey & Company',
        year: '2022',
        href: 'https://www.mckinsey.com/za/our-insights/fintech-in-africa-the-end-of-the-beginning/',
      },
      {
        title: 'State of the Industry Report on Mobile Money 2026',
        publisher: 'GSMA',
        year: '2026',
        href: 'https://www.gsma.com/sotir/',
      },
      {
        title: 'The Global Findex Database 2025: Report',
        publisher: 'World Bank',
        year: '2025',
        href: 'https://www.worldbank.org/en/publication/globalfindex/report',
      },
    ],
  },
  {
    slug: 'route-to-market-is-the-growth-engine',
    eyebrow: 'Pan-African FMCG',
    title: 'Route-to-market is the growth engine.',
    description: 'FMCG growth across Africa depends on getting pricing, visibility, distributor incentives, retail execution, and field feedback working in the same rhythm.',
    meta: 'Consumer Systems',
    lede: 'In African consumer markets, growth is often decided between the warehouse, distributor, retailer, and shelf before a campaign ever has a chance to work.',
    thesis: [
      'FMCG operators cannot treat route-to-market as plumbing. The route is where demand is interpreted, stock availability is won or lost, retail trust is built, and pricing discipline is tested.',
      'The strongest consumer systems will connect field execution, retail visibility, distributor incentives, embedded finance, and category decisions into one operating rhythm.',
    ],
    signals: [
      {
        title: 'Broad retail distribution is harder, not easier.',
        body: "NIQ's 2024 Africa FMCG report notes that the route to broad retail distribution is no longer straightforward for small and medium FMCG businesses.",
        refs: [1],
      },
      {
        title: 'Pricing, promotion, distribution, and data now move together.',
        body: 'NIQ frames distribution approaches, pricing strategy, promotional tactics, and data utilisation as linked growth questions for African FMCG businesses.',
        refs: [1],
      },
      {
        title: 'The new FMCG stack blends goods, payments, and credit.',
        body: 'TechCrunch reported that OmniRetail digitises order management across manufacturers, distributors, and informal retailers in Nigeria, Ghana, and Ivory Coast while layering working capital and digital payments into the flow.',
        refs: [2],
      },
      {
        title: 'Embedded finance follows distribution scale.',
        body: "The same OmniRetail reporting shows why retailer-level transaction data and logistics density matter before credit can be responsibly added to FMCG rails.",
        refs: [2],
      },
    ],
    implications: [
      'Build route-to-market scorecards before brand campaigns scale.',
      'Make distributor incentives, retail visibility, and stock movement visible in one cadence.',
      'Use field data to decide category focus, promotion design, credit rules, and sales deployment.',
    ],
    sources: [
      {
        title: 'An Inside Look at African Small and Medium FMCG Businesses in 2024',
        publisher: 'NIQ',
        year: '2024',
        href: 'https://nielseniq.com/global/en/insights/report/2024/an-inside-look-at-african-small-and-medium-fmcg-businesses-in-2024/',
      },
      {
        title: "OmniRetail shakes up Africa's B2B e-commerce market with $20M Series A",
        publisher: 'TechCrunch',
        year: '2025',
        href: 'https://techcrunch.com/2025/04/28/omniretail-shakes-up-africas-b2b-e-commerce-market-with-20m-series-a/',
      },
    ],
  },
  {
    slug: 'airtime-data-wallets-and-credit-are-converging',
    eyebrow: 'Telco x Fintech',
    title: 'Airtime, data, wallets, and credit are converging.',
    description: 'The strongest pan-African plays will connect telecom distribution with financial behaviour, turning market rails into products people use repeatedly.',
    meta: 'Convergence',
    lede: 'The next growth plays will not sit neatly inside telco, fintech, or commerce silos. They will connect identity, usage, payments, inventory, credit, and support.',
    thesis: [
      'Telco rails already touch daily life through airtime, data, agents, handsets, and customer relationships. Fintech rails turn those touchpoints into value movement.',
      'The opportunity is not to staple wallets onto every product. It is to design useful loops where mobile access, financial behaviour, and trade activity make each other stronger.',
    ],
    signals: [
      {
        title: 'Mobile reach gives the convergence base.',
        body: "GSMA's Africa mobile economy report shows the scale of the mobile rail, while its usage-gap data shows why distribution and affordability still decide adoption.",
        refs: [1],
      },
      {
        title: 'Mobile money is moving deeper into commerce.',
        body: "GSMA's 2026 mobile-money report identifies merchant payments as the fastest-growing mobile-money use case, signalling a shift toward everyday commercial utility.",
        refs: [2],
      },
      {
        title: 'Fintech remains a capital and activity anchor.',
        body: 'Partech shows fintech still leading African tech by total funding and deal activity in 2025, even as capital spreads into commerce, enterprise, and other practical infrastructure sectors.',
        refs: [3],
      },
      {
        title: 'Commerce rails are becoming finance rails.',
        body: "OmniRetail's West African model shows how FMCG ordering, payments, logistics, retailer data, and working capital can be combined inside one operating system.",
        refs: [4],
      },
    ],
    implications: [
      'Build partnerships around shared operating data, not only co-branded campaigns.',
      'Use airtime, data, merchant payments, and inventory signals to design repeatable credit and loyalty loops.',
      'Treat convergence as an execution problem across product, compliance, channel, and field operations.',
    ],
    sources: [
      {
        title: 'The Mobile Economy Africa 2025',
        publisher: 'GSMA',
        year: '2025',
        href: 'https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/africa/',
      },
      {
        title: 'State of the Industry Report on Mobile Money 2026',
        publisher: 'GSMA',
        year: '2026',
        href: 'https://www.gsma.com/sotir/',
      },
      {
        title: '2025 Africa Tech Venture Capital Report',
        publisher: 'Partech',
        year: '2026',
        href: 'https://partechpartners.com/africa-reports/2025-africa-tech-venture-capital-report',
      },
      {
        title: "OmniRetail shakes up Africa's B2B e-commerce market with $20M Series A",
        publisher: 'TechCrunch',
        year: '2025',
        href: 'https://techcrunch.com/2025/04/28/omniretail-shakes-up-africas-b2b-e-commerce-market-with-20m-series-a/',
      },
    ],
  },
]

export function getInsightBySlug(slug: string): Insight | null {
  return insights.find(insight => insight.slug === slug) ?? null
}
