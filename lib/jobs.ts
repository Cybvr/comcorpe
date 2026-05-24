'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase'

export type JobType = 'RETAINED' | 'PROJECT' | 'EQUITY'
export type JobStatus = 'Scoping' | 'Pod review' | 'Active' | 'Paused' | 'Completed' | 'Cancelled'

export interface JobDocument {
  name: string
  size: string
  url: string
  storagePath: string
  uploadedAt: string
}

export interface Milestone {
  id: string
  title: string
  date: string
  status: 'pending' | 'in-progress' | 'completed'
  amount?: string
}

export interface Job {
  id: number
  slug: string
  title: string
  clientId: string
  type: JobType
  status: JobStatus
  summary: string
  rate: string
  location: string
  time: string
  tags: string[]
  updatedAt: string
  arena?: string
  owner?: string
  updates?: string[]
  progress?: number
  phase?: string
  nextMilestone?: string
  nextReview?: string
  podSlug?: string
  lead?: string
  startDate?: string
  endDate?: string
  scope: string[]
  requirements: string[]
  milestones?: Milestone[]
  documents?: JobDocument[]
  weeklyFocus?: string
  podMembers?: string[]
  surgeryPhase?: 1 | 2 | 3 | 4 | 5 | 6
  // NDA tracking
  ndaStatus?: 'not-required' | 'pending' | 'signed'
  ndaSignedAt?: string
  ndaSignedBy?: string
  // Approval workflow
  approvalStatus?: 'not-required' | 'pending-approval' | 'approved' | 'rejected'
  approvers?: string[]
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedReason?: string
  // Public sharing
  sharedPublicly?: boolean
}

export const jobs: Job[] = []

export function getJobProgress(job: Job) {
  if (!job.milestones || job.milestones.length === 0) return 0
  const completed = job.milestones.filter(m => m.status === 'completed').length
  return Math.round((completed / job.milestones.length) * 100)
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'jobs'),
      (snapshot) => {
        const jobsList = snapshot.docs.map((doc) => doc.data() as Job)
        jobsList.sort((a, b) => (b.id || 0) - (a.id || 0))
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
