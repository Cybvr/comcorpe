'use client'
import { useEffect, useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setStatus('running')

    const job = {
      id: 12,
      slug: 'comcorpe-launch-campaign',
      title: 'Comcorpe Go-to-Market Launch',
      clientId: 'comcorpe',
      type: 'PROJECT',
      status: 'Scoping',
      summary: 'Comcorpe is going public and needs a sharp pod to own the launch. We need a positioning strategy, a content and messaging system, and a distribution plan that gets the right people — founders, CMOs, heads of growth — talking about us in the first three weeks.',
      rate: '$1,000',
      time: '3 weeks',
      location: 'Remote',
      tags: ['launch', 'gtm', 'brand', 'growth'],
      updatedAt: `Updated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
      scope: [
        'Positioning and messaging — define how Comcorpe shows up against traditional agencies and freelance platforms',
        'Content system — produce launch assets: LinkedIn posts, one hero narrative, and a one-pager for outreach',
        'Distribution plan — map the channels, communities and people the launch content hits in week one',
        'Execution — run the first wave of distribution and report back on traction',
      ],
      requirements: [
        'A strategist who has positioned a B2B product before',
        'A writer or creative who can translate strategy into content that actually gets shared',
        'A growth or distribution person who knows where founders and CMOs pay attention',
        'Pod must have worked together or demonstrate clear role split',
      ],
      milestones: [
        { id: 'm_1', title: 'Positioning and messaging locked', date: '14 Jun 2026', status: 'pending', amount: '$300' },
        { id: 'm_2', title: 'Launch assets delivered', date: '21 Jun 2026', status: 'pending', amount: '$400' },
        { id: 'm_3', title: 'Distribution executed — traction report submitted', date: '28 Jun 2026', status: 'pending', amount: '$300' },
      ],
    }

    setDoc(doc(db, 'jobs', job.slug), job)
      .then(() => {
        setStatus('done')
        setMessage(`Job written — doc: ${job.slug}`)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err?.message ?? 'Unknown error')
      })
  }, [])

  return (
    <div className="p-12 font-mono text-sm">
      {status === 'running' && <p>Writing job…</p>}
      {status === 'done'    && <p className="text-green-600">{message}</p>}
      {status === 'error'   && <p className="text-red-600">Error: {message}</p>}
    </div>
  )
}
