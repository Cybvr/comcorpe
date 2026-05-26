import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Session — Comcorpᵉ',
  description: 'Book a 30-minute session with the Comcorpᵉ team.',
}

export default function BookPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="border-b border-foreground px-6 pb-16 pt-16 md:px-24 md:pb-24 md:pt-24">
        <div className="mb-6 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">
          <span className="inline-block h-px w-6 bg-muted-foreground" />
          Book a session
        </div>
        <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-end">
          <h1 className="m-0 font-display text-[clamp(48px,7vw,104px)] leading-[0.92] tracking-hero text-foreground">
            Let&apos;s talk<span className="text-primary">.</span>
          </h1>
          <p className="max-w-[38ch] font-text text-[18px] leading-lede text-muted-foreground">
            30 minutes with the Comcorpᵉ team. Come with a problem, a brief, or just a question.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-24 md:py-24">
        <iframe
          src="https://cal.com/comcorpe/30min?embed=true"
          width="100%"
          height="700"
          frameBorder="0"
          style={{ border: '1px solid #bfcbda88', borderRadius: '4px' }}
        />
      </section>
    </div>
  )
}
