'use client'

import { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { db } from './firebase'

export interface PerformanceReview {
  id: string
  jobSlug: string
  talentId: string
  score: number
  notes?: string
  scoredBy: string
  scoredAt: string
}

export async function getReviewsForJob(jobSlug: string): Promise<PerformanceReview[]> {
  try {
    const q = query(collection(db, 'performanceReviews'), where('jobSlug', '==', jobSlug))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PerformanceReview))
  } catch {
    return []
  }
}

export async function getReviewsForTalent(talentId: string): Promise<PerformanceReview[]> {
  try {
    const q = query(collection(db, 'performanceReviews'), where('talentId', '==', talentId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PerformanceReview))
  } catch {
    return []
  }
}

export async function submitReview(data: Omit<PerformanceReview, 'id'>): Promise<void> {
  // Read existing reviews before writing so we don't double-count
  const existingReviews = await getReviewsForTalent(data.talentId)
  const allScores = [...existingReviews.map(r => r.score), data.score]
  const avg = Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10

  const id = Date.now().toString()
  const clean = JSON.parse(JSON.stringify(data))
  await setDoc(doc(db, 'performanceReviews', id), { ...clean, id }, { merge: true })

  await setDoc(
    doc(db, 'users', data.talentId),
    { performanceScore: avg, performanceReviewCount: allScores.length },
    { merge: true }
  )
}

export function useReviewsForTalent(talentId: string) {
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!talentId) return
    const q = query(collection(db, 'performanceReviews'), where('talentId', '==', talentId))
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as PerformanceReview))
      list.sort((a, b) => b.scoredAt.localeCompare(a.scoredAt))
      setReviews(list)
      setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [talentId])

  return { reviews, loading }
}

export function useReviewsForJob(jobSlug: string) {
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!jobSlug) return
    const q = query(collection(db, 'performanceReviews'), where('jobSlug', '==', jobSlug))
    const unsub = onSnapshot(q, snap => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as PerformanceReview)))
      setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [jobSlug])

  return { reviews, loading }
}
