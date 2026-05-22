'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from './firebase'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  category: string
  publishedAt: string
  author: string
  coverImage?: string
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('publishedAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)))
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching blog posts:', err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  return { posts, loading }
}

export function useBlogPostBySlug(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const q = query(collection(db, 'blog'), where('slug', '==', slug))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPost(snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPost)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching blog post:', err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [slug])

  return { post, loading }
}

export function getBlogHref(slug: string) {
  return `/blog/${slug}`
}
