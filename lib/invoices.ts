'use client'

import { useEffect, useState } from 'react'
import {
  collection, doc, onSnapshot, query, where,
  addDoc, updateDoc, getDocs,
} from 'firebase/firestore'
import { db } from './firebase'

export type InvoiceStatus = 'Paid' | 'Due' | 'Processing'

export interface Invoice {
  id: string
  jobSlug: string
  milestoneId: string
  clientId: string
  label: string
  amount: string
  amountRaw: number
  status: InvoiceStatus
  date: string
  paystackReference?: string
  paystackAuthorizationUrl?: string
  paidAt?: string
  updatedAt?: string
}

export function useInvoices(clientId: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clientId) { setLoading(false); return }
    const q = query(collection(db, 'invoices'), where('clientId', '==', clientId))
    const unsub = onSnapshot(
      q,
      snap => {
        setInvoices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [clientId])

  return { invoices, loading }
}

export function useAllInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'invoices'),
      snap => {
        setInvoices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  return { invoices, loading }
}

export async function createInvoice(data: Omit<Invoice, 'id'>): Promise<Invoice> {
  const ref = await addDoc(collection(db, 'invoices'), {
    ...data,
    updatedAt: new Date().toISOString(),
  })
  return { id: ref.id, ...data }
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
  extra?: Partial<Omit<Invoice, 'id'>>,
): Promise<void> {
  await updateDoc(doc(db, 'invoices', id), {
    status,
    ...extra,
    updatedAt: new Date().toISOString(),
  })
}

export async function getAllInvoices(): Promise<Invoice[]> {
  const snap = await getDocs(collection(db, 'invoices'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice))
}
