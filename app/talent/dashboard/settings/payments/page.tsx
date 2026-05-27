'use client'

import { useState } from 'react'
import { Building2, CreditCard, Lock } from 'lucide-react'

type PayoutMethod = 'bank' | 'paypal'

export default function TalentSettingsPaymentsPage() {
  const [method, setMethod] = useState<PayoutMethod>('bank')
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
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

      {/* Method toggle */}
      <div className="border border-border rounded-2xl bg-background p-6 space-y-6">
        <div>
          <p className="font-text text-sm font-semibold text-foreground mb-3">Payout method</p>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              type="button"
              onClick={() => setMethod('bank')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border font-text text-sm font-semibold transition-colors ${
                method === 'bank'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              <Building2 size={15} strokeWidth={1.7} />
              Bank transfer
            </button>
            <button
              type="button"
              onClick={() => setMethod('paypal')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border font-text text-sm font-semibold transition-colors ${
                method === 'paypal'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              <CreditCard size={15} strokeWidth={1.7} />
              PayPal
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {method === 'bank' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-text text-xs font-semibold text-foreground uppercase tracking-eyebrow mb-1.5 block">
                    Account holder name
                  </label>
                  <input
                    type="text"
                    placeholder="Full legal name"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-text text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-text text-xs font-semibold text-foreground uppercase tracking-eyebrow mb-1.5 block">
                    Bank name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chase, Barclays"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-text text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-text text-xs font-semibold text-foreground uppercase tracking-eyebrow mb-1.5 block">
                    Account number
                  </label>
                  <input
                    type="text"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-text text-sm font-mono focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-text text-xs font-semibold text-foreground uppercase tracking-eyebrow mb-1.5 block">
                    Sort code / routing number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 04-00-04"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-text text-sm font-mono focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
              </div>
              <div className="max-w-xs">
                <label className="font-text text-xs font-semibold text-foreground uppercase tracking-eyebrow mb-1.5 block">
                  Currency
                </label>
                <select className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-text text-sm focus:outline-none focus:border-primary/40 transition-colors appearance-none">
                  <option value="USD">USD — US Dollar</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="CAD">CAD — Canadian Dollar</option>
                  <option value="AUD">AUD — Australian Dollar</option>
                </select>
              </div>
            </>
          ) : (
            <div className="max-w-sm">
              <label className="font-text text-xs font-semibold text-foreground uppercase tracking-eyebrow mb-1.5 block">
                PayPal email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-text text-sm focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <Lock size={13} strokeWidth={1.7} />
              <p className="font-text text-xs">Details are encrypted and stored securely.</p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-foreground text-background rounded-xl font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]"
            >
              {saved ? 'Saved!' : 'Save details'}
            </button>
          </div>
        </form>
      </div>

      {/* Payout schedule info */}
      <div className="border border-border rounded-2xl bg-muted/30 p-6 space-y-3">
        <p className="font-text text-sm font-semibold text-foreground">How payouts work</p>
        <ul className="space-y-2">
          {[
            "Payouts are triggered when a client approves a milestone.",
            "Funds clear within 3-5 business days depending on your bank.",
            "You'll receive an email confirmation when each payout is sent.",
          ].map((line) => (
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
