export type JobType = 'RETAINED' | 'PROJECT' | 'EQUITY'
export type JobStatus = 'Scoping' | 'Pod review' | 'Active' | 'Paused' | 'Completed' | 'Cancelled'

export interface Milestone {
  id: string
  title: string
  date: string
  status: 'pending' | 'in-progress' | 'completed'
}

export interface Job {
  id: number
  slug: string
  title: string
  clientId: string
  type: JobType
  status: JobStatus
  summary: string
  rate: string // Budget
  location: string
  time: string // Timeline
  tags: string[]
  updatedAt: string
  arena?: string
  owner?: string
  updates?: string[]
  // Meta data for the dashboard (mostly for Active projects)
  progress?: number
  phase?: string
  nextMilestone?: string
  nextReview?: string
  podSlug?: string
  lead?: string
  startDate?: string
  endDate?: string
  scope: string[]
  requirements: string[]
  milestones?: Milestone[]
}

export const jobs: Job[] = []

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug) ?? null
}

export function getJobProgress(job: Job) {
  if (!job.milestones || job.milestones.length === 0) return 0
  const completed = job.milestones.filter(m => m.status === 'completed').length
  return Math.round((completed / job.milestones.length) * 100)
}
