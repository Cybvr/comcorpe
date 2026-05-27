'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { useState } from 'react'
import { useCurrentUser } from '@/lib/user'
import { contractTerms } from '@/lib/contract'

export default function TalentSettingsContractsPage() {
  const router = useRouter()
  const { user, loading } = useCurrentUser()
  const [expandedClause, setExpandedClause] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user && !user.msaSigned) {
      router.replace('/talent/dashboard/contracts')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="py-20 text-center"><p className="font-mono text-sm text-muted-foreground animate-pulse">Loading…</p></div>
  }

  if (!user?.msaSigned) return null

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-black text-[18px] tracking-[-0.03em] text-foreground leading-tight md:text-[20px]">
          Master Agreement
        </h2>
        <p className="font-text text-sm text-muted-foreground mt-1">
          Your signed agreement covering IP, confidentiality, and data protection for all platform engagements.
        </p>
      </div>

      <div className="border border-green-200 bg-green-50 px-6 py-5 space-y-1">
        <div className="flex items-center gap-2 text-green-700">
          <Check size={16} />
          <span className="font-text text-sm font-semibold">Master Agreement signed</span>
        </div>
        <p className="font-text text-xs text-green-600/80">
          Signed as <strong>{user.msaSignedName}</strong> on{' '}
          {user.msaSignedAt
            ? new Date(user.msaSignedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : '—'}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText size={14} className="text-muted-foreground" />
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">Agreement terms</p>
        </div>
        <div className="border border-border divide-y divide-border">
          {contractTerms.map(clause => (
            <div key={clause.id} className="px-5 py-4">
              <button
                type="button"
                onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[10px] text-muted-foreground/60 shrink-0">{clause.id}</span>
                  <span className="font-text text-sm font-semibold text-foreground truncate">{clause.title}</span>
                </div>
                {expandedClause === clause.id
                  ? <ChevronUp size={14} className="text-muted-foreground shrink-0" />
                  : <ChevronDown size={14} className="text-muted-foreground shrink-0" />}
              </button>
              {expandedClause === clause.id && (
                <p className="mt-3 font-text text-sm text-muted-foreground leading-relaxed pl-8">
                  {clause.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
