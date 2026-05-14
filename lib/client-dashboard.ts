export interface ClientHelpTopic {
  id: number
  title: string
  body: string
}

export const clientHelpTopics: ClientHelpTopic[] = [
  {
    id: 1,
    title: 'Submitting a brief',
    body: 'Turn a growth problem into a clear operating brief with outcomes, constraints, timeline, and approval owners.',
  },
  {
    id: 2,
    title: 'Reviewing pod recommendations',
    body: 'Compare recommended operators by fit, market evidence, availability, and the decisions needed before kickoff.',
  },
  {
    id: 3,
    title: 'Managing active projects',
    body: 'Track phases, milestones, client inputs, and the next review point for every live Comcorpe engagement.',
  },
  {
    id: 4,
    title: 'Billing and approvals',
    body: 'See open invoices, draft charges, paid retainers, and milestone context before finance signs off.',
  },
]

export const clientReferral = {
  link: 'https://app.comcorpe.e/client/r/jide...',
  channels: ['Email', 'LinkedIn', 'Board channel'],
  clientShare: '3%',
  talentShare: '1%',
  summary: 'Introduce another company or a senior operator and track rewards when referred work closes.',
}
