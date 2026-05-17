import { getTalentProfile } from './user'

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

export const posts: Post[] = []

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug) ?? null
}
