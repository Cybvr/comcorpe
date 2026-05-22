import Link from 'next/link'
import { featuredBlogPost, getBlogHref } from '@/lib/blog'

export const metadata = {
  title: 'Blog | Comcorpe',
  description: 'Comcorpe blog notes, announcements, and community updates.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-16 pb-24 md:px-24 md:pt-24 md:pb-40">
        <div className="mb-16 border-b border-foreground pb-12 md:mb-20 md:pb-16">
          <div className="mb-6 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">
            <span className="inline-block h-px w-6 bg-muted-foreground" />
            Blog
          </div>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-display text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-hero text-foreground">
                Notes that turn
                <br />
                momentum into <span className="text-primary">shared direction.</span>
              </h1>
            </div>
            <p className="max-w-[34ch] font-text text-[18px] leading-lede text-muted-foreground">
              Announcements, thinking, and field notes from the Comcorpe team.
            </p>
          </div>
        </div>

        <Link
          href={getBlogHref(featuredBlogPost.slug)}
          className="group grid gap-px overflow-hidden rounded-sm border border-foreground bg-foreground md:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="bg-background px-8 py-10 md:px-10 md:py-12">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
                {featuredBlogPost.category}
              </span>
              <span className="border border-primary px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                {featuredBlogPost.eyebrow}
              </span>
            </div>
            <h2 className="mt-8 font-display text-[34px] leading-tight tracking-h3 text-foreground transition-colors duration-300 group-hover:text-primary md:text-[44px]">
              {featuredBlogPost.title}
            </h2>
            <p className="mt-5 max-w-[48ch] font-text text-[16px] leading-relaxed text-muted-foreground">
              {featuredBlogPost.summary}
            </p>
            <div className="mt-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-primary transition-all duration-300 group-hover:gap-4">
              Read post <span aria-hidden="true">-&gt;</span>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-primary/8 px-8 py-10 md:px-10 md:py-12">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                Category
              </p>
              <p className="mt-2 font-display text-[24px] leading-tight tracking-[-0.03em] text-foreground">
                {featuredBlogPost.category}
              </p>
              <p className="mt-5 font-text text-sm leading-relaxed text-muted-foreground">
                {featuredBlogPost.publishedLabel}
                <br />
                {featuredBlogPost.venueLabel}
              </p>
            </div>
            <p className="mt-10 font-text text-sm leading-relaxed text-muted-foreground">
              {featuredBlogPost.notes[0]}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
