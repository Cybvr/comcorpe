import { getTalentProfile, type User } from './user'

export interface Pod {
  id: string
  slug: string
  name: string
  focus: string
  summary: string
  leadId: string
  memberIds: string[]
  markets: string[]
  evidence: string[]
  availability: string
  fitScore?: number
  nextStep?: string
  rate: string
}

export const pods: Pod[] = []

export function getPodBySlug(slug: string): Pod | null {
  return pods.find((p) => p.slug === slug) ?? null
}

export function getPodMembers(pod: Pod): User[] {
  return pod.memberIds.map((id) => getTalentProfile(id))
}
