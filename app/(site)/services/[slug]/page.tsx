import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  BarChart3,
  Brush,
  Megaphone,
  Microscope,
  MoveRight,
  Radio,
  Rocket,
  Route,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getServiceBySlug, services } from '@/lib/services'

const serviceIconMap: Record<string, LucideIcon> = {
  'campaign-launch': Rocket,
  'market-entry': Route,
  'brand-refresh': Brush,
  'consumer-research': Microscope,
  'growth-strategy': Megaphone,
  'influencer-strategy': Radio,
  'regional-expansion': MoveRight,
  'analytics-dashboarding': BarChart3,
} as const

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {}
  }

  return {
    title: `${service.title} - Services - Comcorpe`,
    description: service.summary,
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const Icon = serviceIconMap[service.slug]
  const serviceTitleKey = service.title.toLowerCase().replaceAll(' and ', ' / ')
  const relatedServices = services
    .filter((item) => item.slug !== service.slug && item.title.toLowerCase().replaceAll(' and ', ' / ') !== serviceTitleKey)
    .slice(0, 4)

  return (
    <div className="bg-background">
      <div className="px-6 md:px-24 pt-14 md:pt-20 pb-16 md:pb-24 border-b border-foreground">
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Link
            href="/services"
            className="font-mono text-xs text-muted-foreground/70 hover:text-primary transition-colors duration-[120ms]"
          >
            Services
          </Link>
          <span className="font-mono text-xs text-input">/</span>
          <span className="font-mono text-xs text-muted-foreground/70 uppercase tracking-eyebrow">
            {service.id}
          </span>
          <span className="w-px h-3 bg-input inline-block" />
          <span className="font-mono text-[11px] text-primary uppercase tracking-eyebrow border border-primary px-2 py-1">
            {service.category}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-start">
          <div>
            <div className="w-16 h-16 border border-border bg-border/50 flex items-center justify-center text-primary mb-8">
              <Icon size={28} strokeWidth={1.7} />
            </div>
            <h1 className="font-display font-black text-[clamp(56px,8vw,132px)] leading-[0.9] tracking-hero text-foreground m-0">
              {service.title}
              <span className="text-primary">.</span>
            </h1>
            <p className="font-text text-[19px] md:text-[21px] leading-lede text-muted-foreground max-w-[44ch] mt-8 mb-0">
              {service.strapline}
            </p>
          </div>

          <div className="border border-foreground p-6 md:p-8">
            <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-eyebrow mb-4">
              What this covers
            </div>
            <p className="font-text text-[16px] leading-relaxed text-muted-foreground m-0">
              {service.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-24 py-16 md:py-24 border-b border-foreground">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20">
          <div>
            <div className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5 mb-8">
              <span className="w-6 h-px bg-foreground inline-block" />
              Ideal for
            </div>
            <div className="space-y-4">
              {service.idealFor.map((item) => (
                <div key={item} className="border-b border-border pb-4">
                  <p className="font-text text-[17px] leading-relaxed text-foreground m-0">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5 mb-8">
              <span className="w-6 h-px bg-foreground inline-block" />
              Deliverables
            </div>
            <div className="grid grid-cols-1 gap-px bg-foreground border border-foreground">
              {service.deliverables.map((item) => (
                <div key={item} className="bg-background px-6 py-5">
                  <p className="font-text text-[16px] leading-relaxed text-muted-foreground m-0">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-foreground dark-inv-section">
        <div className="px-6 md:px-24 py-16 md:py-24 border-b border-background/[0.12]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20">
            <div>
              <div className="font-mono text-xs text-background/50 uppercase tracking-eyebrow mb-8 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-background/50 inline-block" />
                Expected outcomes
              </div>
              <div className="space-y-5">
                {service.outcomes.map((item) => (
                  <div key={item} className="border-b border-background/[0.16] pb-5">
                    <p className="font-display font-black text-[24px] md:text-[30px] leading-tight tracking-[-0.02em] text-background m-0">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="font-mono text-xs text-background/50 uppercase tracking-eyebrow mb-8 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-background/50 inline-block" />
                Typical adjacent jobs
              </div>
              <div className="grid grid-cols-1 gap-px bg-background/[0.16] border border-background/[0.16]">
                {relatedServices.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/services/${item.slug}`}
                    className="bg-foreground px-6 py-5 font-text text-[16px] text-background/80 hover:text-background hover:bg-background/[0.08] transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-24 py-12 md:py-16 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div>
            <div className="font-mono text-xs text-background/40 uppercase tracking-eyebrow mb-2">
              Need this capability now
            </div>
            <p className="font-text text-[16px] text-background/60 m-0 max-w-[38ch]">
              We can scope the problem, define the operating path, and turn it into a
              working engagement quickly.
            </p>
          </div>
          <Link
            href="/book"
            className="font-text text-sm font-semibold px-6 py-3.5 bg-primary text-white hover:bg-primary/85 transition-colors duration-[120ms] inline-flex items-center gap-2.5 whitespace-nowrap"
          >
            Book a session call
            <MoveRight size={14} strokeWidth={1.6} />
          </Link>
        </div>
      </div>
    </div>
  )
}
