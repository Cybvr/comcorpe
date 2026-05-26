import type { LegalPage as LegalPageData } from '@/lib/legal'

export default function LegalPage({ page }: { page: LegalPageData }) {
  return (
    <div className="bg-background min-h-screen">
      <div className="px-6 md:px-24 pt-16 md:pt-24 pb-24">
        <div className="mb-14 md:mb-20 border-b border-foreground pb-12 md:pb-16">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-6 h-px bg-muted-foreground inline-block" />
            {page.eyebrow}
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
            <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-foreground m-0 text-balance">
              {page.title}
            </h1>
            <div className="md:mb-2">
              <p className="font-text text-[18px] leading-lede text-muted-foreground max-w-[38ch]">{page.intro}</p>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground/70 mt-5">Last updated {page.updatedAt}</p>
            </div>
          </div>
        </div>

        <div className="max-w-[820px] space-y-10">
          {page.sections.map((section, index) => (
            <section key={section.title} className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-5 md:gap-8 border-b border-border pb-10 last:border-b-0">
              <span className="font-mono text-[13px] text-primary">{String(index + 1).padStart(2, '0')}.</span>
              <div>
                <h2 className="font-display font-black text-[28px] tracking-[-0.02em] text-foreground leading-tight">{section.title}</h2>
                <p className="font-text text-[17px] leading-relaxed text-muted-foreground mt-4">{section.body}</p>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 max-w-[820px] border border-border p-6">
          <p className="font-text text-sm leading-relaxed text-muted-foreground">
            For questions about this page, contact <a href="mailto:hello@comcorpe.com" className="text-primary hover:underline">hello@comcorpe.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
