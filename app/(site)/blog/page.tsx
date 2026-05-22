'use client'

import Link from 'next/link'
import { useBlogPosts, getBlogHref } from '@/lib/blog'

export default function BlogPage() {
  const { posts, loading } = useBlogPosts()

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
                Notes &amp; signals<br />from the field<span className="text-primary">.</span>
              </h1>
            </div>
            <p className="max-w-[34ch] font-text text-[18px] leading-lede text-muted-foreground">
              Announcements, thinking, and field notes from the Comcorpe team.
            </p>
          </div>
        </div>

        {loading && (
          <div className="space-y-px border border-foreground">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-background px-8 py-10 border-b border-foreground last:border-b-0">
                <div className="h-3 w-20 bg-muted rounded mb-4" />
                <div className="h-7 w-2/3 bg-muted rounded mb-3" />
                <div className="h-4 w-full bg-muted rounded mb-1" />
                <div className="h-4 w-4/5 bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <p className="font-text text-muted-foreground text-sm">No posts yet.</p>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid gap-px bg-foreground border border-foreground overflow-hidden">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={getBlogHref(post.slug)}
                className="group bg-background px-8 py-10 hover:bg-primary/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                    {post.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                    {post.publishedAt}
                  </span>
                </div>
                <h2 className="font-display font-black text-[26px] md:text-[32px] leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors mb-3">
                  {post.title}
                </h2>
                <p className="font-text text-[15px] leading-relaxed text-muted-foreground max-w-[60ch]">
                  {post.excerpt}
                </p>
                <div className="mt-6 font-mono text-xs uppercase tracking-eyebrow text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                  Read post <span>&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
