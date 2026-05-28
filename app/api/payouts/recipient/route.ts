import { NextRequest, NextResponse } from 'next/server'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(req: NextRequest) {
  const { userId, accountName, accountNumber, bankCode, bankName } = await req.json()

  if (!userId || !accountName || !accountNumber || !bankCode) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 })

  const res = await fetch('https://api.paystack.co/transferrecipient', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'nuban',
      name: accountName,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: 'NGN',
    }),
  })

  const data = await res.json()
  if (!data.status) return NextResponse.json({ error: data.message ?? 'Failed to create recipient' }, { status: 502 })

  const recipientCode = data.data.recipient_code

  await updateDoc(doc(db, 'users', userId), {
    paystackRecipientCode: recipientCode,
    paystackBankCode: bankCode,
    paystackAccountNumber: accountNumber,
    paystackAccountName: accountName,
    paystackBankName: bankName ?? '',
    updatedAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true, recipientCode })
}
