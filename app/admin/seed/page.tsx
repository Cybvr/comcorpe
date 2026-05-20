'use client'
import { useEffect, useState } from 'react'
import { createJob } from '@/lib/admin/store'

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setStatus('running')
    createJob({
      slug: 'cbn-stability-campaign',
      title: 'CBN stability campaign',
      clientId: 'jide-pinheiro',
      type: 'PROJECT',
      status: 'Scoping',
      summary: '',
      rate: '',
      location: '',
      time: '',
      tags: [],
      updatedAt: `Updated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
      scope: [],
      requirements: [],
    })
      .then(job => {
        setStatus('done')
        setMessage(`Job created — id ${job.id}, doc: ${job.slug}`)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err?.message ?? 'Unknown error')
      })
  }, [])

  return (
    <div className="p-12 font-mono text-sm">
      {status === 'running' && <p>Creating job…</p>}
      {status === 'done'    && <p className="text-green-600">{message}</p>}
      {status === 'error'   && <p className="text-red-600">Error: {message}</p>}
    </div>
  )
}
