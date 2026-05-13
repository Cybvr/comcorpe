import { getTalentProfile } from './talent'

export interface Post {
  id: number
  slug: string
  authorId: string
  author: string
  role: string
  badge: string
  title: string
  body: string
  likes: number
  replies: number
  category: string
}

const yetunde = getTalentProfile('yetunde-bello')
const daniel = getTalentProfile('daniel-osei')
const kemi = getTalentProfile('kemi-adaora')

export const posts: Post[] = [
  {
    id: 1,
    slug: 'anchor-partnerships-before-launch',
    authorId: yetunde.id,
    author: yetunde.name,
    role: yetunde.communityRole ?? yetunde.role,
    badge: 'Market Entry',
    title: 'How we secured 3 anchor partnerships in 6 weeks before launch',
    body: "The playbook everyone gets wrong is going direct too early. In Nigeria, trust travels through aggregators first. Here's the exact sequence we used for a fintech client entering Lagos...",
    likes: 14,
    replies: 6,
    category: 'Growth',
  },
  {
    id: 2,
    slug: 'growth-strategy-vs-growth-execution',
    authorId: daniel.id,
    author: daniel.name,
    role: daniel.communityRole ?? daniel.role,
    badge: 'Career Advice',
    title: "Growth strategy vs. growth execution - knowing which one you're being hired for",
    body: 'Most briefs conflate the two. Before you submit a proposal, ask: do they need someone to think, or someone to do? The answer changes your pod configuration entirely.',
    likes: 9,
    replies: 3,
    category: 'Strategy',
  },
  {
    id: 3,
    slug: 'consumer-trust-signals-by-market',
    authorId: kemi.id,
    author: kemi.name,
    role: kemi.communityRole ?? kemi.role,
    badge: 'Brand',
    title: 'Consumer trust signals differ market to market - stop using a global template',
    body: "What converts in Lagos will not convert in Nairobi. I've mapped the top 5 trust drivers in 4 African markets. Happy to share the doc with anyone who replies.",
    likes: 22,
    replies: 11,
    category: 'Consumer',
  },
]

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug) ?? null
}
