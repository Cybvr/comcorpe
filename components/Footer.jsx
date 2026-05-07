function FooterLink({ children, href = '#' }) {
  return (
    <a href={href} className="font-text text-sm text-paper cursor-pointer border-b border-transparent hover:border-blue hover:text-blue transition-colors duration-[120ms] pb-px w-fit">
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="px-6 md:px-24 pt-20 md:pt-[120px] pb-16 md:pb-24 border-b border-paper/[0.12]">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-paper inline-flex items-center gap-2.5 mb-8">
          <span className="w-6 h-px bg-paper inline-block" />
          Orchestrating capability
        </span>
        <img src="/images/comcorpe.png" alt="Comcorpe" className="h-24 md:h-40 lg:h-56 w-auto object-contain brightness-0 invert" />
        <div className="mt-8 font-display font-black text-[22px] tracking-[-0.02em] text-paper">
          Orchestrating capability. <span className="text-paper/50">Delivering outcomes. Scaling impact.</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 px-6 md:px-24 py-16">
        {[
          { head: 'Model', links: ['Orchestration', 'Specialist Pods', 'Growth Plays'] },
          { head: 'Arenas', links: ['Technology & Fintech', 'Public Infrastructure', 'Consumer & Brand'] },
          { head: 'Company', links: ['International Board', 'Strategic Opportunity Briefs', 'Press'] },
          { head: 'Contact', links: [{ label: 'Request a brief', href: '/request' }, { label: 'hello@comcorp.e', href: 'mailto:hello@comcorp.e' }, { label: 'London · Lagos · Singapore', href: '#' }] },
        ].map(({ head, links }) => (
          <div key={head} className="flex flex-col gap-3.5">
            <span className="font-text text-[11px] font-semibold tracking-eyebrow uppercase text-paper/50 mb-2">{head}</span>
            {links.map(l => typeof l === 'string'
              ? <FooterLink key={l}>{l}</FooterLink>
              : <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>
            )}
          </div>
        ))}
      </div>

      <div className="px-6 md:px-24 py-6 flex flex-col md:flex-row items-center justify-between border-t border-paper/[0.12] font-mono text-xs text-paper/50 gap-4">
        <span>© 2026 Comcorpᵉ Ltd. All rights reserved.</span>
        <span>A Growth Systems Company</span>
      </div>
    </footer>
  )
}
