'use client'

import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import {
  adaptArticleEntry,
  adaptBlogEntry,
  adaptInsightEntry,
  filterContentEntries,
  mergeContentEntries,
  type ContentEntry,
  type ContentFilter,
} from './content'

export type BlogPost = ContentEntry

export function useBlogPosts(filter?: ContentFilter) {
  const [blogPosts, setBlogPosts] = useState<ContentEntry[]>([])
  const [insights, setInsights] = useState<ContentEntry[]>([])
  const [articles, setArticles] = useState<ContentEntry[]>([])
  const [ready, setReady] = useState({
    blog: false,
    insights: false,
    posts: false,
  })

  useEffect(() => {
    const unsubscribeBlog = onSnapshot(
      collection(db, 'blog'),
      (snapshot) => {
        setBlogPosts(snapshot.docs.map((doc) => adaptBlogEntry(doc.data(), doc.id)))
        setReady((current) => ({ ...current, blog: true }))
      },
      (err) => {
        console.error('Error fetching blog posts:', err)
        setBlogPosts([])
        setReady((current) => ({ ...current, blog: true }))
      }
    )

    const unsubscribeInsights = onSnapshot(
      collection(db, 'insights'),
      (snapshot) => {
        setInsights(snapshot.docs.map((doc) => adaptInsightEntry({ slug: doc.id, ...doc.data() }, doc.id)))
        setReady((current) => ({ ...current, insights: true }))
      },
      (err) => {
        console.error('Error fetching insights:', err)
        setInsights([])
        setReady((current) => ({ ...current, insights: true }))
      }
    )

    const unsubscribePosts = onSnapshot(
      collection(db, 'posts'),
      (snapshot) => {
        setArticles(snapshot.docs.map((doc) => adaptArticleEntry(doc.data(), doc.id)))
        setReady((current) => ({ ...current, posts: true }))
      },
      (err) => {
        console.error('Error fetching articles:', err)
        setArticles([])
        setReady((current) => ({ ...current, posts: true }))
      }
    )

    return () => {
      unsubscribeBlog()
      unsubscribeInsights()
      unsubscribePosts()
    }
  }, [])

  const posts = useMemo(() => {
    const merged = mergeContentEntries(blogPosts, insights, articles)
    return filterContentEntries(merged, filter)
  }, [articles, blogPosts, filter?.category, filter?.contentType, filter?.slug, insights])

  return {
    posts,
    loading: !ready.blog || !ready.insights || !ready.posts,
  }
}

export function useBlogPostBySlug(slug: string, filter?: Omit<ContentFilter, 'slug'>) {
  const { posts, loading } = useBlogPosts({ ...filter, slug })

  return {
    post: posts[0] ?? null,
    loading,
  }
}

export function getBlogHref(slug: string) {
  return `/blog/${slug}`
}
