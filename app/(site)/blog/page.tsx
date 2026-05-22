'use client'

import Link from 'next/link'
import Image from 'next/image'
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
              <div key={i} className="animate-pulse bg-background flex gap-6 px-8 py-10 border-b border-foreground last:border-b-0">
                <div className="hidden md:block w-40 h-28 bg-muted rounded shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-7 w-2/3 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-4/5 bg-muted rounded" />
                </div>
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
                className="group bg-background hover:bg-primary/[0.03] transition-colors flex flex-col md:flex-row gap-0"
              >
                {/* Cover image */}
                <div className="relative w-full md:w-56 md:shrink-0 h-52 md:h-auto bg-muted overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col flex-1 px-8 py-10">
                  <div className="flex items-center gap-3 mb-5">
                    {post.category && (
                      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                        {post.category}
                      </span>
                    )}
                    {post.category && post.publishedAt && <span className="w-1 h-1 rounded-full bg-border" />}
                    {post.publishedAt && (
                      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                        {post.publishedAt}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-black text-[26px] md:text-[32px] leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors mb-3">
                    {post.title}
                  </h2>
                  <p className="font-text text-[15px] leading-relaxed text-muted-foreground max-w-[60ch] mb-auto">
                    {post.excerpt}
                  </p>
                  <div className="mt-8 font-mono text-xs uppercase tracking-eyebrow text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                    Read post <span>&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
