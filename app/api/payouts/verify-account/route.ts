import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const accountNumber = req.nextUrl.searchParams.get('account_number')
  const bankCode = req.nextUrl.searchParams.get('bank_code')

  if (!accountNumber || !bankCode) {
    return NextResponse.json({ error: 'Missing account_number or bank_code' }, { status: 400 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 })

  const res = await fetch(
    `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    { headers: { Authorization: `Bearer ${secretKey}` } },
  )

  const data = await res.json()
  if (!data.status) return NextResponse.json({ error: data.message ?? 'Account not found' }, { status: 404 })

  return NextResponse.json({ accountName: data.data.account_name })
}
