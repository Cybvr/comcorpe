export interface HelpTopic {
  id: number
  slug: string
  title: string
  body: string
  sections: {
    title: string
    body: string
  }[]
  checklist: string[]
}

export const helpTopics: HelpTopic[] = [
  {
    id: 1,
    slug: 'submitting-a-brief',
    title: 'Submitting a brief',
    body: 'Turn a growth problem into a clear operating brief with outcomes, constraints, timeline, and approval owners.',
    sections: [
      {
        title: 'What belongs in the brief',
        body: 'A strong brief names the business outcome, the market context, the internal owner, the timeline pressure, and the constraints the pod should respect. Keep the problem plain and specific so operators can design around the real decision.',
      },
      {
        title: 'How the brief is reviewed',
        body: 'After submission, Comcorpe reviews the ask for clarity, commercial value, and execution shape. If the work is ready to scope, it moves into pod recommendation. If the ask is too broad, your account operator will ask for sharper decision inputs before matching talent.',
      },
      {
        title: 'What happens next',
        body: 'You will see the brief appear in Jobs with its current status. Early-stage briefs usually sit in Scoping until the work package, budget range, and operator mix are clear enough for review.',
      },
    ],
    checklist: [
      'Name the business outcome, not just the activity.',
      'Add known constraints such as budget, location, compliance, or launch dates.',
      'Include the internal approval owner and the next decision date.',
    ],
  },
  {
    id: 2,
    slug: 'reviewing-pod-recommendations',
    title: 'Reviewing pod recommendations',
    body: 'Compare recommended operators by fit, market evidence, availability, and the decisions needed before kickoff.',
    sections: [
      {
        title: 'Reading a recommendation',
        body: 'A recommendation is not just a talent list. It explains why the operators fit the market, what evidence supports the match, and what decision the client needs to make before the team is assembled.',
      },
      {
        title: 'Approving or refining a pod',
        body: 'Approve the recommendation when the role mix, availability, and commercial range match the job. If something is off, use the review notes to request a narrower market focus, different seniority, or a different operating model.',
      },
      {
        title: 'Shortlist hygiene',
        body: 'Keep the shortlist small enough to compare well. Three to five operators or one focused pod usually produces better decisions than a broad bench of loosely matched profiles.',
      },
    ],
    checklist: [
      'Compare fit evidence before comparing rates.',
      'Check availability against your kickoff date.',
      'Resolve missing roles before approving the pod.',
    ],
  },
  {
    id: 3,
    slug: 'managing-active-projects',
    title: 'Managing active projects',
    body: 'Track phases, milestones, client inputs, and the next review point for every live Comcorpe engagement.',
    sections: [
      {
        title: 'Project status',
        body: 'Active work shows the current phase, the next review date, upcoming milestones, and recent updates. Use the job detail page as the source of truth for where the engagement stands.',
      },
      {
        title: 'Milestones and reviews',
        body: 'Milestones mark contractual or operational checkpoints. Review dates are the moments where the client, account operator, and talent lead align on progress, risks, and decisions needed to keep momentum.',
      },
      {
        title: 'When work changes',
        body: 'If scope, timing, or budget changes, capture the change inside the job context before it becomes an invoice or delivery issue. This keeps billing, delivery, and expectations in the same frame.',
      },
    ],
    checklist: [
      'Review recent updates before each status call.',
      'Confirm the next milestone owner and due date.',
      'Flag scope changes before delivery work continues.',
    ],
  },
  {
    id: 4,
    slug: 'billing-and-approvals',
    title: 'Billing and approvals',
    body: 'See open invoices, draft charges, paid retainers, and milestone context before finance signs off.',
    sections: [
      {
        title: 'Invoice context',
        body: 'Invoices are connected to jobs and, when available, to milestones. That context helps finance understand what the charge relates to before approving or querying payment.',
      },
      {
        title: 'Approval flow',
        body: 'Open invoices should be checked against the job scope, current milestone, and internal approval rules. Paid invoices remain visible for spend history and reporting.',
      },
      {
        title: 'Disputes and corrections',
        body: 'If an amount, milestone, or label looks wrong, pause approval and raise it with your account operator. Corrections should happen before payment so the engagement record stays clean.',
      },
    ],
    checklist: [
      'Match each invoice to its job before approval.',
      'Check milestone status and date.',
      'Escalate disputed charges before marking them approved.',
    ],
  },
]

export function getHelpTopic(slug: string) {
  return helpTopics.find((topic) => topic.slug === slug) ?? null
}

export const clientReferral = {
  link: 'https://app.comcorpe.e/client/r/jide...',
  channels: ['Email', 'LinkedIn', 'Board channel'],
  clientShare: '3%',
  talentShare: '1%',
  summary: 'Introduce another company or a senior operator and track rewards when referred work closes.',
}
