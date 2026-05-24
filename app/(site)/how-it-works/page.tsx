import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileSignature,
  Lightbulb,
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'How It Works — Comcorpe',
  description:
    'See how Comcorpe helps teams move from a business problem to a live specialist pod with structured search, approval, onboarding, and execution.',
}

const steps = [
  {
    number: '01',
    title: 'Problem appears',
    body: 'A specific growth challenge surfaces inside the business and needs fast, specialist support.',
    bullets: ['Market launch in three weeks', 'Brand strategy reset', 'Commercial research sprint'],
    icon: Lightbulb,
  },
  {
    number: '02',
    title: 'Opens marketplace',
    body: 'The manager enters the marketplace with a clear brief and the kind of outcome they need.',
    bullets: ['Strategy', 'Growth', 'Market entry', 'Brand systems', 'Research'],
    icon: Search,
  },
  {
    number: '03',
    title: 'Searches talent',
    body: 'Talent is filtered against the real shape of the brief, not just a job title.',
    bullets: ['Formerly at', 'Region', 'Industry', 'Budget / rate', 'Availability', 'Language'],
    icon: SlidersHorizontal,
  },
  {
    number: '04',
    title: 'Reviews profiles',
    body: 'The team evaluates fit across experience, context, seniority, and expected impact.',
    bullets: ['Operator track record', 'Relevant market exposure', 'Delivery readiness'],
    icon: Star,
    featuredProfile: true,
  },
  {
    number: '05',
    title: 'Shortlists talent',
    body: 'The right specialists are grouped into a focused project workspace around the problem.',
    bullets: ['Strategist', 'Market operator', 'Comms lead'],
    icon: Users,
    checklist: true,
  },
  {
    number: '06',
    title: 'Internal approval',
    body: 'Stakeholders review the scope, budget, and selected talent before activation.',
    bullets: ['Budget estimate', 'Scope of work', 'Selected specialists'],
    icon: Building2,
  },
  {
    number: '07',
    title: 'Contract + onboarding',
    body: 'The platform handles the admin layer so the team can move into execution quickly.',
    bullets: ['NDA', 'Contracts', 'Invoicing', 'Kickoff', 'Workspace access'],
    icon: FileSignature,
  },
  {
    number: '08',
    title: 'Execution',
    body: 'The pod delivers outcomes inside a shared workflow, with visibility from brief to output.',
    bullets: ['Strategy deck', 'Research', 'Launch plan', 'Dashboards', 'Campaign systems'],
    icon: BriefcaseBusiness,
    accent: true,
  },
]

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number]
  index: number
}) {
  const Icon = step.icon

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card p-6 md:p-8">
      <div className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-primary px-3 py-2 font-mono text-xs font-semibold tracking-[0.1em] text-primary-foreground md:left-8">
        {step.number}
      </div>

      <div className="mb-8 flex items-center justify-between pt-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
          <Icon className="h-6 w-6 text-foreground" strokeWidth={2.2} />
        </div>
        {index < steps.length - 1 ? (
          <div className="hidden xl:flex items-center gap-2 text-muted-foreground">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Next</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        ) : null}
      </div>

      <h2 className="mb-3 font-display text-[28px] leading-tight tracking-h3 text-foreground md:text-[32px]">
        {step.title}
      </h2>
      <p className="mb-6 max-w-[34ch] font-text text-[16px] leading-relaxed text-muted-foreground">
        {step.body}
      </p>

      {step.featuredProfile ? (
        <div className="mb-6 rounded-2xl border border-border bg-background p-4">
          <div className="mb-4 flex items-start gap-3">
            <img
              src="/images/talent/Daniel Osei.png"
              alt="Daniel Osei"
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div>
              <div className="font-text text-sm font-semibold text-foreground">Daniel Osei</div>
              <div className="font-text text-sm text-muted-foreground">Strategy Lead</div>
              <div className="font-text text-xs text-muted-foreground">Formerly at Interbrand</div>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-3 font-text text-sm text-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-primary text-primary" />
              4.9 (28)
            </span>
            <span>$140–$190/hr</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Brand Strategy', 'Growth'].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1.5 font-text text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <ul className="mt-auto flex flex-col gap-3">
        {step.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 font-text text-[15px] leading-relaxed text-foreground">
            {step.checklist ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            ) : (
              <span className={`mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full ${step.accent ? 'bg-primary' : 'bg-foreground'}`} />
            )}
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function HowItWorksPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-foreground px-6 pb-16 pt-16 md:px-24 md:pb-24 md:pt-24">
        <div className="mb-6 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">
          <span className="inline-block h-px w-6 bg-muted-foreground" />
          How it works
        </div>
        <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-end">
          <div>
            <h1 className="m-0 max-w-[11ch] font-display text-[clamp(48px,7vw,104px)] leading-[0.92] tracking-hero text-foreground">
              From brief to <span className="text-primary">execution.</span>
            </h1>
          </div>
          <p className="max-w-[38ch] font-text text-[18px] leading-lede text-muted-foreground">
            Comcorpe gives teams a structured path from a live commercial problem to an activated specialist pod,
            without the usual lag between diagnosis, staffing, approval, and delivery.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-24 md:py-24">
        <div className="mb-12 flex items-center justify-between gap-6 border-b border-border pb-6">
          <div>
            <div className="font-display text-[28px] tracking-h3 text-foreground md:text-[36px]">
              A repeatable operating flow
            </div>
            <p className="mt-2 max-w-[44ch] font-text text-[15px] leading-relaxed text-muted-foreground">
              Each step reduces decision friction and keeps the company moving toward a validated outcome.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Faster activation
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </section>

      <section className="bg-foreground px-6 py-16 text-background md:px-24 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-eyebrow text-background/60">
              <span className="inline-block h-px w-6 bg-background/40" />
              Next move
            </div>
            <h2 className="m-0 max-w-[11ch] font-display text-[clamp(40px,6vw,88px)] leading-[0.94] tracking-hero text-background">
              Bring the right operators in, fast.
            </h2>
          </div>
          <div>
            <p className="mb-6 max-w-[38ch] font-text text-[18px] leading-lede text-background/72">
              If you already know the problem you need to solve, we can help you shape the brief and configure the right pod around it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-text text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
              >
                Book a session
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/talent"
                className="inline-flex items-center gap-2 rounded-full border border-background/20 px-5 py-3 font-text text-sm font-semibold text-background transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                Browse talent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
