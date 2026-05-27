import { Gift } from 'lucide-react'
import { referral } from '@/lib/referrals'

export default function ReferralsPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[900px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-black text-[18px] tracking-[-0.03em] text-foreground leading-none md:text-[20px]">Client and talent referrals</h1>
      </div>

      <section className="border border-border rounded-xl p-6 bg-border/40">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-1">Referral link</h2>
            <p className="font-text text-sm text-muted-foreground max-w-[56ch]">
              Earn {referral.clientShare} of client billings for every client hired, and {referral.talentShare} of talent earnings for every job landed.
            </p>
            <div className="mt-4 flex items-center gap-2 max-w-[560px]">
              <div className="flex-1 px-3 py-2 bg-background border border-border rounded-lg font-mono text-xs text-muted-foreground truncate">
                {referral.link}
              </div>
              <button className="font-text text-xs font-semibold px-3 py-2 bg-foreground text-background rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]">
                Copy
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              {referral.channels.map((channel) => (
                <button key={channel} className="font-mono text-[10px] uppercase tracking-eyebrow px-3 py-1.5 border border-input rounded-full text-muted-foreground hover:border-foreground hover:text-foreground transition-colors">
                  {channel}
                </button>
              ))}
            </div>
          </div>
          <Gift size={32} strokeWidth={1.2} className="text-primary shrink-0 mt-1" />
        </div>
      </section>
    </div>
  )
}
