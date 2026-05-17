import { getTalentProfile } from './user'

export interface Operator {
  id: number
  talentId: string
  name: string
  title: string
  initials: string
  color: string
}

const featuredOperatorIds: string[] = []

export const topOperators: Operator[] = featuredOperatorIds.map((id, index) => {
  const talent = getTalentProfile(id)

  return {
    id: index + 1,
    talentId: talent.id,
    name: talent.name,
    title: talent.dashboardTitle ?? talent.role,
    initials: talent.initials,
    color: talent.color ?? 'bg-foreground',
  }
})
