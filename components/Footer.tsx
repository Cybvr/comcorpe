import React from 'react'
import { services } from '@/lib/services'

interface FooterLinkProps {
  children: React.ReactNode
  href?: string
}

function FooterLink({ children, href = '#' }: FooterLinkProps) {
  return (
    <a href={href} className="font-text text-sm text-background cursor-pointer border-b border-transparent hover:border-primary hover:text-primary transition-colors duration-[120ms] pb-px w-fit">
      {children}
    </a>
  )
}

export default function Footer() {
  const footerSections = [
    { head: 'Model', links: ['Orchestration', 'Specialist Pods', 'Growth Plays'] },
    { head: 'Services', links: services.map((service) => service.title) },
    { head: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Why Comcorpe', href: '/preview/why' }, { label: 'How it works', href: '/how-it-works' }, { label: 'Use Cases', href: '/case-studies' }, { label: 'Blog', href: '/blog' }, 'Press'] },
    { head: 'Contact', links: [{ label: 'Book a session call', href: '/book' }, { label: 'hello@comcorpe.com', href: 'mailto:hello@comcorpe.com' }, { label: 'Plot 5 Chief Yesufu Abiodun Oniru Rd, Victoria Island, Lagos 106104, Lagos', href: '#' }] },
  ]

  return (
    <footer className="bg-foreground text-background dark-inv-section">
      <div className="px-6 md:px-24 pt-20 md:pt-[120px] pb-16 md:pb-24 border-b border-background/[0.12]">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-background inline-flex items-center gap-2.5 mb-8">
          <span className="w-6 h-px bg-background inline-block" />
          Orchestrating capability
        </span>
        <img src="/images/comcorpe.png" alt="Comcorpe" className="h-24 md:h-40 lg:h-56 w-auto object-contain brightness-0 invert" />
        <div className="mt-8 font-display font-black text-[22px] tracking-[-0.02em] text-background">
          Orchestrating capability. <span className="text-background/50">Delivering outcomes. Scaling impact.</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 px-6 md:px-24 py-16">
        {footerSections.map(({ head, links }) => (
          <div key={head} className="flex flex-col gap-3.5">
            <span className="font-text text-[11px] font-semibold tracking-eyebrow uppercase text-background/50 mb-2">{head}</span>
            {links.filter(Boolean).map(l => typeof l === 'string'
              ? <FooterLink key={l}>{l}</FooterLink>
              : <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>
            )}
          </div>
        ))}
      </div>

      <div className="px-6 md:px-24 py-6 flex flex-col md:flex-row items-center justify-between border-t border-background/[0.12] font-mono text-xs text-background/50 gap-4">
        <span>© 2026 Comcorpᵉ Ltd. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
          <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  )
}
