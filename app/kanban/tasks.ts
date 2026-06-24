// Seed tasks for the Comcorpᵉ Recruitment Campaign 2026 kanban board.
// All tasks start In Progress, Medium priority, owned by jide.pinheiro@comcorpe.com,
// dated 23 June 2026.

export type Status = 'backlog' | 'in-progress' | 'review' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  owners: string[]
  date: string // ISO date
  tags: string[]
}

export const COLUMNS: { id: Status; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
]

const base = {
  status: 'in-progress' as Status,
  priority: 'medium' as Priority,
  owners: ['jide.pinheiro@comcorpe.com'],
  date: '2026-06-23',
}

export const SEED_TASKS: Task[] = [
  {
    ...base,
    id: 'step-1',
    title: 'Step 1 — Build The Target List',
    description:
      'Identify specialists who could add value: referrals, professional communities, previous engagements, universities, industry networks, trusted recommendations. Goal: find people we would confidently deploy on a client challenge.',
    tags: ['Step', 'Sourcing'],
  },
  {
    ...base,
    id: 'step-2',
    title: 'Step 2 — Reach Out',
    description:
      'Introduce Comcorpᵉ and start a conversation: who we are, what we are building, how the StrikeTeam model works, why we selected them. Then ask: “Would you be open to exploring future collaboration opportunities with Comcorpᵉ?”',
    tags: ['Step', 'Outreach'],
  },
  {
    ...base,
    id: 'step-3',
    title: 'Step 3 — Have A Conversation',
    description:
      'Schedule a call to learn what they do best, the challenges they enjoy solving, their experience, and the work they want. Explain the Comcorpᵉ vision, the Capability Network, and what participation looks like. Confirm mutual fit.',
    tags: ['Step', 'Discovery'],
  },
  {
    ...base,
    id: 'step-4',
    title: 'Step 4 — Align On Expectations',
    description:
      'Discuss how we would work together: availability, rates, ways of working, payment terms, confidentiality, intellectual property. Ensure expectations are clear before moving forward.',
    tags: ['Step', 'Commercials'],
  },
  {
    ...base,
    id: 'step-5',
    title: 'Step 5 — Complete Registration',
    description:
      'Invite candidates to complete the Comcorpᵉ Specialist Registration Form, capturing professional background, areas of expertise, industry experience, portfolio links, availability and commercial preferences. This becomes their profile in the network.',
    tags: ['Step', 'Onboarding'],
  },
  {
    ...base,
    id: 'step-6',
    title: 'Step 6 — Review And Approve',
    description:
      'Assess relevance of expertise, quality of experience, evidence of past delivery, and alignment with our work. The goal is not the biggest network — it is a trusted network.',
    tags: ['Step', 'Review'],
  },
  {
    ...base,
    id: 'step-7',
    title: 'Step 7 — Welcome To The Network',
    description:
      'Formally admit approved specialists into the Comcorpᵉ Capability Network — a curated ecosystem of experts who may be invited into future StrikeTeams. Marks the start of an ongoing relationship.',
    tags: ['Step', 'Onboarding'],
  },
  {
    ...base,
    id: 'step-8',
    title: 'Step 8 — Assemble StrikeTeams',
    description:
      'When a client challenge arrives, identify the capabilities required and assemble a StrikeTeam from the network. Specialists are selected on expertise, experience and suitability. The right people for the right mission.',
    tags: ['Step', 'Delivery'],
  },
]
