import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, amountRaw, invoiceId, callbackUrl } = await req.json()

  if (!email || !amountRaw || !invoiceId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 })
  }

  const reference = `inv_${invoiceId}_${Date.now()}`

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amountRaw * 100,
      reference,
      callback_url: callbackUrl,
      metadata: { invoiceId },
    }),
  })

  const data = await res.json()

  if (!data.status) {
    return NextResponse.json({ error: data.message ?? 'Paystack error' }, { status: 502 })
  }

  return NextResponse.json({
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  })
}
