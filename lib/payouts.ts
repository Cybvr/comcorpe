'use client'

import { useEffect, useState } from 'react'
import {
  collection, doc, onSnapshot, query, where,
  addDoc, updateDoc, getDocs,
} from 'firebase/firestore'
import { db } from './firebase'

export type PayoutStatus = 'Cleared' | 'Pending' | 'Processing'

export interface Payout {
  id: string
  talentId: string
  label: string
  meta: string
  jobSlug: string
  milestoneId?: string
  clientId: string
  amount: string
  amountRaw: number
  status: PayoutStatus
  date: string
  note?: string
  paystackTransferCode?: string
  paystackRecipientCode?: string
  sentAt?: string
  updatedAt?: string
}

export const ccreditsBalance = 3

export function usePayouts(talentId: string) {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!talentId) { setLoading(false); return }
    const q = query(collection(db, 'payouts'), where('talentId', '==', talentId))
    const unsub = onSnapshot(
      q,
      snap => {
        setPayouts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Payout)))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [talentId])

  return { payouts, loading }
}

export function useAllPayouts() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'payouts'),
      snap => {
        setPayouts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Payout)))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  return { payouts, loading }
}

export async function createPayout(data: Omit<Payout, 'id'>): Promise<Payout> {
  const ref = await addDoc(collection(db, 'payouts'), {
    ...data,
    updatedAt: new Date().toISOString(),
  })
  return { id: ref.id, ...data }
}

export async function updatePayoutStatus(
  id: string,
  status: PayoutStatus,
  extra?: Partial<Omit<Payout, 'id'>>,
): Promise<void> {
  await updateDoc(doc(db, 'payouts', id), {
    status,
    ...extra,
    updatedAt: new Date().toISOString(),
  })
}

export async function getAllPayouts(): Promise<Payout[]> {
  const snap = await getDocs(collection(db, 'payouts'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Payout))
}
