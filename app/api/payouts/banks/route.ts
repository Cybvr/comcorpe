import { NextResponse } from 'next/server'

export async function GET() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 })

  const res = await fetch('https://api.paystack.co/bank?use_cursor=false&perPage=100', {
    headers: { Authorization: `Bearer ${secretKey}` },
    // @ts-expect-error next fetch extension
    next: { revalidate: 86400 },
  })

  const data = await res.json()
  if (!data.status) return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 502 })

  return NextResponse.json(data.data)
}
