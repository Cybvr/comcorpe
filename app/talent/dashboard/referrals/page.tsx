import { Gift } from 'lucide-react'
import { referral } from '@/lib/referrals'

export default function ReferralsPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[900px] mx-auto">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Refer & grow</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Client and talent referrals</h1>
      </div>

      <section className="border border-ink-10 rounded-xl p-6 bg-ink-10/40">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-1">Referral link</h2>
            <p className="font-text text-sm text-ink-60 max-w-[56ch]">
              Earn {referral.clientShare} of client billings for every client hired, and {referral.talentShare} of talent earnings for every job landed.
            </p>
            <div className="mt-4 flex items-center gap-2 max-w-[560px]">
              <div className="flex-1 px-3 py-2 bg-paper border border-ink-10 rounded-lg font-mono text-xs text-ink-60 truncate">
                {referral.link}
              </div>
              <button className="font-text text-xs font-semibold px-3 py-2 bg-ink text-paper rounded-lg hover:bg-blue transition-colors duration-[120ms]">
                Copy
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              {referral.channels.map((channel) => (
                <button key={channel} className="font-mono text-[10px] uppercase tracking-eyebrow px-3 py-1.5 border border-ink-20 rounded-full text-ink-60 hover:border-ink hover:text-ink transition-colors">
                  {channel}
                </button>
              ))}
            </div>
          </div>
          <Gift size={32} strokeWidth={1.2} className="text-blue shrink-0 mt-1" />
        </div>
      </section>
    </div>
  )
}
