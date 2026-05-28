import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, getApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getAdminDb() {
  const app = getApps().length
    ? getApp()
    : initializeApp({ credential: applicationDefault() })
  return getFirestore(app)
}

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')
  if (!reference) return NextResponse.json({ error: 'Missing reference' }, { status: 400 })

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 })

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })

  const data = await res.json()

  if (!data.status || data.data.status !== 'success') {
    return NextResponse.json({ success: false, message: data.message ?? 'Payment not confirmed' })
  }

  const invoiceId = data.data.metadata?.invoiceId
  if (invoiceId) {
    try {
      const db = getAdminDb()
      await db.collection('invoices').doc(invoiceId).update({
        status: 'Paid',
        paystackReference: reference,
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } catch {
      // Log but don't fail — webhook will also confirm
    }
  }

  return NextResponse.json({ success: true, reference })
}
