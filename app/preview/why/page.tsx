import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Why Comcorpe - A Growth Systems Company',
  description: 'A small network of capable professionals, built to work with the largest companies in Africa.',
}

export default function WhyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 md:px-24 md:py-24">
      <div className="max-w-5xl">
        <h1 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.92] tracking-hero text-foreground">
          Why
        </h1>
        <div
          className="mt-8 max-w-[48rem] text-[18px] leading-[1.75] text-muted-foreground md:text-[20px]"
          style={{ fontFamily: '"Book Antiqua", Palatino, "Palatino Linotype", serif' }}
        >
          <p>
            Comcorpe is building a small network of genuinely capable professionals to work with the largest
            companies in Africa. We believe the most important growth work on the continent should not be handed to
            bloated teams, generic agencies, or people who cannot operate at the level the moment demands. It should
            be done by sharp operators with judgment, range, and the ability to move inside complexity without slowing
            everything down.
          </p>
          <p className="mt-6">
            The model is deliberately focused: small pods, high trust, serious standards, and work that matters. We
            are building for companies large enough to feel the cost of mediocre execution and ambitious enough to want
            something better.
          </p>
        </div>
      </div>
    </main>
  )
}
