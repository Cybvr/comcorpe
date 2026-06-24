import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Build - Comcorpe',
  description:
    'A dinner series, community, and newsletter for world-class founders and operators who are openly — or quietly — figuring out their next big thing.',
}

const serif = { fontFamily: '"Book Antiqua", Palatino, "Palatino Linotype", serif' } as const

const audience = [
  {
    n: '1',
    head: 'Operators',
    body: 'You own and drive the work. You take on short, high-impact engagements and want exceptional people to execute alongside you.',
  },
  {
    n: '2',
    head: 'Specialists',
    body: 'You go deep in your craft. You want to plug into serious engagements with sharp operators — without giving up the work you already do.',
  },
]

const howItWorks = [
  {
    head: 'Curated gatherings',
    body: 'Be in the room where it happens. Join private, thoughtfully-designed dinners, retreats, and events with builders on the same early journey — hosted by Comcorpe.',
  },
  {
    head: 'Vetted introductions',
    body: 'Get introduced to exceptional people who might become your next collaborator, advisor, client, or the specialist you have been looking for.',
  },
  {
    head: 'A personal spotlight',
    body: 'Get featured in the Build newsletter to spread word of your work with forward-thinking engineers, technologists, and investors.',
  },
  {
    head: 'Off-the-record chats',
    body: 'Join private group chats where you can ask anything — feedback, intros, resources — and get answers in real time from people who have been in your shoes.',
  },
  {
    head: 'Under-the-radar roles',
    body: 'Be first to hear about unlisted opportunities at high-potential companies before they are announced. The best ones never make it to job boards.',
  },
  {
    head: 'The best network',
    body: 'Comcorpe works with, and is backed by, some of the most capable operators across Africa. We are glad to share that with you.',
  },
]

const values = [
  {
    head: 'Confidentiality',
    body: 'You will meet people figuring out next steps, pivoting, and testing big ideas. To keep the space candid and safe, attendees and topics discussed are off the record.',
  },
  {
    head: 'Spirit of service',
    body: 'A rising tide lifts all boats. Instead of asking "what is in it for me?", members ask "what can I do for someone else?"',
  },
]

const faqs = [
  {
    q: 'What does Build include?',
    a: 'Private dinners, curated intros, off-the-record group chats, newsletter spotlights, fellowship cohorts, and early looks at serious people and companies in the Comcorpe orbit.',
  },
  {
    q: 'Do I need to leave my job to take part?',
    a: 'No. Most members keep their day roles and take on short, high-impact engagements alongside them. Build is built around how serious professionals already work.',
  },
  {
    q: 'How much time does it ask of me?',
    a: 'As much or as little as you want. Some members come for the dinners and chats; others take on project work through the network. You set the pace.',
  },
  {
    q: 'Is this only for people changing careers?',
    a: 'Not at all. Members range from people quietly mapping a next move to those who simply want sharper peers and better work. What they share is intent and a high bar.',
  },
  {
    q: 'Do I need to be based in a particular city?',
    a: 'No. Most gatherings happen in a handful of hub cities, but you can be based anywhere and still take part in the chats, intros, and newsletter.',
  },
  {
    q: 'How do nominations work? Can I nominate myself?',
    a: 'Yes — you can nominate yourself or someone you rate. Every nomination is reviewed by the team before an invitation goes out.',
  },
  {
    q: 'Is there any cost?',
    a: 'No. Build is free for members. Dinners and events are hosted by Comcorpe.',
  },
  {
    q: 'How do I stay in touch?',
    a: 'Join the newsletter to stay in the know, and apply when you are ready to be part of the room.',
  },
]

export default function BuildPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 md:px-24 md:pt-28 md:pb-24">
        <div className="max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-primary">Comcorpe</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-hero">Build</h1>
          <p className="mt-7 max-w-[40rem] text-[19px] leading-[1.6] text-muted-foreground md:text-[22px]" style={serif}>
            A dinner series, community, and newsletter for world-class operators and specialists who do their best
            work on serious, high-impact projects.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/talent"
              className="border border-foreground px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-foreground hover:text-background"
            >
              Nominate or apply
            </Link>
            <Link
              href="/insights"
              className="px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-opacity duration-200 hover:opacity-70"
            >
              Stay in the know →
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="border-t border-border px-6 py-16 md:px-24 md:py-24">
        <div
          className="max-w-[48rem] space-y-6 text-[18px] leading-[1.75] text-muted-foreground md:text-[20px]"
          style={serif}
        >
          <p className="text-foreground">
            Every journey accelerates when you are surrounded by the right people from day one.
          </p>
          <p>
            Operators who push you, specialists who build with you, advisors who sharpen you, and a community whose
            collective genius helps you cut through ambiguity faster.
          </p>
          <p>
            Comcorpe brings some of the most capable operators across Africa onto the work that matters most. Now it is
            your turn.
          </p>
          <p>
            Whether you are seeking inspiration, sharpening your craft, or eager to link arms with a team that is onto
            something — Build is where you find your people.
          </p>
        </div>
        <div className="mt-10">
          <Link
            href="/talent"
            className="border border-foreground px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-foreground hover:text-background"
          >
            Apply to join
          </Link>
        </div>
      </section>

      {/* Who is this for */}
      <section className="border-t border-border px-6 py-16 md:px-24 md:py-24">
        <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] tracking-hero">Who is this for?</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          {audience.map((a) => (
            <div key={a.head} className="flex flex-col gap-3">
              <span className="font-mono text-[12px] text-primary">{a.n}</span>
              <h3 className="font-mono text-[12px] uppercase tracking-eyebrow text-foreground">{a.head}</h3>
              <p className="text-[17px] leading-[1.65] text-muted-foreground md:text-[18px]" style={serif}>
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border px-6 py-16 md:px-24 md:py-24">
        <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] tracking-hero">How it works</h2>
        <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {howItWorks.map((item) => (
            <div key={item.head} className="flex flex-col gap-3 border-t border-border pt-5">
              <h3 className="font-mono text-[12px] uppercase tracking-eyebrow text-foreground">{item.head}</h3>
              <p className="text-[16px] leading-[1.65] text-muted-foreground" style={serif}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Community values */}
      <section className="border-t border-border px-6 py-16 md:px-24 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-primary">Community values</p>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
          {values.map((v) => (
            <div key={v.head} className="flex flex-col gap-4">
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1] tracking-hero">{v.head}</h3>
              <p className="text-[17px] leading-[1.7] text-muted-foreground md:text-[18px]" style={serif}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-border px-6 py-16 md:px-24 md:py-24">
        <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] tracking-hero">FAQs</h2>
        <div className="mt-10 max-w-[48rem]">
          {faqs.map((faq) => (
            <details key={faq.q} className="group border-b border-border py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] leading-snug text-foreground md:text-[19px]">
                <span style={serif}>{faq.q}</span>
                <span className="font-mono text-[20px] text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground md:text-[17px]" style={serif}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border px-6 py-20 md:px-24 md:py-28">
        <div className="max-w-3xl">
          <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.95] tracking-hero">Build</h2>
          <p className="mt-6 max-w-[36rem] text-[18px] leading-[1.7] text-muted-foreground md:text-[20px]" style={serif}>
            Community, fellowships, and warm starts for people building what comes next.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/talent"
              className="border border-foreground px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-foreground hover:text-background"
            >
              Nominate or apply
            </Link>
            <Link
              href="/insights"
              className="px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-opacity duration-200 hover:opacity-70"
            >
              Stay in the know →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
