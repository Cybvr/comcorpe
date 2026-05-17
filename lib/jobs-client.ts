'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase'
import type { Job } from './jobs'

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'jobs'),
      (snapshot) => {
        const jobsList = snapshot.docs.map((doc) => doc.data() as Job)
        jobsList.sort((a, b) => (a.id || 0) - (b.id || 0))
        setJobs(jobsList)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching jobs:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { jobs, loading }
}

export function useJobBySlug(slug: string) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const q = query(collection(db, 'jobs'), where('slug', '==', slug))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          setJob(snapshot.docs[0].data() as Job)
        } else {
          setJob(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching job by slug:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [slug])

  return { job, loading }
}
