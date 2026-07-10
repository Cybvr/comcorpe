import Link from 'next/link'
import HomeVideoDemoButton from '@/components/HomeVideoDemoButton'

const menuItems = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/insights', label: 'Insights' },
  { href: '/preview/why', label: 'Manifesto' },
  { href: '/preview/build', label: 'Build' },
]

export default function MainLandingPage() {
  return (
    <main
      className="flex h-screen flex-col overflow-hidden bg-black px-5 py-4 text-white md:px-12 md:py-5 lg:px-16"
      style={{ fontFamily: '"Book Antiqua", Palatino, "Palatino Linotype", serif' }}
    >
      <header className="shrink-0 flex items-center justify-end text-[10px] uppercase tracking-[0.14em] md:text-[11px]">
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-opacity duration-200 hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="flex min-h-0 flex-1 items-center py-6 md:py-8">
        <div className="flex max-w-5xl flex-col items-start gap-5 md:gap-6">
          <h1 className="font-display text-[clamp(2.1rem,5.8vw,5.4rem)] leading-[0.92] tracking-display">
            We are building a small network of capable professionals to work with the largest companies in africa
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/talent"
              className="border border-white px-4 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-white hover:text-black md:px-5 md:text-[11px]"
            >
              Join
            </Link>
            <HomeVideoDemoButton />
          </div>
        </div>
      </section>

      <footer className="shrink-0 text-[10px] md:text-[11px]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>&copy; 2026 Comcorpe</span>
          <span>.</span>
          <a
            href="https://a16z.com/terms-of-use/"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity duration-200 hover:opacity-70"
          >
            Terms of Use
          </a>
          <span>.</span>
          <a
            href="https://a16z.com/privacy-policy/"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity duration-200 hover:opacity-70"
          >
            Privacy Policy
          </a>
          <span>.</span>
        </div>
      </footer>
    </main>
  )
}
