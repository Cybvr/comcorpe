import { CreditCard, FileText } from 'lucide-react'
import { clientInvoices } from '@/lib/client-dashboard'

const invoiceStatusStyles = {
  Paid: 'bg-green-600/10 text-green-700 border-green-600/20',
  Due: 'bg-amber-100 text-amber-700 border-amber-200',
  Draft: 'bg-ink-10 text-ink-60 border-ink-20',
}

export default function BillingPage() {
  const openTotal = clientInvoices
    .filter((invoice) => invoice.status === 'Due')
    .map((invoice) => invoice.amount)
    .join(', ')

  return (
    <div className="px-8 py-8 max-w-[1040px] mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Billing</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Invoices and approvals</h1>
        <p className="font-text text-sm text-ink-60 mt-3 max-w-[62ch]">
          Review open invoices, draft charges, and paid retainers alongside the engagement milestone that produced each billing item.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <article className="border border-ink-10 rounded-xl p-5 bg-paper">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Open balance</p>
          <div className="font-display font-black text-[30px] tracking-[-0.03em] text-ink leading-none">{openTotal || '$0'}</div>
          <p className="font-text text-sm text-ink-60 mt-3">Requires finance approval</p>
        </article>
        <article className="border border-ink-10 rounded-xl p-5 bg-paper">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Draft charges</p>
          <div className="font-display font-black text-[30px] tracking-[-0.03em] text-ink leading-none">
            {clientInvoices.filter((invoice) => invoice.status === 'Draft').length}
          </div>
          <p className="font-text text-sm text-ink-60 mt-3">Issued after client approval</p>
        </article>
        <article className="border border-ink-10 rounded-xl p-5 bg-paper">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Paid retainers</p>
          <div className="font-display font-black text-[30px] tracking-[-0.03em] text-ink leading-none">
            {clientInvoices.filter((invoice) => invoice.status === 'Paid').length}
          </div>
          <p className="font-text text-sm text-ink-60 mt-3">Cleared by finance</p>
        </article>
      </section>

      <div className="flex flex-col gap-3">
        {clientInvoices.map((invoice) => (
          <article key={invoice.id} className="border border-ink-10 rounded-xl p-5 bg-paper">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center text-blue shrink-0">
                  {invoice.status === 'Paid' ? <CreditCard size={18} strokeWidth={1.5} /> : <FileText size={18} strokeWidth={1.5} />}
                </div>
                <div>
                  <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink leading-tight">{invoice.label}</h2>
                  <p className="font-text text-sm text-ink-60 mt-1">{invoice.meta}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${invoiceStatusStyles[invoice.status]}`}>
                  {invoice.status}
                </span>
                <div className="font-display font-black text-[26px] tracking-[-0.03em] text-ink leading-none mt-4">{invoice.amount}</div>
                <p className="font-text text-xs text-ink-40 mt-2">{invoice.due}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
