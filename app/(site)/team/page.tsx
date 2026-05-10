import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team & Advisory — Comcorpᵉ',
  description: 'The people behind Comcorpᵉ — founding leadership and advisory network.',
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

const advisors = [
  {
    name: 'Kristjan Mar Hauksson',
    title: 'Strategic Lead',
    bio: 'Internationally recognized marketing strategist, entrepreneur, and award-winning creative leader with experience building and scaling companies across five countries. Kristjan combines strategic insight with hands-on expertise in branding, marketing automation, and data intelligence.',
    fullBio: 'Kristjan Mar Hauksson is an internationally recognized marketing strategist, entrepreneur, and award-winning creative leader with experience building and scaling companies across five countries. Over the course of his career, he has developed brand, business, and communications strategies across more than 20 global markets, working with organizations ranging from emerging enterprises to Fortune 500 companies. His work has earned multiple international accolades, including the 2014 European Search Personality award and the Eurobest Grand Prix for Media. A seasoned conference speaker and former board member of the Search Engine Professional Organization and Bing Advertising’s International Advisory Board, Kristjan combines strategic insight with hands-on expertise in branding, marketing automation, sales activation, and data intelligence. He brings a strong blend of creative vision, operational execution, and international perspective to the Comcorpe advisory ecosystem.',
    geo: 'Reykjavik'
  },
  {
    name: 'Olubayo Adekanmbi',
    title: 'AI & Data Lead',
    bio: 'Award-winning technology executive, AI researcher, and digital innovation leader with more than two decades of experience. Founder of EqualyzAI and Data Science Nigeria, Bayo is a recognized authority in emerging-market AI solutions.',
    fullBio: 'Olubayo Adekanmbi is an award-winning technology executive, AI researcher, and digital innovation leader with more than two decades of experience spanning artificial intelligence, advanced analytics, telecommunications, strategy, and sustainability across over 30 African markets. He is the founder of EqualyzAI and a recognized authority in emerging-market AI solutions, leveraging hyperlocal datasets and innovative products to drive inclusive digital transformation. His work has earned global recognition, including the Bill & Melinda Gates Global Grand Challenge award and inclusion among the Top 100 Global Innovators in Data and Analytics by Corinium Intelligence, while several of the AI products he led have been recognized by UNESCO/IRCAI for sustainable development impact. A published researcher and speaker at leading global AI conferences, including NeurIPS, ICLR, AAAI, and CVPR, Bayo also founded Data Science Nigeria, a non-profit initiative that has trained more than 500,000 learners in data science and AI. He brings deep technical expertise, strategic leadership, and a strong commitment to ecosystem development to the Comcorpe advisory network.',
    geo: 'Lagos'
  },
  {
    name: 'Melanie Vignon',
    title: 'Brand Operations Lead',
    bio: 'Global brand operations leader with deep experience across Europe, the Middle East, and Africa. Melanie combines strong organizational leadership with practical expertise in cross-cultural collaboration and agency operations.',
    fullBio: 'Melanie Vignon has built her career at the intersection of global brand operations, strategic communications, and creative leadership within international agency networks. With leadership experience across Europe, the Middle East, and Africa, including senior operational roles at DDB, she has worked with multinational teams and brands to drive integrated marketing initiatives across diverse markets. Melanie combines strong organizational leadership with deep experience in cross-cultural collaboration, agency operations, and creative project execution, bringing an international perspective and a practical understanding of complex brand ecosystems to the Comcorpe advisory network.',
    geo: 'Paris'
  },
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

        {/* Advisory Network */}
        <div id="advisors" className="mb-0">
          <div className="flex items-baseline gap-6 mb-10">
            <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-ink inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-ink inline-block" />
              Advisory Network
            </span>
            <span className="font-mono text-xs text-ink-40 ml-auto">02 / 02</span>
          </div>

          <p className="font-text text-[17px] leading-relaxed text-ink-60 max-w-[52ch] mb-12">
            The network brings pedigree, perspective and access across three continents.
            Deep technical expertise combined with strategic leadership in global markets.
          </p>

          <div className="grid grid-cols-1 gap-px bg-ink border border-ink">
            {advisors.map((m, i) => (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-8 lg:gap-16 px-8 md:px-12 py-10 md:py-14 bg-paper"
              >
                <div>
                  <div className="font-mono text-[11px] tracking-eyebrow uppercase text-blue mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue rounded-full" />
                    {m.geo}
                  </div>
                  <div className="font-display font-black text-[clamp(28px,3vw,42px)] leading-tight tracking-h3 text-ink mb-2">{m.name}</div>
                  <div className="font-mono text-[12px] tracking-widest uppercase text-ink-40">{m.title}</div>
                </div>
                <div className="font-text text-[16px] leading-relaxed text-ink-60 space-y-4 max-w-[72ch]">
                  {m.fullBio.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <div className="h-24 md:h-32" />
    </div>
  )
}
