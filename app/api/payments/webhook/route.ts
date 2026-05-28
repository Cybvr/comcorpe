import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(req: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ ok: false }, { status: 500 })

  const rawBody = await req.text()
  const signature = req.headers.get('x-paystack-signature') ?? ''
  const expected = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex')

  if (signature !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data
    const invoiceId = metadata?.invoiceId
    if (invoiceId) {
      await updateDoc(doc(db, 'invoices', invoiceId), {
        status: 'Paid',
        paystackReference: reference,
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  if (event.event === 'transfer.success') {
    const { transfer_code } = event.data
    const snap = await getDocs(query(collection(db, 'payouts'), where('paystackTransferCode', '==', transfer_code)))
    if (!snap.empty) {
      await updateDoc(snap.docs[0].ref, {
        status: 'Cleared',
        sentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  if (event.event === 'transfer.failed' || event.event === 'transfer.reversed') {
    const { transfer_code } = event.data
    const snap = await getDocs(query(collection(db, 'payouts'), where('paystackTransferCode', '==', transfer_code)))
    if (!snap.empty) {
      await updateDoc(snap.docs[0].ref, {
        status: 'Pending',
        updatedAt: new Date().toISOString(),
      })
    }
  }

  return NextResponse.json({ ok: true })
}
