import Link from 'next/link'
import { marketingMenuItems } from './marketingMenu'

export default function MarketingHeader({ dark = false }: { dark?: boolean }) {
  return (
    <header
      className={`shrink-0 flex items-center justify-end px-5 py-4 text-[10px] uppercase tracking-[0.14em] md:px-12 md:py-5 md:text-[11px] lg:px-16 ${
        dark ? 'text-white' : 'text-foreground'
      }`}
    >
      <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
        {marketingMenuItems.map((item) => (
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
  )
}
