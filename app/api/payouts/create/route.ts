import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, getDocs, collection, query, where, addDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(req: NextRequest) {
  const { payoutId, jobSlug, amountRaw, label, milestoneId } = await req.json()

  if (!payoutId || !jobSlug || !amountRaw) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 })

  // Get the job
  const jobSnap = await getDocs(query(collection(db, 'jobs'), where('slug', '==', jobSlug)))
  if (jobSnap.empty) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  const job = jobSnap.docs[0].data()

  // Get member IDs — prefer job.podMembers, fall back to pod.memberIds
  let memberIds: string[] = job.podMembers ?? []
  if (memberIds.length === 0 && job.podSlug) {
    const podSnap = await getDoc(doc(db, 'pods', job.podSlug))
    if (podSnap.exists()) memberIds = podSnap.data().memberIds ?? []
  }

  if (memberIds.length === 0) {
    return NextResponse.json({ error: 'No pod members found on this job' }, { status: 400 })
  }

  // Equal split — remainder goes to first member
  const base = Math.floor(amountRaw / memberIds.length)
  const remainder = amountRaw - base * memberIds.length

  const results: { memberId: string; status: string; transferCode?: string }[] = []
  const now = new Date().toISOString()

  for (let i = 0; i < memberIds.length; i++) {
    const memberId = memberIds[i]
    const memberAmount = base + (i === 0 ? remainder : 0)

    // Get member's payout details
    const userSnap = await getDoc(doc(db, 'users', memberId))
    const userData = userSnap.exists() ? userSnap.data() : null
    const recipientCode = userData?.paystackRecipientCode

    const payoutData = {
      talentId: memberId,
      jobSlug,
      milestoneId: milestoneId ?? '',
      clientId: job.clientId ?? '',
      label: label ?? 'Milestone payout',
      meta: `1 of ${memberIds.length} pod members`,
      amount: `$${memberAmount.toLocaleString()}`,
      amountRaw: memberAmount,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      updatedAt: now,
    }

    if (!recipientCode) {
      // No bank set up — create a pending payout doc so they can see it
      await addDoc(collection(db, 'payouts'), { ...payoutData, status: 'Pending' })
      results.push({ memberId, status: 'pending_no_bank' })
      continue
    }

    // Fire Paystack transfer
    const reference = `payout_${payoutId}_${memberId}_${Date.now()}`
    const res = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: memberAmount * 100,
        recipient: recipientCode,
        reason: label ?? 'Milestone payout',
        reference,
      }),
    })

    const data = await res.json()

    if (!data.status) {
      await addDoc(collection(db, 'payouts'), { ...payoutData, status: 'Pending' })
      results.push({ memberId, status: 'transfer_failed' })
      continue
    }

    const transferCode = data.data.transfer_code
    await addDoc(collection(db, 'payouts'), {
      ...payoutData,
      status: 'Processing',
      paystackTransferCode: transferCode,
      paystackRecipientCode: recipientCode,
    })
    results.push({ memberId, status: 'processing', transferCode })
  }

  // Mark the original payout doc as Processing
  await updateDoc(doc(db, 'payouts', payoutId), {
    status: 'Processing',
    updatedAt: now,
  })

  return NextResponse.json({ success: true, results })
}
