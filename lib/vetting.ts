'use client'

import { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase'

export interface VettingTask {
  id: string
  talentId: string
  title: string
  brief: string
  assignedAt: string
  deadline: string
  status: 'assigned' | 'submitted' | 'approved' | 'rejected'
  submissionUrl?: string
  submissionNotes?: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
}

export function useVettingTaskForTalent(talentId: string) {
  const [task, setTask] = useState<VettingTask | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!talentId) return

    const q = query(collection(db, 'vettingTasks'), where('talentId', '==', talentId))
    const unsub = onSnapshot(q, snap => {
      setTask(snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as VettingTask))
      setLoading(false)
    }, () => setLoading(false))

    return () => unsub()
  }, [talentId])

  return { task, loading }
}

export async function getVettingTasks(): Promise<VettingTask[]> {
  try {
    const snap = await getDocs(collection(db, 'vettingTasks'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as VettingTask))
  } catch {
    return []
  }
}

export async function getVettingTaskForTalent(talentId: string): Promise<VettingTask | null> {
  try {
    const q = query(collection(db, 'vettingTasks'), where('talentId', '==', talentId))
    const snap = await getDocs(q)
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as VettingTask
  } catch {
    return null
  }
}
