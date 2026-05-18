'use client'

import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase'

export interface InsightSource {
  title: string
  publisher: string
  year: string
  href: string
}

export interface InsightSignal {
  title: string
  body: string
  refs: number[]
}

export interface Insight {
  slug: string
  title: string
  // Public page fields
  eyebrow?: string
  meta?: string
  description?: string
  lede?: string
  thesis?: string[]
  signals?: InsightSignal[]
  implications?: string[]
  sources?: InsightSource[]
  // Dashboard fields
  badge?: string
  category?: string
  author?: string
  authorId?: string
  role?: string
  body?: string
  detail?: string
  likes?: number
  replies?: number
}

export interface GrowthHeadline {
  id: number
  source: string
  headline: string
  href: string
}

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'insights'),
      (snapshot) => {
        setInsights(snapshot.docs.map(d => ({ slug: d.id, ...d.data() } as Insight)))
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching insights:', err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  return { insights, loading }
}

export function useInsightBySlug(slug: string) {
  const [insight, setInsight] = useState<Insight | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const q = query(collection(db, 'insights'), where('slug', '==', slug))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const d = snapshot.docs[0]
          setInsight({ slug: d.id, ...d.data() } as Insight)
        } else {
          setInsight(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching insight:', err)
        setInsight(null)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [slug])

  return { insight, loading }
}

export function useGrowthHeadlines() {
  const [headlines, setHeadlines] = useState<GrowthHeadline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'meta', 'growthConsultingHeadlines'),
      (docSnap) => {
        setHeadlines(docSnap.exists() ? (docSnap.data().items as GrowthHeadline[]) ?? [] : [])
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching growth headlines:', err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  return { headlines, loading }
}
