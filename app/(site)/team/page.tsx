import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team & Board — Comcorpᵉ',
  description: 'The people behind Comcorpᵉ — founding leadership and international board.',
}

const leadership = [
  {
    name: 'Enyi Odigbo',
    title: 'Chairman',
    bio: 'Advertising veteran and founder of Casers Group. Strategic visionary with decades of experience in the African marketing landscape.',
    tags: ['STRATEGY', 'GOVERNANCE'],
  },
  {
    name: 'Maxwell Marshall',
    title: 'Chief Business Architect',
    bio: 'Expert in commercial design and strategic partnerships, driving growth through innovative business models.',
    tags: ['COMMERCIAL DESIGN', 'PARTNERSHIPS'],
  },
  {
    name: 'Jide Pinheiro',
    title: 'Chief Creativity Architect',
    bio: 'Technology leader and designer focusing on product innovation and digital transformation.',
    tags: ['PRODUCT DESIGN', 'TECHNOLOGY'],
  },
]

const board = [
  { name: 'Dr. Olubayo Adekanmbi', credential: 'Founder & CEO, Data Science Nigeria (DSNai)', geo: 'Lagos' },
  { name: '[Board Member Name]', credential: 'Former Global Chairman, BBDO Worldwide', geo: 'London' },
  { name: '[Board Member Name]', credential: 'Founding Partner, [Africa-focused Growth Equity]', geo: 'Lagos' },
  { name: '[Board Member Name]', credential: 'Former Permanent Secretary, [Federal Ministry]', geo: 'Abuja' },
  { name: '[Board Member Name]', credential: 'Managing Partner, [Southeast Asia Venture]', geo: 'Singapore' },
  { name: '[Board Member Name]', credential: 'Chief Investment Officer, [Emerging Markets PE]', geo: 'New York' },
]

export default function AboutPage() {
  return (
    <div className="bg-paper">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-0">

        {/* Page header */}
        <div className="mb-16 md:mb-24 border-b border-ink pb-14 md:pb-20">
          <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-ink-60 inline-block" />
            Team &amp; Board
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
            <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-ink m-0 text-balance">
              Named, credible<br />
              <span className="text-blue">people.</span>
            </h1>
            <p className="font-text text-[18px] leading-lede text-ink-60 max-w-[36ch] md:mb-2">
              Comcorpᵉ assembles modular capability. The leadership and board provide
              the institutional spine — strategic counsel, geographic reach, and sector depth.
            </p>
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-baseline gap-6 mb-10">
            <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-ink inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-ink inline-block" />
              Founding Team
            </span>
            <span className="font-mono text-xs text-ink-40 ml-auto">01 / 02</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-ink">
            {leadership.map((p, i) => (
              <div
                key={i}
                className={`p-8 md:p-12 flex flex-col gap-6 ${i < leadership.length - 1 ? 'border-b md:border-b-0 md:border-r border-ink' : ''}`}
              >
                <div className="w-full aspect-[4/5] bg-ink-10 border border-ink-10 flex items-center justify-center group-hover:border-ink transition-colors duration-300">
                  <span className="font-mono text-[10px] text-ink-40 uppercase tracking-widest italic">Portrait Placeholder</span>
                </div>
                <div>
                  <div className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-40 mb-3">{p.title}</div>
                  <div className="font-display font-black text-[clamp(32px,3.5vw,52px)] leading-tight tracking-h3 text-ink">{p.name}</div>
                </div>
                <p className="font-text text-[17px] leading-relaxed text-ink-60 m-0 max-w-[32ch]">{p.bio}</p>
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-ink-10">
                  {p.tags.map(t => (
                    <span key={t} className="font-mono text-[11px] tracking-[0.06em] uppercase text-ink px-2.5 py-1.5 border border-ink-20">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* International Board */}
        <div className="mb-0">
          <div className="flex items-baseline gap-6 mb-10">
            <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-ink inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-ink inline-block" />
              International Board
            </span>
            <span className="font-mono text-xs text-ink-40 ml-auto">02 / 02</span>
          </div>

          <p className="font-text text-[17px] leading-relaxed text-ink-60 max-w-[52ch] mb-12">
            The board brings pedigree, perspective and access across three continents.
            Each member carries a single credential — the one that matters.
          </p>

          <div className="border border-ink">
            {board.map((m, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 md:gap-12 px-8 md:px-12 py-7 md:py-8 items-baseline ${i < board.length - 1 ? 'border-b border-ink-10' : ''}`}
              >
                <div className="font-display font-black text-[22px] leading-tight tracking-h3 text-ink">{m.name}</div>
                <div className="font-text text-[16px] leading-relaxed text-ink-60">{m.credential}</div>
                <div className="font-mono text-[11px] tracking-eyebrow uppercase text-blue border border-blue px-2.5 py-1.5 w-fit">{m.geo}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <div className="h-24 md:h-32" />
    </div>
  )
}
