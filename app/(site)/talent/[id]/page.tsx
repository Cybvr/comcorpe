import { notFound } from 'next/navigation'
import Link from 'next/link'
import { talentProfiles, getTalentProfile } from '@/lib/talent'
import { ArrowLeft, MapPin, ExternalLink } from 'lucide-react'

export function generateStaticParams() {
  return talentProfiles.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const p = getTalentProfile(id)
    return { title: `${p.name} — Comcorpᵉ Talent`, description: p.desc }
  } catch {
    return {}
  }
}

const archetypeMap: Record<string, { label: string; skills: string[]; markets: string[] }> = {
  'tunde-a':     { label: 'The Architect',  skills: ['Go-to-Market Strategy', 'Unit Economics', 'Commercial Design', 'Pan-Africa Expansion'], markets: ['Nigeria', 'Ghana', 'Kenya', 'UK'] },
  'sarah-m':     { label: 'The Operator',   skills: ['Revenue Operations', 'Sales Pipeline Automation', 'CRM Architecture', 'Data Platforms'], markets: ['Nigeria', 'South Africa', 'Pan-Africa'] },
  'david-o':     { label: 'The Integrator', skills: ['Regulatory Navigation', 'Market Entry', 'Government Relations', 'Foreign Brand Launch'], markets: ['Nigeria', 'West Africa', 'East Africa'] },
  'amira-h':     { label: 'The Architect',  skills: ['Brand Strategy', 'Campaign Architecture', 'Cultural Localisation', 'B2C Comms'], markets: ['Nigeria', 'MENA', 'UK', 'Pan-Africa'] },
  'james-k':     { label: 'The Operator',   skills: ['Performance Marketing', 'Customer Acquisition', 'Growth Loops', 'Paid Media at Scale'], markets: ['Nigeria', 'Egypt', 'Pan-Africa'] },
  'elena-r':     { label: 'The Integrator', skills: ['Strategic Partnerships', 'B2B Distribution', 'Corporate Networks', 'Alliance Building'], markets: ['South Africa', 'Nigeria', 'East Africa'] },
  'amara-nwosu': { label: 'The Architect',  skills: ['Growth Systems', 'Early-stage Strategy', 'Market Fit', 'Expansion Playbooks'], markets: ['Lagos', 'Pan-Africa', 'Global'] },
  'tobi-adeyemi':{ label: 'The Operator',   skills: ['Fintech Commercial Strategy', 'Regulated Markets', 'Revenue Architecture', 'CBN Navigation'], markets: ['Nigeria', 'UK', 'Pan-Africa'] },
}

const bgColors = ['bg-blue', 'bg-violet', 'bg-ink']

