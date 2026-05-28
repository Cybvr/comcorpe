import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getAdminDb() {
  const app = getApps().length
    ? getApp()
    : initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? '{}')) })
  return getFirestore(app)
}

export async function POST(req: NextRequest) {
  const { payoutId, recipientCode, amountRaw, reason } = await req.json()

  if (!payoutId || !recipientCode || !amountRaw) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 })

  const reference = `payout_${payoutId}_${Date.now()}`

  const res = await fetch('https://api.paystack.co/transfer', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: 'balance',
      amount: amountRaw * 100,
      recipient: recipientCode,
      reason: reason ?? 'Milestone payout',
      reference,
    }),
  })

  const data = await res.json()

  if (!data.status) {
    return NextResponse.json({ error: data.message ?? 'Transfer failed' }, { status: 502 })
  }

  const transferCode = data.data.transfer_code
  const db = getAdminDb()
  await db.collection('payouts').doc(payoutId).update({
    status: 'Processing',
    paystackTransferCode: transferCode,
    updatedAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true, transferCode })
}
