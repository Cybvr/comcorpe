'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase'

export interface GrowthMetricEntry {
  id: string
  clientId: string
  date: string // ISO month: "2026-01"
  perceptionScore?: number
  newCustomers?: number
  churnRate?: number
  arpu?: number
  revenue?: number
  marketShare?: number
}

export function useGrowthMetrics(clientId: string | undefined) {
  const [metrics, setMetrics] = useState<GrowthMetricEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clientId) {
      setLoading(false)
      return
    }

    const q = query(collection(db, 'growthMetrics'), where('clientId', '==', clientId))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as GrowthMetricEntry)
        list.sort((a, b) => a.date.localeCompare(b.date))
        setMetrics(list)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching growth metrics:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [clientId])

  return { metrics, loading }
}

/** Returns the latest metric entry for a client */
export function useLatestGrowthMetric(clientId: string | undefined) {
  const { metrics, loading } = useGrowthMetrics(clientId)
  const latest = metrics.length > 0 ? metrics[metrics.length - 1] : null
  return { metric: latest, loading }
}
