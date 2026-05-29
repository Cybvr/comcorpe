'use client'

import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const SEED_INVOICES = [
  { jobSlug: 'volks-bank-loyalty-systems', milestoneId: 'm1', clientId: 'volks-bank', label: 'Behavioral reward logic sign-off', amount: '$12,250', amountRaw: 12250, status: 'Paid', date: '18 Feb 2026' },
  { jobSlug: 'volks-bank-loyalty-systems', milestoneId: 'm2', clientId: 'volks-bank', label: 'Merchant API V1 documentation', amount: '$15,750', amountRaw: 15750, status: 'Due', date: '25 Mar 2026' },
  { jobSlug: 't-finance-retention-sprints', milestoneId: 'm1', clientId: 't-finance', label: 'Funnel diagnostic audit', amount: '$5,250', amountRaw: 5250, status: 'Paid', date: '22 Feb 2026' },
  { jobSlug: 't-finance-retention-sprints', milestoneId: 'm2', clientId: 't-finance', label: '12-week growth sprint plan', amount: '$8,750', amountRaw: 8750, status: 'Due', date: '02 Apr 2026' },
  { jobSlug: 'gridwell-sme-clusters', milestoneId: 'm1', clientId: 'gridwell', label: 'SME cluster scoping', amount: '$4,200', amountRaw: 4200, status: 'Paid', date: '20 Dec 2025' },
  { jobSlug: 'volta-pay-uk-compliance', milestoneId: 'm1', clientId: 'volta-pay', label: 'FCA readiness sprint — final delivery', amount: '$25,200', amountRaw: 25200, status: 'Paid', date: '16 Oct 2025' },
  { jobSlug: 'volta-pay-launch-strategy', milestoneId: 'm1', clientId: 'volta-pay', label: 'Consumer launch strategy — full engagement', amount: '$16,800', amountRaw: 16800, status: 'Paid', date: '24 Jul 2025' },
]

// talentId must match a real Firestore user doc ID — update these before seeding in production
const SEED_PAYOUTS = [
  { talentId: 'talent-placeholder', jobSlug: 'volks-bank-loyalty-systems', milestoneId: 'm1', clientId: 'volks-bank', label: 'Behavioral reward logic sign-off', meta: 'Milestone 1 of 4', amount: '$12,250', amountRaw: 12250, status: 'Cleared', date: '18 Feb 2026' },
  { talentId: 'talent-placeholder', jobSlug: 'volks-bank-loyalty-systems', milestoneId: 'm2', clientId: 'volks-bank', label: 'Merchant API V1 documentation', meta: 'Milestone 2 of 4', amount: '$15,750', amountRaw: 15750, status: 'Pending', date: '25 Mar 2026' },
  { talentId: 'talent-placeholder', jobSlug: 't-finance-retention-sprints', milestoneId: 'm1', clientId: 't-finance', label: 'Funnel diagnostic audit', meta: 'Sprint milestone', amount: '$5,250', amountRaw: 5250, status: 'Cleared', date: '22 Feb 2026' },
  { talentId: 'talent-placeholder', jobSlug: 't-finance-retention-sprints', milestoneId: 'm2', clientId: 't-finance', label: '12-week growth sprint plan', meta: 'Sprint milestone', amount: '$8,750', amountRaw: 8750, status: 'Pending', date: '02 Apr 2026' },
  { talentId: 'talent-placeholder', jobSlug: 'gridwell-sme-clusters', milestoneId: 'm1', clientId: 'gridwell', label: 'SME cluster scoping', meta: 'Discovery phase', amount: '$4,200', amountRaw: 4200, status: 'Cleared', date: '20 Dec 2025' },
  { talentId: 'talent-placeholder', jobSlug: 'volta-pay-uk-compliance', milestoneId: 'm1', clientId: 'volta-pay', label: 'FCA readiness sprint — final delivery', meta: 'Full sprint completion', amount: '$25,200', amountRaw: 25200, status: 'Cleared', date: '16 Oct 2025' },
  { talentId: 'talent-placeholder', jobSlug: 'volta-pay-launch-strategy', milestoneId: 'm1', clientId: 'volta-pay', label: 'Consumer launch strategy — full engagement', meta: 'Sprint close', amount: '$16,800', amountRaw: 16800, status: 'Cleared', date: '24 Jul 2025' },
]

export default function SeedPaymentsPage() {
  const [talentId, setTalentId] = useState('')
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSeed() {
    if (!talentId.trim()) { setMessage('Enter a talent Firestore doc ID first'); return }
    setStatus('running')
    setMessage('')
    try {
      const now = new Date().toISOString()
      for (const inv of SEED_INVOICES) {
        await addDoc(collection(db, 'invoices'), { ...inv, updatedAt: now })
      }
      for (const p of SEED_PAYOUTS) {
        await addDoc(collection(db, 'payouts'), { ...p, talentId, updatedAt: now })
      }
      setStatus('done')
      setMessage(`Seeded ${SEED_INVOICES.length} invoices and ${SEED_PAYOUTS.length} payouts for talentId: ${talentId}`)
    } catch (err: any) {
      setStatus('error')
      setMessage(err?.message ?? 'Unknown error')
    }
  }

  const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm focus:outline-none focus:border-foreground transition-colors duration-100'

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="font-display text-[28px] tracking-hero text-foreground">Seed payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Create demo invoices and payouts for a test environment.</p>
      </div>

      <div className="space-y-3 border border-amber-200 bg-amber-50 p-4 rounded">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-amber-700">Before seeding</p>
        <p className="font-text text-sm text-amber-900">Enter the Firestore doc ID of the talent user you want the demo payouts assigned to. Find it in the Users section of the admin.</p>
        <input
          className={I}
          value={talentId}
          onChange={e => setTalentId(e.target.value)}
          placeholder="Firestore talent user doc ID…"
        />
      </div>

      <button
        onClick={handleSeed}
        disabled={status === 'running'}
        className="w-full py-3 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
      >
        {status === 'running' ? 'Seeding…' : 'Seed invoices + payouts'}
      </button>

      {message && (
        <p className={`font-mono text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
      )}
    </div>
  )
}
