import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { initializeApp, getApps, getApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getAdminDb() {
  const app = getApps().length
    ? getApp()
    : initializeApp({ credential: applicationDefault() })
  return getFirestore(app)
}

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
  const db = getAdminDb()

  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data
    const invoiceId = metadata?.invoiceId
    if (invoiceId) {
      await db.collection('invoices').doc(invoiceId).update({
        status: 'Paid',
        paystackReference: reference,
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  if (event.event === 'transfer.success') {
    const { transfer_code } = event.data
    const snap = await db.collection('payouts')
      .where('paystackTransferCode', '==', transfer_code)
      .limit(1)
      .get()
    if (!snap.empty) {
      await snap.docs[0].ref.update({
        status: 'Cleared',
        sentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  if (event.event === 'transfer.failed' || event.event === 'transfer.reversed') {
    const { transfer_code } = event.data
    const snap = await db.collection('payouts')
      .where('paystackTransferCode', '==', transfer_code)
      .limit(1)
      .get()
    if (!snap.empty) {
      await snap.docs[0].ref.update({
        status: 'Pending',
        updatedAt: new Date().toISOString(),
      })
    }
  }

  return NextResponse.json({ ok: true })
}