export default async function TalentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let profile
  try { profile = getTalentProfile(id) } catch { notFound() }

  const extra = archetypeMap[id] ?? {
    label: 'Specialist Operator',
    skills: ['Commercial Strategy', 'Market Expansion', 'Growth Systems'],
    markets: ['Pan-Africa'],
  }
  const bgColor = profile.color ?? bgColors[talentProfiles.findIndex(p => p.id === id) % bgColors.length]

  return (
    <div className="bg-paper min-h-screen">

      {/* Hero */}
      <div className="border-b border-ink">
        <div className="px-6 md:px-24 pt-14 pb-16 md:pt-20 md:pb-20">

          {/* Breadcrumb */}
          <Link href="/talent" className="inline-flex items-center gap-2 font-mono text-xs text-ink-40 hover:text-blue transition-colors duration-[120ms] mb-12">
            <ArrowLeft size={12} strokeWidth={1.5} />
            All talent
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">
            {/* Avatar */}
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl ${bgColor} flex items-center justify-center font-display font-black text-[32px] md:text-[40px] text-paper shrink-0`}>
              {profile.initials}
            </div>

            {/* Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-mono text-[11px] uppercase tracking-eyebrow text-blue border border-blue px-2.5 py-1">{extra.label}</span>
                <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-40 border border-ink-20 px-2.5 py-1">Available for briefs</span>
              </div>
              <h1 className="font-display font-black text-[clamp(40px,5vw,72px)] leading-[0.92] tracking-hero text-ink mb-3">{profile.name}</h1>
              <p className="font-text text-[18px] text-ink-60 mb-4">{profile.role}</p>
              <div className="flex items-center gap-2 font-mono text-xs text-ink-40">
                <MapPin size={11} strokeWidth={1.5} />
                {extra.markets[0]} · {profile.bg}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/request"
                  className="font-text text-sm font-semibold px-6 py-3 bg-ink text-paper hover:bg-blue transition-colors duration-[120ms] inline-flex items-center gap-2"
                >
                  Request this operator
                </Link>
                <Link
                  href="/book"
                  className="font-text text-sm font-semibold px-6 py-3 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors duration-[120ms] inline-flex items-center gap-2"
                >
                  Book a brief call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 md:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 lg:gap-24">

          {/* Left */}
          <div className="flex flex-col gap-14">

            {/* About */}
            <div>
              <div className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-ink-40" />
                About
              </div>
              <p className="font-text text-[19px] md:text-[22px] leading-lede text-ink-60 max-w-[52ch]">
                {profile.desc}
              </p>
            </div>

            {/* Capabilities */}
            <div>
              <div className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-ink-40" />
                Capabilities
              </div>
              <div className="flex flex-wrap gap-2">
                {extra.skills.map(s => (
                  <span key={s} className="font-mono text-[11px] tracking-eyebrow uppercase text-ink px-3 py-2 border border-ink-20 hover:border-ink transition-colors">{s}</span>
                ))}
              </div>
            </div>

            {/* Markets */}
            <div>
              <div className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-ink-40" />
                Markets
              </div>
              <div className="flex flex-wrap gap-2">
                {extra.markets.map(m => (
                  <span key={m} className="font-mono text-[11px] tracking-eyebrow uppercase text-blue border border-blue px-3 py-2">{m}</span>
                ))}
              </div>
            </div>

            {/* How they work */}
            <div>
              <div className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-ink-40" />
                Engagement model
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink border border-ink overflow-hidden">
                {[
                  { type: 'Retainer', desc: 'Ongoing system oversight and orchestration' },
                  { type: 'Project', desc: 'Scoped build or execution sprint' },
                  { type: 'Pod lead', desc: 'Leads a specialist pod on a live client brief' },
                ].map(e => (
                  <div key={e.type} className="bg-paper p-6 flex flex-col gap-2">
                    <span className="font-display font-black text-[18px] tracking-[-0.02em] text-ink">{e.type}</span>
                    <span className="font-text text-sm text-ink-60">{e.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-6">

            {/* CTA card */}
            <div className="bg-ink dark-inv-section p-8 flex flex-col gap-5">
              <div className="font-mono text-xs text-paper/50 uppercase tracking-eyebrow">Deploy this operator</div>
              <p className="font-display font-black text-[22px] leading-tight tracking-[-0.02em] text-paper">
                Ready to place {profile.name.split(' ')[0]} on your brief?
              </p>
              <p className="font-text text-sm text-paper/70">
                Submit a brief and we'll assess fit within 48 hours. No retainer required to start.
              </p>
              <Link
                href="/request"
                className="font-text text-sm font-semibold px-5 py-3 bg-blue text-white hover:bg-blue-hover transition-colors duration-[120ms] inline-flex items-center gap-2 w-fit"
              >
                Request a brief
                <ExternalLink size={13} strokeWidth={1.5} />
              </Link>
            </div>

            {/* Quick facts */}
            <div className="border border-ink-10 p-6 flex flex-col gap-5">
              <div className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow">Quick facts</div>
              {[
                { label: 'Archetype',   value: extra.label },
                { label: 'Background',  value: profile.bg },
                { label: 'Primary market', value: extra.markets[0] },
                { label: 'Languages',   value: 'English' },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40">{f.label}</span>
                  <span className="font-text text-sm text-ink">{f.value}</span>
                </div>
              ))}
            </div>

            {/* Other talent */}
            <div className="border border-ink-10 p-6 flex flex-col gap-4">
              <div className="font-mono text-xs text-ink-40 uppercase tracking-eyebrow">Similar operators</div>
              {talentProfiles
                .filter(p => p.id !== id && p.featured)
                .slice(0, 3)
                .map(p => (
                  <Link
                    key={p.id}
                    href={`/talent/${p.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className={`w-9 h-9 rounded-lg ${p.color ?? 'bg-ink'} flex items-center justify-center font-display font-black text-[12px] text-paper shrink-0`}>
                      {p.initials}
                    </div>
                    <div>
                      <div className="font-display font-black text-[14px] tracking-[-0.01em] text-ink group-hover:text-blue transition-colors leading-tight">{p.name}</div>
                      <div className="font-text text-[11px] text-ink-60">{p.role}</div>
                    </div>
                  </Link>
                ))}
              <Link href="/talent" className="font-mono text-xs text-blue hover:underline mt-1 inline-flex items-center gap-1">
                View all talent →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
