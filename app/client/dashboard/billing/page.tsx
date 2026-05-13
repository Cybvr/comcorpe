import { billingRecords } from '@/lib/billing'

export default function BillingPage() {
  return (
    <div className="px-8 py-8 max-w-[920px] mx-auto">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Billing</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Credits and payouts</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {billingRecords.map((record) => (
          <article key={record.id} className="border border-ink-10 rounded-xl p-5 bg-paper">
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">{record.label}</p>
            <div className="font-display font-black text-[30px] tracking-[-0.03em] text-ink leading-none">{record.value}</div>
            <p className="font-text text-sm text-ink-60 mt-3">{record.meta}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
