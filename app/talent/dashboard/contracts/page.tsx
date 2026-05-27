'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { useCurrentUser, updateUserProfile } from '@/lib/user'
import { contractTerms } from '@/lib/contract'

export default function TalentContractsPage() {
  const router = useRouter()
  const { user, loading } = useCurrentUser()
  const [expandedClause, setExpandedClause] = useState<string | null>(null)
  const [typedName, setTypedName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [signing, setSigning] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setScrolledToBottom(true)
    }
  }

  async function handleSign(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !typedName.trim() || !agreed) return
    setSigning(true)
    await updateUserProfile(user.id, {
      msaSigned: true,
      msaSignedAt: new Date().toISOString(),
      msaSignedName: typedName.trim(),
    })
    setSigning(false)
  }

  if (loading) {
    return <div className="py-20 text-center"><p className="font-mono text-sm text-muted-foreground animate-pulse">Loading…</p></div>
  }

  const isSigned = user?.msaSigned

  return (
    <div className="max-w-[720px] mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="font-display font-black text-[18px] tracking-hero text-foreground leading-tight md:text-[20px]">Master Agreement</h1>
        <p className="font-text text-sm text-muted-foreground mt-2">
          This agreement covers IP, confidentiality, and data protection for all work delivered through the platform.
          You sign this once — it applies to every engagement.
        </p>
      </div>

      {isSigned ? (
        <div className="border border-green-200 bg-green-50 px-6 py-5 space-y-1">
          <div className="flex items-center gap-2 text-green-700">
            <Check size={16} />
            <span className="font-text text-sm font-semibold">Master Agreement signed</span>
          </div>
          <p className="font-text text-xs text-green-600/80">
            Signed as <strong>{user.msaSignedName}</strong> on{' '}
            {user.msaSignedAt ? new Date(user.msaSignedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
          </p>
        </div>
      ) : (
        <div className="border border-amber-200 bg-amber-50 px-5 py-4 flex items-center gap-3">
          <FileText size={16} className="text-amber-600 shrink-0" />
          <p className="font-text text-sm text-amber-700">
            You need to sign this agreement before you can be deployed on a project.
          </p>
        </div>
      )}

      {/* Contract clauses */}
      <div
        className="border border-border divide-y divide-border max-h-[480px] overflow-y-auto"
        onScroll={handleScroll}
      >
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
              {expandedClause === clause.id ? <ChevronUp size={14} className="text-muted-foreground shrink-0" /> : <ChevronDown size={14} className="text-muted-foreground shrink-0" />}
            </button>
            {expandedClause === clause.id && (
              <p className="mt-3 font-text text-sm text-muted-foreground leading-relaxed pl-8">
                {clause.content}
              </p>
            )}
          </div>
        ))}
      </div>

      {!isSigned && (
        <form onSubmit={handleSign} className="space-y-4 border border-border p-6">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">Sign the agreement</p>

          {!scrolledToBottom && (
            <p className="font-text text-xs text-amber-600 bg-amber-50 px-3 py-2 border border-amber-200">
              Scroll through the agreement above before signing.
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">
              Type your full name to sign
            </label>
            <input
              type="text"
              value={typedName}
              onChange={e => setTypedName(e.target.value)}
              placeholder="Your legal name"
              required
              className="w-full px-4 py-3 border border-input bg-background font-text text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-foreground shrink-0"
            />
            <span className="font-text text-sm text-muted-foreground">
              I have read and agree to the Master Agreement. I understand this is a legally binding commitment.
            </span>
          </label>

          <button
            type="submit"
            disabled={!typedName.trim() || !agreed || !scrolledToBottom || signing}
            className="w-full py-3.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {signing ? 'Signing…' : 'Sign Master Agreement'}
          </button>
        </form>
      )}
    </div>
  )
}
