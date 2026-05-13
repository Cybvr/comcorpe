import { Gift, Share2, Users } from 'lucide-react'
import { clientReferral } from '@/lib/client-dashboard'

export default function ReferralsPage() {
  return (
    <div className="px-8 py-8 max-w-[920px] mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Refer & grow</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Client and operator referrals</h1>
        <p className="font-text text-sm text-ink-60 mt-3 max-w-[62ch]">
          Share companies that need a growth system, or senior operators who should be part of the Comcorpe network.
        </p>
      </div>

      <section className="border border-ink-10 rounded-xl p-6 bg-ink-10/40 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-ink mb-2">Referral link</h2>
            <p className="font-text text-sm text-ink-60 max-w-[60ch]">{clientReferral.summary}</p>
            <div className="mt-5 flex items-center gap-2 max-w-[620px]">
              <div className="flex-1 px-3 py-2 bg-paper border border-ink-10 rounded-lg font-mono text-xs text-ink-60 truncate">
                {clientReferral.link}
              </div>
              <button className="font-text text-xs font-semibold px-3 py-2 bg-ink text-paper rounded-lg hover:bg-blue transition-colors duration-[120ms]">
                Copy
              </button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {clientReferral.channels.map((channel) => (
                <button key={channel} className="font-mono text-[10px] uppercase tracking-eyebrow px-3 py-1.5 border border-ink-20 rounded-full text-ink-60 hover:border-ink hover:text-ink transition-colors">
                  {channel}
                </button>
              ))}
            </div>
          </div>
          <Gift size={32} strokeWidth={1.2} className="text-blue shrink-0 mt-1" />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <article className="border border-ink-10 rounded-xl p-5 bg-paper">
          <Share2 size={18} strokeWidth={1.5} className="text-blue mb-4" />
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Client introductions</p>
          <div className="font-display font-black text-[30px] tracking-[-0.03em] text-ink leading-none">{clientReferral.clientShare}</div>
          <p className="font-text text-sm text-ink-60 mt-3">Of referred client billings when work closes.</p>
        </article>
        <article className="border border-ink-10 rounded-xl p-5 bg-paper">
          <Users size={18} strokeWidth={1.5} className="text-blue mb-4" />
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">Operator introductions</p>
          <div className="font-display font-black text-[30px] tracking-[-0.03em] text-ink leading-none">{clientReferral.talentShare}</div>
          <p className="font-text text-sm text-ink-60 mt-3">Of talent earnings when referred operators land work.</p>
        </article>
      </div>
    </div>
  )
}
