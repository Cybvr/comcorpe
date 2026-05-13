export type SpaceIcon = 'globe' | 'zap' | 'target'

export interface Space {
  id: number
  name: string
  desc: string
  members: string
  posts: string
  icon: SpaceIcon
}

export const spaces: Space[] = [
  {
    id: 1,
    name: 'Lagos Growth Hub',
    desc: 'Community for operators and founders scaling in West Africa.',
    members: '4,200',
    posts: '12 new posts last week',
    icon: 'globe',
  },
  {
    id: 2,
    name: 'Fintech Operators',
    desc: 'Share playbooks, intros and lessons from regulated markets.',
    members: '1,800',
    posts: '8 new posts last week',
    icon: 'zap',
  },
  {
    id: 3,
    name: 'Brand Strategists',
    desc: 'Consumer brand builders across FMCG, telecoms and gaming.',
    members: '920',
    posts: '5 new posts last week',
    icon: 'target',
  },
]
