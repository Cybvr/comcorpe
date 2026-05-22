import Link from 'next/link'
import { notFound } from 'next/navigation'
import { featuredBlogPost } from '@/lib/blog'

type BlogPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params

  if (slug !== featuredBlogPost.slug) {
    return {
      title: 'Post Not Found | Comcorpe',
    }
  }

  return {
    title: `${featuredBlogPost.title} | Comcorpe`,
    description: featuredBlogPost.summary,
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params

  if (slug !== featuredBlogPost.slug) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-16 pb-24 md:px-24 md:pt-24 md:pb-40">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/blog"
            className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
          >
            <span aria-hidden="true">&larr;</span> Back to blog
          </Link>

          <div className="mt-8 border-b border-foreground pb-12 md:pb-16">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="border border-primary px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                {featuredBlogPost.category}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {featuredBlogPost.eyebrow}
              </span>
            </div>

            <div className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] md:items-end">
              <div>
                <h1 className="font-display text-[clamp(44px,6vw,88px)] leading-[0.92] tracking-hero text-foreground">
                  {featuredBlogPost.title}
                </h1>
                <p className="mt-6 max-w-[42ch] font-text text-[18px] leading-lede text-muted-foreground">
                  {featuredBlogPost.lede}
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  Post snapshot
                </p>
                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Category
                    </dt>
                    <dd className="mt-1 font-text text-sm text-foreground">{featuredBlogPost.category}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Status
                    </dt>
                    <dd className="mt-1 font-text text-sm text-foreground">{featuredBlogPost.publishedLabel}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Meeting format
                    </dt>
                    <dd className="mt-1 font-text text-sm text-foreground">{featuredBlogPost.venueLabel}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Host
                    </dt>
                    <dd className="mt-1 font-text text-sm text-foreground">{featuredBlogPost.hostLabel}</dd>
                  </div>
                </dl>
                <Link
                  href={featuredBlogPost.ctaHref}
                  className="mt-6 inline-flex rounded-full bg-foreground px-4 py-2.5 font-text text-sm font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {featuredBlogPost.ctaLabel}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem]">
            <article className="space-y-8">
              <section>
                <p className="font-text text-[17px] leading-relaxed text-muted-foreground">
                  This post announces our first Comcorpe town hall as a simple Zoom gathering for the
                  community. It is a chance to hear what we are building, understand the shape of the
                  network, and join an early conversation about the work, opportunities, and
                  collaborations ahead.
                </p>
              </section>

              <section>
                <h2 className="font-display text-[28px] leading-tight tracking-[-0.03em] text-foreground">
                  What the town hall will cover
                </h2>
                <div className="mt-5 grid gap-px overflow-hidden rounded-sm border border-foreground bg-foreground">
                  {featuredBlogPost.agenda.map((item, index) => (
                    <div key={item} className="bg-background px-5 py-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                        0{index + 1}
                      </span>
                      <p className="mt-2 font-text text-[16px] leading-relaxed text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            </article>

            <aside className="h-fit rounded-3xl border border-border bg-primary/6 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                Notes
              </p>
              <div className="mt-5 space-y-4">
                {featuredBlogPost.notes.map((note) => (
                  <p key={note} className="font-text text-sm leading-relaxed text-muted-foreground">
                    {note}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
