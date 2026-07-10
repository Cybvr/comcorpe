const siteHeading =
  'We are building a small network of capable professionals to work with the largest companies in africa'

export default function SiteWideHeading() {
  return (
    <div className="border-b border-border bg-background px-6 py-8 md:px-24 md:py-12">
      <div className="mx-auto max-w-7xl">
        <p className="m-0 max-w-5xl font-display text-[clamp(2rem,5vw,5rem)] leading-[0.92] tracking-display text-foreground">
          {siteHeading}
        </p>
      </div>
    </div>
  )
}
