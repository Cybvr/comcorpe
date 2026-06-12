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
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-background border border-foreground flex flex-col gap-0 h-full">
                <div className="w-full h-52 md:h-64 bg-muted shrink-0" />
                <div className="flex flex-col flex-1 px-6 py-8 md:px-8 md:py-10 space-y-4 border-t border-foreground">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-16 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-7 w-full bg-muted rounded" />
                    <div className="h-7 w-2/3 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <p className="font-text text-muted-foreground text-sm">No posts yet.</p>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={getBlogHref(post.slug)}
                className="group bg-background border border-foreground hover:bg-primary/[0.03] transition-colors flex flex-col gap-0 h-full"
              >
                {/* Cover image */}
                <div className="relative w-full h-52 md:h-64 shrink-0 bg-muted overflow-hidden">
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
                <div className="flex flex-col flex-1 px-6 py-8 md:px-8 md:py-10 border-t border-foreground">
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
                  <h2 className="font-display font-black text-[24px] md:text-[28px] leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
