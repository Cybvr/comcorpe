import Link from 'next/link'
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
import { services, typicalJobs } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Services - Comcorpe',
  description:
    'Growth services spanning campaign launches, market entry, consumer research, growth strategy, and analytics.',
}

const serviceIcons = [
  Rocket,
  Route,
  Brush,
  Microscope,
  Megaphone,
  Radio,
  MoveRight,
  BarChart3,
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-24 md:pb-40">
        <div className="mb-16 md:mb-24 border-b border-foreground pb-14 md:pb-20">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-muted-foreground inline-block" />
            Services
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-20 items-start">
            <div>
              <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-foreground m-0 text-balance">
                Growth services
                <br />
                built for <span className="text-primary">complex markets.</span>
              </h1>
              <p className="font-text text-[18px] leading-lede text-muted-foreground max-w-[40ch] mt-8 mb-0">
                We plug into the moments where businesses need sharper positioning,
                better operating decisions, and cleaner execution across brand,
                growth, and measurement.
              </p>
            </div>

            <div className="border border-foreground p-6 md:p-8">
              <div className="font-display font-black text-[24px] md:text-[28px] tracking-tight text-foreground mb-6">
                Typical jobs they hire for
              </div>
              <div className="space-y-4">
                {typicalJobs.map((job, index) => {
                  const Icon = serviceIcons[index]
                  return (
                    <div key={job} className="flex items-center gap-4">
                      <div className="w-11 h-11 border border-border bg-border/50 flex items-center justify-center text-primary shrink-0">
                        <Icon size={20} strokeWidth={1.7} />
                      </div>
                      <span className="font-text text-[17px] md:text-[18px] text-foreground">
                        {job}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-foreground border border-foreground">
          {services.map((service, index) => {
            const Icon = serviceIcons[index]

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="grid grid-cols-1 lg:grid-cols-[180px_1.2fr_0.9fr] gap-8 lg:gap-14 bg-background px-8 md:px-12 py-10 md:py-12 hover:bg-primary/[0.03] transition-colors duration-200"
              >
                <div className="flex flex-col gap-5">
                  <span className="font-mono text-xs text-muted-foreground/70 uppercase tracking-eyebrow">
                    {service.id}
                  </span>
                  <div className="w-14 h-14 border border-border bg-border/50 flex items-center justify-center text-primary">
                    <Icon size={24} strokeWidth={1.7} />
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[11px] text-primary uppercase tracking-eyebrow border border-primary px-2 py-1 w-fit mb-4">
                    {service.category}
                  </div>
                  <h2 className="font-display font-black text-[clamp(28px,3.6vw,48px)] leading-tight tracking-h3 text-foreground m-0">
                    {service.title}
                  </h2>
                  <p className="font-text text-[16px] leading-relaxed text-muted-foreground mt-4 mb-0 max-w-[48ch]">
                    {service.summary}
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-6">
                  <div className="flex flex-wrap gap-2">
                    {service.idealFor.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[11px] tracking-[0.06em] uppercase text-foreground px-2.5 py-1.5 border border-input"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <span className="font-mono text-xs text-primary inline-flex items-center gap-2">
                    View service
                    <MoveRight size={14} strokeWidth={1.6} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
