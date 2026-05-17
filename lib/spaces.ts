export type SpaceIcon = 'globe' | 'zap' | 'target'

export interface Space {
  id: number
  name: string
  desc: string
  members: string
  posts: string
  icon: SpaceIcon
}

export const spaces: Space[] = []
