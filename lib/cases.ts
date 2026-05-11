export interface Case {
  slug: string;
  number: string;
  title: string;
  solution: string;
  arena: string;
  lede: string;
  client: {
    name: string;
    description: string;
  };
  problem: string;
  phases: {
    label: string;
    body: string;
  }[];
  outcome: {
    summary: string;
    stats: {
      value: string;
      label: string;
    }[];
  };
}

export const cases: Case[] = [
  {
    slug: 'market-entry',
    number: 'Case 01',
    title: 'Volta Pay',
    solution: 'Market Entry',
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
  {
    slug: 'growth-stagnation',
    number: 'Case 02',
    title: 'Kade Foods',
    solution: 'Growth Stagnation',
    arena: 'Consumer & Brand Ecosystems',
    lede: 'A regional consumer goods challenger had distribution, awareness, and loyal buyers, but revenue had flattened across its core channels.',
    client: {
      name: 'Kade Foods',
      description: 'A West African food and beverage company with strong retail presence, looking to move beyond a two-year growth plateau.',
    },
    problem: `The brand was visible, the product was liked, and the sales team was busy. But growth had become noisy instead of directional. Promotions were not tied to margin, field reports were not informing channel decisions, and leadership could not see which territories, SKUs, or trade partners were actually compounding.`,
    phases: [
      {
        label: 'Architect',
        body: `Mapped SKU velocity, distributor incentives, modern trade margins, and territory performance. Identified two constraints: weak visibility at the point of sale and an incentive structure that rewarded activity over profitable repeat orders.`,
      },
      {
        label: 'Assemble',
        body: `Configured a focused pod: an FMCG commercial operator, a trade marketing strategist, a field sales analyst, and a retail comms designer. The team was built for commercial unblocking, not a broad brand campaign.`,
      },
      {
        label: 'Operate',
        body: `Installed a weekly sales rhythm, rebuilt the distributor scorecard, redesigned priority-SKU messaging, and ran a 12-week rep incentive sprint across three territories. Feedback from the field was folded into channel decisions every Friday.`,
      },
    ],
    outcome: {
      summary: `The plateau broke without a full rebrand or structural hiring cycle. Kade Foods left with a sharper growth cadence, a reusable channel scorecard, and a clearer view of where profitable volume was actually coming from.`,
      stats: [
        { value: '+18%', label: 'Revenue run-rate lift' },
        { value: '12wk', label: 'Commercial reset sprint' },
        { value: '3', label: 'Territories rewired' },
        { value: '6', label: 'Priority SKUs refocused' },
      ],
    },
  },
  {
    slug: 'opportunity-creation',
    number: 'Case 03',
    title: 'GridWell',
    solution: 'Opportunity Creation',
    arena: 'Public Infrastructure & Impact Systems',
    lede: 'A distributed energy operator needed a new growth lane that could turn infrastructure capability into recurring commercial demand.',
    client: {
      name: 'GridWell',
      description: 'A distributed energy operator serving commercial and public-sector clients, seeking a repeatable route into underserved SME clusters.',
    },
    problem: `GridWell had credible technical capacity, but its pipeline was reactive: tenders, introductions, and one-off installation briefs. The stronger opportunity was not being requested by the market yet. It had to be originated, validated, packaged, and made investable before sales could scale.`,
    phases: [
      {
        label: 'Architect',
        body: `Studied SME clusters, power reliability pain points, anchor-tenant economics, financing constraints, and local decision networks. Framed a new Growth Play: bundled energy-as-a-service for commercial clusters with shared infrastructure and staged onboarding.`,
      },
      {
        label: 'Assemble',
        body: `Brought together an infrastructure finance analyst, a public-sector liaison, a B2B sales operator, and a product strategist. The pod was configured to convert a market signal into a board-ready opportunity, not simply produce a pitch deck.`,
      },
      {
        label: 'Operate',
        body: `Built the Strategic Opportunity Brief, validated demand in two clusters, secured anchor conversations, modelled the first rollout economics, and created the governance structure required for the client to move from approval to pilot.`,
      },
    ],
    outcome: {
      summary: `A new revenue lane moved from signal to approved pilot. GridWell gained a packaged commercial model, early demand validation, and a pipeline it could pursue with partners instead of waiting for the next tender cycle.`,
      stats: [
        { value: '8wk', label: 'Signal to pilot approval' },
        { value: '2', label: 'Clusters validated' },
        { value: '5', label: 'Anchor conversations opened' },
        { value: '$1.2m', label: 'Qualified pilot pipeline' },
      ],
    },
  },
  {
    slug: 'wieldquest',
    number: 'Case 01',
    title: 'wieldquest',
    solution: 'Opportunity Creation',
    arena: 'Creative & Agency Operations',
    lede: `Our teams were using AI. We couldn't tell if any of it was working.`,
    client: {
      name: 'bbdowa',
      description: 'A West African creative group operating across multiple agency units, looking to build genuine AI capability in their people — and a reliable way to measure whether it was actually developing.',
    },
    problem: `The problem wasn't access to AI tools. It was knowing how to use them well. Creatives had the tools but no benchmark for good. There was no way to separate effective AI use from noise, no shared standard for what strong output looked like, and no visibility into whether skills were improving over time. Existing training gave people information. Nothing gave them practice under pressure, scored feedback, or a reason to keep getting better.`,
    phases: [
      {
        label: 'Architect',
        body: `Defined the three dimensions that actually matter in AI-assisted work: productivity, creativity, and token efficiency. Built a scoring rubric across five criteria — strategic clarity, creative quality, token efficiency, craft, and innovation — that could evaluate all three from a single submission. Designed a challenge format around real brief archetypes, with a fixed token budget that made efficiency visible and comparable across every player.`,
      },
      {
        label: 'Assemble',
        body: `Assembled a pod of challenge designers, creative directors, and engineers to build and run the system. Challenge briefs were validated against live account scenarios to keep stakes real. Engineers shipped the scoring engine, leaderboard, and submission pipeline in parallel. Leaders from three agency units — BBDO West Africa, DDB Lagos, and Casers Group — were brought in as the first cohort to stress-test the rubric before wider rollout.`,
      },
      {
        label: 'Operate',
        body: `Launched wieldquest as a live, rolling platform. Players received a brief, a 1,000-token budget, and a deadline. Submissions were scored across all five dimensions and ranked on a live leaderboard. Each cycle, briefs were iterated based on where scores clustered and where they stalled — harder constraints where the cohort plateaued, more open prompts where participation dropped. Players got a score, a rank, and a clear read on exactly where their AI use was strong and where it wasn't.`,
      },
    ],
    outcome: {
      summary: `bbdowa left with a live training platform, a measurable baseline for AI skill across three agency units, and a scoring system that makes productivity, creativity, and token efficiency visible — without classroom time or passive content.`,
      stats: [
        { value: '+41%', label: 'avg score improvement, first cycle' },
        { value: '3 units', label: 'agency divisions scored and ranked' },
        { value: '92%', label: 'player retention, 12-week cycle' },
        { value: '1,000', label: 'token budget per challenge brief' },
      ],
    },
  },
]

export function getCaseBySlug(slug: string): Case | null {
  return cases.find(c => c.slug === slug) ?? null
}
