import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { getTalentProfile, type User } from './user'

export interface Pod {
  id: string
  slug: string
  name: string
  focus: string
  summary: string
  leadId: string
  memberIds: string[]
  markets: string[]
  evidence: string[]
  availability: string
  fitScore?: number
  nextStep?: string
  rate: string
}

export const pods: Pod[] = []

function normalizePod(id: string, data: Partial<Pod>): Pod {
  return {
    id: data.id ?? id,
    slug: data.slug ?? id,
    name: data.name ?? 'Untitled pod',
    focus: data.focus ?? '',
    summary: data.summary ?? '',
    leadId: data.leadId ?? '',
    memberIds: data.memberIds ?? [],
    markets: data.markets ?? [],
    evidence: data.evidence ?? [],
    availability: data.availability ?? '',
    fitScore: data.fitScore,
    nextStep: data.nextStep,
    rate: data.rate ?? '',
  }
}

export function usePods() {
  const [livePods, setLivePods] = useState<Pod[]>(pods)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'pods'),
      (snapshot) => {
        const podList = snapshot.docs.map((doc) => normalizePod(doc.id, doc.data() as Partial<Pod>))
        setLivePods(podList.length > 0 ? podList : pods)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching pods:', err)
        setLivePods(pods)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { pods: livePods, loading }
}

export function getPodBySlug(slug: string): Pod | null {
  return pods.find((p) => p.slug === slug) ?? null
}

export function getPodMembers(pod: Pod): User[] {
  return pod.memberIds.map((id) => getTalentProfile(id))
}
