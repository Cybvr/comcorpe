'use client'
import { useState } from 'react'

export default function Closing() {
  const [email, setEmail] = useState('')

  return (
    <section id="closing" className="py-24 md:py-40 px-6 md:px-24 bg-ink text-paper border-b border-ink relative overflow-hidden dark-inv-section">
      {/* decorative ᵉ */}
      <div className="absolute -bottom-20 md:-bottom-40 -right-10 md:-right-20 font-display font-black text-[320px] md:text-[720px] leading-[0.8] tracking-[-0.06em] pointer-events-none italic select-none"
        style={{ background: 'linear-gradient(180deg, rgba(31,77,255,0.20) 0%, rgba(123,59,255,0.08) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
        e
      </div>

      <div className="flex items-baseline gap-6 mb-16">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-paper inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-paper inline-block" />
          Closing manifesto
        </span>
        <span className="font-mono text-xs text-paper/60 ml-auto">09 / 09</span>
      </div>

      <h2 className="font-display font-black text-[clamp(56px,8vw,144px)] leading-[0.92] tracking-[-0.05em] text-paper m-0 text-balance">
        Building the <span className="text-blue">infrastructure</span> for growth in complex markets.
      </h2>

      <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 md:items-end">
        <div>
          <div className="font-mono text-xs text-paper/50 uppercase tracking-[0.08em] mb-4">3–5 Year Ambition</div>
          <p className="font-text text-[17px] leading-relaxed text-paper/70 max-w-[40ch] m-0">
            Define and own the Growth Systems category. Become the trusted partner for complex
            growth mandates. Build a portfolio of high-impact engagements. Develop a globally
            relevant operating model.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['A Company', 'A Model', 'A Long-term Institutional Play'].map(p => (
              <span key={p} className="font-mono text-[11px] tracking-[0.08em] uppercase text-paper px-3 py-2 border border-paper/25">{p}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start md:items-end">
          <span className="font-mono text-xs text-paper/50 uppercase tracking-[0.08em]">Take the next step</span>
          <a
            href="/book"
            className="font-display font-black text-[clamp(40px,6vw,96px)] leading-[0.95] tracking-[-0.04em] text-paper text-left md:text-right group"
          >
            Book a session call
            <span className="text-blue ml-4 inline-block transition-transform duration-[240ms] group-hover:translate-x-3">→</span>
          </a>
          <div className="mt-4 flex border border-paper/25 w-full max-w-[480px]">
            <input
              className="flex-1 bg-transparent border-none outline-none text-paper px-5 py-4 font-text text-sm placeholder:text-paper/40"
              placeholder="your-name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button className="bg-blue text-white border-none px-6 font-text text-[13px] font-semibold cursor-pointer hover:bg-blue-hover transition-colors duration-[120ms]">
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
