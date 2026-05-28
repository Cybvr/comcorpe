'use client'

import { useEffect, useState } from 'react'
import { Building2, CheckCircle2, Lock, AlertCircle } from 'lucide-react'
import { useCurrentUser } from '@/lib/user'

interface Bank {
  id: number
  name: string
  code: string
}

type SaveState = 'idle' | 'verifying' | 'verified' | 'saving' | 'saved' | 'error'

export default function TalentSettingsPaymentsPage() {
  const { user: currentUser, loading: userLoading } = useCurrentUser()

  const [banks, setBanks] = useState<Bank[]>([])
  const [banksLoading, setBanksLoading] = useState(true)

  const [bankCode, setBankCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const hasExistingAccount = Boolean(currentUser?.paystackRecipientCode)
  const existingAccountName = currentUser?.paystackAccountName
  const existingBankName = (currentUser as any)?.paystackBankName
  const existingAccountNumber = currentUser?.paystackAccountNumber

  useEffect(() => {
    fetch('/api/payouts/banks')
      .then(r => r.json())
      .then((data: Bank[]) => { setBanks(Array.isArray(data) ? data : []); setBanksLoading(false) })
      .catch(() => setBanksLoading(false))
  }, [])

  async function handleVerify() {
    if (!bankCode || accountNumber.length < 10) return
    setSaveState('verifying')
    setErrorMsg('')
    setAccountName('')
    try {
      const res = await fetch(`/api/payouts/verify-account?account_number=${accountNumber}&bank_code=${bankCode}`)
      const data = await res.json()
      if (data.accountName) {
        setAccountName(data.accountName)
        setSaveState('verified')
      } else {
        setErrorMsg(data.error ?? 'Account not found')
        setSaveState('error')
      }
    } catch {
      setErrorMsg('Verification failed — check your details')
      setSaveState('error')
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUser || !accountName || !bankCode || !accountNumber) return
    setSaveState('saving')
    setErrorMsg('')
    try {
      const selectedBank = banks.find(b => b.code === bankCode)
      const res = await fetch('/api/payouts/recipient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          accountName,
          accountNumber,
          bankCode,
          bankName: selectedBank?.name ?? '',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSaveState('saved')
      } else {
        setErrorMsg(data.error ?? 'Failed to save payout details')
        setSaveState('error')
      }
    } catch {
      setErrorMsg('Something went wrong — please try again')
      setSaveState('error')
    }
  }

  const I = 'w-full px-4 py-2.5 bg-background border border-border rounded-xl font-text text-sm focus:outline-none focus:border-primary/40 transition-colors'
  const isFormReady = bankCode && accountNumber.length >= 10
  const canSave = saveState === 'verified' || saveState === 'saved'

  if (userLoading) {
    return <div className="space-y-4 animate-pulse"><div className="h-8 w-48 bg-muted rounded" /><div className="h-40 bg-muted rounded-2xl" /></div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-black text-[18px] tracking-[-0.03em] text-foreground leading-tight md:text-[20px]">
          Payout details
        </h2>
        <p className="font-text text-sm text-muted-foreground mt-1">
          Where we send your earnings when a milestone clears.
        </p>
      </div>

      {hasExistingAccount && saveState !== 'saved' && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-text text-sm font-semibold text-green-800">Payout account connected</p>
            <p className="font-text text-sm text-green-700 mt-0.5">
              {existingAccountName} · {existingBankName}
              {existingAccountNumber && ` · ••••${existingAccountNumber.slice(-4)}`}
            </p>
          </div>
        </div>
      )}

      {saveState === 'saved' && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-text text-sm font-semibold text-green-800">Payout account saved</p>
            <p className="font-text text-sm text-green-700 mt-0.5">{accountName} · {banks.find(b => b.code === bankCode)?.name}</p>
          </div>
        </div>
      )}

      <div className="border border-border rounded-2xl bg-background p-6 space-y-6">
        <div className="flex items-center gap-2.5">
          <Building2 size={15} strokeWidth={1.7} />
          <p className="font-text text-sm font-semibold text-foreground">Bank transfer</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="font-text text-xs font-semibold text-foreground uppercase tracking-eyebrow mb-1.5 block">Bank</label>
            {banksLoading ? (
              <div className="h-10 bg-muted rounded-xl animate-pulse" />
            ) : (
              <select
                value={bankCode}
                onChange={e => { setBankCode(e.target.value); setAccountName(''); setSaveState('idle') }}
                className={`${I} appearance-none`}
                required
              >
                <option value="">Select your bank…</option>
                {banks.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
              </select>
            )}
          </div>

          <div>
            <label className="font-text text-xs font-semibold text-foreground uppercase tracking-eyebrow mb-1.5 block">Account number</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={accountNumber}
                onChange={e => { setAccountNumber(e.target.value.replace(/\D/g, '')); setAccountName(''); setSaveState('idle') }}
                placeholder="10-digit account number"
                maxLength={10}
                className={`${I} flex-1 font-mono`}
                required
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={!isFormReady || saveState === 'verifying'}
                className="px-4 py-2.5 border border-border rounded-xl font-text text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-40"
              >
                {saveState === 'verifying' ? 'Checking…' : 'Verify'}
              </button>
            </div>
          </div>

          {saveState === 'verified' && accountName && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle2 size={14} className="text-green-600 shrink-0" />
              <p className="font-text text-sm font-semibold text-green-800">{accountName}</p>
            </div>
          )}

          {(saveState === 'error') && errorMsg && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="font-text text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <Lock size={13} strokeWidth={1.7} />
              <p className="font-text text-xs">Details are encrypted and stored securely.</p>
            </div>
            <button
              type="submit"
              disabled={!canSave || saveState === 'saving'}
              className="px-5 py-2.5 bg-foreground text-background rounded-xl font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms] disabled:opacity-40"
            >
              {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved!' : 'Save details'}
            </button>
          </div>
        </form>
      </div>

      <div className="border border-border rounded-2xl bg-muted/30 p-6 space-y-3">
        <p className="font-text text-sm font-semibold text-foreground">How payouts work</p>
        <ul className="space-y-2">
          {[
            'Payouts are triggered when a client approves a milestone.',
            'Funds clear within 1–3 business days depending on your bank.',
            "You'll receive an email confirmation when each payout is sent.",
          ].map(line => (
            <li key={line} className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
              <p className="font-text text-sm text-muted-foreground">{line}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
