export const cases = [
  {
    slug: 'market-entry',
    number: 'Case 01',
    title: 'Market Entry',
    arena: 'Technology & Fintech',
    lede: 'A UK-based digital payments company with a proven product in Europe needed a commercial architecture to enter Nigeria.',
    client: {
      name: 'Volta Pay',
      description: 'A UK-based digital payments company with a proven product in Europe, seeking to enter Nigeria as their first African market.',
    },
    problem: `They had capital, a working product, and ambition. What they didn't have was a commercial architecture for the Nigerian market — no local partnerships, no regulatory pathway, no understanding of how trust is built with Nigerian merchants and consumers at the ground level.`,
    phases: [
      {
        label: 'Architect',
        body: `Mapped the unit economics specific to Nigeria — merchant acquisition costs, transaction margins, churn patterns in comparable fintechs. Designed a go-to-market sequence: anchor in Lagos, build credibility through aggregator partnerships before going direct.`,
      },
      {
        label: 'Assemble',
        body: `Configured a pod of four: a Nigerian fintech commercial lead, a regulatory affairs operator with CBN experience, a brand and comms strategist, and a performance marketing specialist. None were on a permanent bench — all configured for this brief.`,
      },
      {
        label: 'Operate',
        body: `Executed a phased launch over 14 weeks. Secured three anchor merchant partnerships in week six. Iterated messaging after early data showed trust — not speed — was the primary conversion driver.`,
      },
    ],
    outcome: {
      summary: `Live in market in under four months. A documented market entry playbook owned by Volta Pay — reusable for the next market.`,
      stats: [
        { value: '<4mo', label: 'Live in market' },
        { value: '3', label: 'Anchor partnerships pre-launch' },
        { value: '10k', label: 'Transactions in first 6 weeks' },
        { value: '14wk', label: 'Phased launch timeline' },
      ],
    },
  },
]

export function getCaseBySlug(slug) {
  return cases.find(c => c.slug === slug) ?? null
}
