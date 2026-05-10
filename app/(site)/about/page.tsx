import { Metadata } from 'next'
import { Fragment } from 'react'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const metadata: Metadata = {
  title: 'About Us — Comcorpᵉ',
  description: 'The provocation, our model, and the people behind Comcorpᵉ.',
}

const provocationInsights = [
  'Strategy exists without execution',
  'Execution exists without coherence',
  'Talent exists without orchestration',
  'Opportunities exist without structure',
]

const pillars = [
  {
    i: '01', verb: 'Architect', title: 'Design the growth system',
    body: 'We map the unit economics, the channel architecture and the commercial logic before we build anything. The output is a system, not a slide.',
    tags: ['UNIT ECONOMICS', 'COMMERCIAL DESIGN', 'FEEDBACK LOOPS'],
  },
  {
    i: '02', verb: 'Assemble', title: 'Curate best-fit execution talent',
    body: 'Specialist Pods are configured to the problem, not the org chart. Drawn from a curated network of operators, never a static bench.',
    tags: ['SPECIALIST PODS', 'GLOBAL TALENT', 'ON-DEMAND'],
  },
  {
    i: '03', verb: 'Operate', title: 'Drive implementation and iteration',
    body: 'We ship, measure and rewire. Every engagement compounds: knowledge becomes proprietary, systems become reusable, talent becomes fluent.',
    tags: ['EXECUTION', 'ITERATION', 'COMPOUNDING'],
  },
]

const comparisonRows = [
  { label: 'Teams', a: 'Fixed, salaried, project-staffed', b: 'Modular pods, configured to the brief' },
  { label: 'Engagements', a: 'Linear: brief → deck → handoff', b: 'Idea-led, continuous, iterative' },
  { label: 'Overhead', a: 'High structural drag', b: 'Low structural drag' },
  { label: 'Output', a: 'Recommendations and creative', b: 'A growth engine that runs' },
]

