'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase'

export interface TreatmentPlan {
  id: string
  jobSlug: string
  content: string
  createdAt: string
}

export function useTreatmentPlan(jobSlug: string | undefined) {
  const [plan, setPlan] = useState<TreatmentPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!jobSlug) {
      setLoading(false)
      return
    }

    const q = query(collection(db, 'treatmentPlans'), where('jobSlug', '==', jobSlug))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setPlan({ id: doc.id, ...doc.data() } as TreatmentPlan)
        } else {
          setPlan(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching treatment plan:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [jobSlug])

  return { plan, loading }
}
