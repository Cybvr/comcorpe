import { Gift, Share2, Users } from 'lucide-react'
import { clientReferral } from '@/lib/help'

export default function ReferralsPage() {
  return (
    <div className="space-y-6 max-w-[920px]">
      <div>
        <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-2">Refer & grow</p>
        <h2 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">Client and operator referrals</h2>
        <p className="font-text text-sm text-muted-foreground mt-3 max-w-[62ch]">
          Share companies that need a growth system, or senior operators who should be part of the Comcorpe network.
        </p>
      </div>

      <section className="border border-border rounded-xl p-6 bg-border/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground mb-2">Referral link</h2>
            <p className="font-text text-sm text-muted-foreground max-w-[60ch]">{clientReferral.summary}</p>
            <div className="mt-5 flex items-center gap-2 max-w-[620px]">
              <div className="flex-1 px-3 py-2 bg-background border border-border rounded-lg font-mono text-xs text-muted-foreground truncate">
                {clientReferral.link}
              </div>
              <button className="font-text text-xs font-semibold px-3 py-2 bg-foreground text-background rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]">
                Copy
              </button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {clientReferral.channels.map((channel) => (
                <button key={channel} className="font-mono text-[10px] uppercase tracking-eyebrow px-3 py-1.5 border border-input rounded-full text-muted-foreground hover:border-foreground hover:text-foreground transition-colors">
                  {channel}
                </button>
              ))}
            </div>
          </div>
          <Gift size={32} strokeWidth={1.2} className="text-primary shrink-0 mt-1" />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <article className="border border-border rounded-xl p-5 bg-background">
          <Share2 size={18} strokeWidth={1.5} className="text-primary mb-4" />
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Client introductions</p>
          <div className="font-display font-black text-[30px] tracking-[-0.03em] text-foreground leading-none">{clientReferral.clientShare}</div>
          <p className="font-text text-sm text-muted-foreground mt-3">Of referred client billings when work closes.</p>
        </article>
        <article className="border border-border rounded-xl p-5 bg-background">
          <Users size={18} strokeWidth={1.5} className="text-primary mb-4" />
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Operator introductions</p>
          <div className="font-display font-black text-[30px] tracking-[-0.03em] text-foreground leading-none">{clientReferral.talentShare}</div>
          <p className="font-text text-sm text-muted-foreground mt-3">Of talent earnings when referred operators land work.</p>
        </article>
      </div>
    </div>
  )
}