const engineItems = [
  { t: 'Proprietary, insight-driven opportunities', s: 'Originated from market signal, not client request.' },
  { t: 'Developed ahead of client demand', s: 'A backlog of plays, ready to deploy when the window opens.' },
  { t: 'Designed to unlock revenue or market entry', s: 'Each play maps to a measurable commercial outcome.' },
]

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

        {/* 1. Provocation */}
        <div id="provocation" className="scroll-mt-32 mb-24 md:mb-40">
          <div className="mb-16 md:mb-24 border-b border-ink pb-14 md:pb-20">
            <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-ink-60 inline-block" />
              The Provocation
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
              <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-ink m-0 text-balance">
                Growth is the most <br />
                <span className="text-blue">mismanaged</span> function.
              </h1>
              <p className="font-text text-[18px] leading-lede text-ink-60 max-w-[36ch] md:mb-2">
                Across emerging markets, growth is treated as effort rather than architecture.
                We are here to rewire that assumption.
              </p>
            </div>
            <ImagePlaceholder
              label="About image placeholder"
              className="mt-12 md:mt-16 aspect-[16/7] w-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 border border-ink overflow-hidden rounded-sm">
            <div className="p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-ink">
              <div className="font-mono text-xs text-ink-60 mb-6 uppercase tracking-widest">The Diagnosis</div>
              <div className="font-display font-black text-[clamp(32px,4vw,52px)] leading-tight tracking-h3 mb-10 text-ink">Growth is not treated as a system.</div>
              <ul className="list-none p-0 m-0 flex flex-col">
                {provocationInsights.map((b, i) => (
                  <li key={i} className="py-6 border-b border-ink-10 grid grid-cols-[40px_1fr] gap-4 font-text text-[17px] leading-relaxed text-ink last:border-b-0">
                    <span className="font-mono text-xs text-ink-60">0{i + 1}/</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 md:p-16 bg-ink text-paper flex flex-col">
              <div className="font-mono text-xs text-paper/60 mb-6 uppercase tracking-widest">The Result</div>
              <div className="font-display font-black text-[clamp(32px,4vw,52px)] leading-tight tracking-h3 text-paper mb-10">
                Reactive. Fragmented. Non-compounding.
              </div>
              <p className="font-text text-[19px] leading-relaxed text-paper/70 m-0 max-w-[42ch]">
                Across markets, growth is delivered as disconnected interventions: a campaign here,
                a hire there, a deck somewhere else. Each cycle starts from zero. Knowledge does not
                accumulate. Outcomes do not compound.
              </p>
              <div className="mt-16 p-8 bg-blue text-white font-display font-black text-[26px] tracking-[-0.02em] leading-snug">
                We treat growth as architecture, not effort.
              </div>
            </div>
          </div>
        </div>

        {/* 2. Model */}
        <div id="model" className="scroll-mt-32 mb-24 md:mb-40">
          <div className="mb-24 md:mb-40 border-b border-ink pb-20 md:pb-32">
            <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-ink-60 inline-block" />
              Market Forces
            </div>
            <div className="flex flex-col lg:grid lg:grid-cols-[6fr_6fr] gap-12 lg:gap-24 items-end mb-20">
              <h2 className="font-display font-black text-[clamp(48px,7.5vw,112px)] leading-[0.92] tracking-hero text-ink m-0 text-balance">
                Fragmented markets.<br />
                <span className="text-blue">Hybrid solutions.</span>
              </h2>
              <div className="font-text text-[19px] leading-relaxed text-ink-60 max-w-[42ch]">
                Emerging markets are defined by high-trust networks and low-visibility data.
                The winners are those who can navigate the gap between formal structure and informal reality.
              </div>
            </div>
            <ImagePlaceholder
              label="Market forces image placeholder"
              className="mb-16 md:mb-20 aspect-[16/7] w-full"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 border-t border-ink pt-12">
              {[
                { t: 'Network Dominance', s: 'Trust moves faster than contracts. Success is relationship-dependent.' },
                { t: 'Data Opacity', s: 'Signals are buried. Proprietary intelligence is the only leverage.' },
                { t: 'Execution Friction', s: 'The last mile is where most strategies fail. Operational depth is non-negotiable.' },
                { t: 'Modular Growth', s: 'Scaling requires flexibility. Static structures are liabilities.' }
              ].map((f, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="font-mono text-[13px] text-blue">0{i+1}.</div>
                  <div className="font-display font-black text-[22px] tracking-[-0.02em] text-ink">{f.t}</div>
                  <p className="font-text text-sm text-ink-60 leading-relaxed m-0">{f.s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-24 md:mb-40 bg-ink -mx-6 md:-mx-24 px-6 md:px-24 py-24 md:py-32 text-paper">
            <div className="flex items-baseline gap-6 mb-14">
              <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-paper inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-paper inline-block" />
                The Comcorpᵉ Proposition
              </span>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20 lg:mb-24 lg:items-end">
              <h2 className="font-display font-black text-[clamp(48px,7vw,112px)] leading-[0.94] tracking-hero text-paper m-0 text-balance">
                We build growth <span className="text-blue">engines that run.</span>
              </h2>
              <div className="font-text text-[19px] leading-relaxed text-paper/70 max-w-[38ch]">
                <span className="font-display font-black text-[24px] tracking-[-0.02em] text-paper block mb-4">Three pillars hold the model.</span>
                Architect, Assemble, Operate. Together they collapse the gap between strategy
                and execution.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-paper/20 mb-20">
              {pillars.map((p, i) => (
                <div
                  key={p.i}
                  className={`group p-8 md:p-12 hover:bg-blue/[0.08] transition-colors duration-[240ms] flex flex-col min-h-[400px] md:min-h-[460px] ${i < pillars.length - 1 ? 'border-b md:border-b-0 md:border-r border-paper/20' : ''}`}
                >
                  <div className="flex items-baseline gap-3 mb-16">
                    <span className="font-mono text-[13px] text-paper/60">{p.i}.</span>
                  </div>
                  <div className="font-display font-black text-[clamp(48px,5vw,72px)] leading-[0.92] tracking-hero text-paper">
                    {p.verb}<span className="text-blue">.</span>
                  </div>
                  <div className="h-6" />
                  <div className="font-text text-[13px] font-semibold tracking-eyebrow uppercase text-paper/60 mb-5">{p.title}</div>
                  <p className="font-text text-base leading-body text-paper/85 mb-auto">{p.body}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {p.tags.map(t => (
                      <span key={t} className="font-mono text-[11px] tracking-[0.06em] uppercase text-paper px-2.5 py-1.5 border border-paper/25">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-paper/20 grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] overflow-hidden">
              <div className="p-6 border-b border-r border-paper/20 font-mono text-xs text-paper/60 uppercase tracking-[0.08em]">vs.</div>
              <div className="p-6 border-b border-r border-paper/20 font-mono text-xs text-paper/60 uppercase tracking-[0.08em]">Traditional Model</div>
              <div className="p-6 border-b border-paper/20 font-mono text-xs text-white uppercase tracking-[0.08em] bg-blue">Comcorpᵉ Model</div>
              {comparisonRows.map((r, i) => (
                <Fragment key={i}>
                  <div className={`px-6 py-6 font-mono text-xs text-paper/60 uppercase tracking-[0.08em] border-r border-paper/20 ${i < comparisonRows.length - 1 ? 'border-b border-paper/[0.12]' : ''}`}>{r.label}</div>
                  <div className={`px-6 py-6 font-text text-[17px] text-paper/85 border-r border-paper/20 ${i < comparisonRows.length - 1 ? 'border-b border-paper/[0.12]' : ''}`}>{r.a}</div>
                  <div className={`px-6 py-6 font-text text-[17px] text-paper font-medium bg-blue/[0.08] ${i < comparisonRows.length - 1 ? 'border-b border-paper/[0.12]' : ''}`}>{r.b}</div>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="mb-0">
            <div className="flex items-baseline gap-6 mb-14">
              <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-ink inline-flex items-center gap-2.5">
                <span className="w-6 h-px bg-ink inline-block" />
                The Idea Engine
              </span>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-[7fr_5fr] gap-12 lg:gap-24 items-start">
              <div className="flex flex-col gap-10">
                <h2 className="font-display font-black text-[clamp(48px,6.5vw,104px)] leading-[0.92] tracking-hero text-ink m-0 text-balance">
                  We originate proprietary <span className="text-blue">Growth Plays.</span>
                </h2>
                <ImagePlaceholder
                  label="Growth play image placeholder"
                  className="aspect-[4/3] w-full"
                />
              </div>

              <div className="flex flex-col gap-8 pt-4">
                <p className="font-text text-[20px] leading-relaxed text-ink-60 m-0">
                  Beyond client engagements, Comcorpᵉ originates proprietary <em>Growth Plays</em> —
                  strategic constructs developed from market insight and transformed into
                  <em> Strategic Opportunity Briefs</em>.
                </p>
                <div className="flex flex-col gap-px bg-ink border border-ink overflow-hidden rounded-sm">
                  {engineItems.map((it, i) => (
                    <div key={i} className="grid grid-cols-[50px_1fr] gap-4 p-8 bg-paper items-baseline">
                      <span className="font-mono text-[15px] text-blue">0{i+1}</span>
                      <div>
                        <div className="font-display font-black text-[24px] tracking-[-0.02em] leading-tight text-ink">{it.t}</div>
                        <div className="font-text text-[15px] text-ink-60 mt-2 leading-relaxed">{it.s}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-6 bg-paper border border-ink font-mono text-xs tracking-[0.08em] uppercase text-center text-ink flex items-center justify-center gap-3">
                  <span className="w-2 h-2 bg-blue rounded-full animate-pulse" />
                  Asymmetric advantage in business development
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Team & Board */}
        <div id="team" className="scroll-mt-32 border-t border-ink pt-24 md:pt-32">
          <div className="mb-16 md:mb-24">
            <div className="font-mono text-xs text-ink-60 uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
              <span className="w-6 h-px bg-ink-60 inline-block" />
              Team &amp; Board
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
              <h2 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-ink m-0 text-balance">
                Named, credible<br />
                <span className="text-blue">people.</span>
              </h2>
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
                  <ImagePlaceholder
                    label={`${p.name} portrait placeholder`}
                    className="w-full aspect-[4/5]"
                  />
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
                  className="grid grid-cols-1 lg:grid-cols-[220px_1fr_2.5fr] gap-8 lg:gap-16 px-8 md:px-12 py-10 md:py-14 bg-paper"
                >
                  <ImagePlaceholder
                    label={`${m.name} portrait placeholder`}
                    className="aspect-[4/5] w-full max-w-[220px]"
                  />
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

      </div>
      <div className="h-24 md:h-32" />
    </div>
  )
}
