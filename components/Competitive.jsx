import { Fragment } from 'react'

function Dot({ kind }) {
  return (
    <span className={`w-2.5 h-2.5 rounded-full inline-block flex-none ${
      kind === 'yes' ? 'bg-blue' : kind === 'partial' ? 'bg-ink-40' : 'bg-transparent border border-ink-20'
    }`} />
  )
}

function Cell({ kind, text, last, ours }) {
  return (
    <div className={`px-6 py-6 font-text text-sm text-ink flex items-center gap-2.5 ${!last ? 'border-b border-ink-10' : ''} ${ours ? 'bg-blue/[0.06] font-medium border-r-0' : 'border-r border-ink-10'}`}>
      <Dot kind={kind} />
      <span>{text}</span>
    </div>
  )
}

export default function Competitive() {
  const rows = [
    { cap: 'Idea origination',      strategy: ['no','—'],        agency: ['partial','Reactive'],    advisor: ['no','—'],          ours: ['yes','Proprietary']   },
    { cap: 'System design',         strategy: ['yes','In-house'], agency: ['no','—'],                advisor: ['partial','Frameworks'], ours: ['yes','Architectural'] },
    { cap: 'Flexible execution',    strategy: ['no','—'],         agency: ['yes','Static'],          advisor: ['no','—'],          ours: ['yes','Modular pods']  },
    { cap: 'Compounding knowledge', strategy: ['partial','Decks'],agency: ['no','—'],                advisor: ['partial','Personal'],   ours: ['yes','Systematic']   },
  ]

  return (
    <section id="competitive" className="py-20 md:py-32 px-6 md:px-24 bg-paper border-b border-ink">
      <div className="flex items-baseline gap-6 mb-14">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-ink inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-ink inline-block" />
          Competitive Reality
        </span>
        <span className="font-mono text-xs text-ink-60 ml-auto">07 / 09</span>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-24 mb-14 md:items-baseline">
        <h2 className="font-display font-black text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-hero text-ink m-0 text-balance">
          A category of one.
        </h2>
        <p className="font-text text-[17px] leading-body text-ink-60 m-0">
          Strategy firms, agency networks and independent advisors each hold one piece of the
          system. None combine origination, design, execution and compounding into a single layer.
          <br /><br />
          <strong className="text-ink">Our competition is structural, not direct.</strong>
        </p>
      </div>

      <div className="border border-ink grid grid-cols-[200px_repeat(3,150px)_160px] md:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr] overflow-x-auto">
        {['Capability', 'Strategy firms', 'Agency networks', 'Independent advisors'].map((h) => (
          <div key={h} className="px-6 py-5 font-mono text-xs text-ink-60 uppercase tracking-[0.08em] border-b border-ink border-r border-ink-10">{h}</div>
        ))}
        <div className="px-6 py-5 font-mono text-xs text-white uppercase tracking-[0.08em] border-b border-ink bg-ink">Comcorpᵉ</div>

        {rows.map((r, i) => {
          const last = i === rows.length - 1
          return (
            <Fragment key={i}>
              <div key={`cap-${i}`} className={`px-6 py-6 font-display font-black text-[18px] tracking-[-0.02em] text-ink flex items-center border-r border-ink-10 ${!last ? 'border-b border-ink-10' : ''}`}>{r.cap}</div>
              <Cell key={`s-${i}`} kind={r.strategy[0]} text={r.strategy[1]} last={last} />
              <Cell key={`a-${i}`} kind={r.agency[0]}   text={r.agency[1]}   last={last} />
              <Cell key={`v-${i}`} kind={r.advisor[0]}  text={r.advisor[1]}  last={last} />
              <div key={`o-${i}`} className={`px-6 py-6 font-text text-sm text-ink flex items-center gap-2.5 bg-blue/[0.06] font-medium ${!last ? 'border-b border-ink-10' : ''}`}>
                <span className="w-2.5 h-2.5 rounded-full inline-block flex-none bg-blue" />
                <span>{r.ours[1]}</span>
              </div>
            </Fragment>
          )
        })}
      </div>

      <div className="mt-14 font-display font-black text-[clamp(28px,3.6vw,48px)] tracking-h3 leading-tight text-balance max-w-[28ch]">
        None combine idea origination, system design and flexible execution.{' '}
        <span className="text-blue">We do.</span>
      </div>
    </section>
  )
}
