import { NextRequest, NextResponse } from 'next/server'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

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
  await updateDoc(doc(db, 'payouts', payoutId), {
    status: 'Processing',
    paystackTransferCode: transferCode,
    updatedAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true, transferCode })
}
