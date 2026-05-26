import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signals — Comcorpᵉ',
  description: 'Signals is the Comcorpᵉ all-hands. An honest internal forum on how we work, what we\'re building, and where we\'re headed.',
}

export default function SignalsPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="border-b border-foreground px-6 pb-16 pt-16 md:px-24 md:pb-24 md:pt-24">
        <div className="mb-6 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">
          <span className="inline-block h-px w-6 bg-muted-foreground" />
          Event
        </div>
        <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-end">
          <h1 className="m-0 font-display text-[clamp(48px,7vw,104px)] leading-[0.92] tracking-hero text-foreground">
            Signals<span className="text-primary">.</span>
          </h1>
          <p className="max-w-[38ch] font-text text-[18px] leading-lede text-muted-foreground">
            Our first all-hands. An honest conversation about how we work, what we're building, and where we're headed across Pan-Africa.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-24 md:py-24">
        <div className="grid gap-16 lg:grid-cols-[5fr_7fr] lg:items-start">

          <div className="flex flex-col gap-8">
            <div>
              <div className="mb-3 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">What to expect</div>
              <div className="flex flex-col gap-px border border-foreground bg-foreground">
                {[
                  { n: '01', t: 'Opening', s: 'Why we exist and where we\'re going.' },
                  { n: '02', t: 'Operating Model, Live', s: 'Architect → Assemble → Operate with a real example.' },
                  { n: '03', t: 'Honest Status', s: 'The 8-step flow — what\'s working and what\'s not.' },
                  { n: '04', t: 'Arenas Update', s: 'What\'s in flight across Fintech, Infrastructure, and Consumer.' },
                  { n: '05', t: 'Open Floor', s: 'Real questions. No polishing.' },
                ].map((item) => (
                  <div key={item.n} className="grid grid-cols-[40px_1fr] gap-4 bg-background p-6 items-baseline">
                    <span className="font-mono text-xs text-primary">{item.n}</span>
                    <div>
                      <div className="font-display font-black text-[18px] tracking-[-0.01em] text-foreground">{item.t}</div>
                      <div className="mt-1 font-text text-sm text-muted-foreground">{item.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border p-6 flex flex-col gap-2">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground">Format</div>
              <div className="font-text text-sm text-foreground leading-relaxed">75 minutes · Hard stop · Open floor</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground">Follow-up</div>
              <div className="font-text text-sm text-foreground leading-relaxed">Write-up within 48h — decisions, open questions, next date</div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">Reserve your spot</div>
            <iframe
              src="https://lu.ma/embed/event/evt-M31gahBvjdJfHPB/simple"
              width="100%"
              height="450"
              frameBorder="0"
              style={{ border: '1px solid #bfcbda88', borderRadius: '4px' }}
              allow="fullscreen; payment"
              aria-hidden={false}
              tabIndex={0}
            />
          </div>

        </div>
      </section>
    </div>
  )
}
