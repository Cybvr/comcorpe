'use client'

import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'
import { useBlogPostBySlug, useBlogPosts, getBlogHref } from '@/lib/blog'
import { notFound } from 'next/navigation'

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { post, loading } = useBlogPostBySlug(slug)
  const { posts: allPosts } = useBlogPosts()

  const otherPosts = allPosts.filter(p => p.slug !== slug)
  const related = otherPosts.slice(0, 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-6 pt-16 pb-24 md:px-24 md:pt-24 md:pb-40">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-10 w-2/3 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!post) notFound()

  const paragraphs = post.body.split(/\n\n+/).filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-16 pb-24 md:px-24 md:pt-24 md:pb-40">
        <div className="mx-auto max-w-6xl">

          <Link
            href="/blog"
            className="font-mono text-xs uppercase tracking-eyebrow text-muted-foreground hover:text-primary transition-colors"
          >
            <span aria-hidden="true">&larr;</span> Blog
          </Link>

          {/* Header */}
          <div className="mt-10 mb-12 border-b border-foreground pb-10">
            <div className="flex items-center gap-3 mb-6">
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
            <h1 className="font-display font-black text-[clamp(36px,5.5vw,72px)] leading-[0.92] tracking-tight text-foreground mb-6">
              {post.title}
            </h1>
            <p className="font-text text-[18px] leading-lede text-muted-foreground max-w-[48ch]">
              {post.excerpt}
            </p>
            {post.author && (
              <p className="mt-6 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                By {post.author}
              </p>
            )}
          </div>

          {/* Cover image */}
          {post.coverImage && (
            <div className="relative w-full h-64 md:h-[480px] mb-12 overflow-hidden border border-foreground">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Body + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-16 items-start">

            {/* Article body */}
            <article className="space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="font-text text-[17px] leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-5">
                  More posts
                </p>
                {otherPosts.length === 0 ? (
                  <p className="font-text text-sm text-muted-foreground/60">No other posts yet.</p>
                ) : (
                  <div className="space-y-px border border-foreground bg-foreground overflow-hidden">
                    {otherPosts.map(p => (
                      <Link
                        key={p.id}
                        href={getBlogHref(p.slug)}
                        className="group flex items-center gap-3 bg-background hover:bg-primary/[0.03] px-4 py-4 transition-colors"
                      >
                        <div className="relative w-14 h-14 shrink-0 bg-muted overflow-hidden">
                          {p.coverImage ? (
                            <Image src={p.coverImage} alt={p.title} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
                          )}
                        </div>
                        <div className="min-w-0">
                          {p.category && (
                            <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/60 block mb-0.5">
                              {p.category}
                            </span>
                          )}
                          <p className="font-display font-black text-[14px] leading-snug text-foreground group-hover:text-primary transition-colors truncate">
                            {p.title}
                          </p>
                          {p.publishedAt && (
                            <p className="font-mono text-[9px] text-muted-foreground/50 mt-0.5">{p.publishedAt}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <section className="mt-24 border-t border-foreground pt-14">
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-10">
                Related
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground border border-foreground overflow-hidden">
                {related.map(p => (
                  <Link
                    key={p.id}
                    href={getBlogHref(p.slug)}
                    className="group bg-background hover:bg-primary/[0.03] transition-colors flex flex-col"
                  >
                    <div className="relative w-full h-44 bg-muted overflow-hidden">
                      {p.coverImage ? (
                        <Image src={p.coverImage} alt={p.title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
                      )}
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      {p.category && (
                        <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/60 mb-4">
                          {p.category}
                        </span>
                      )}
                      <h3 className="font-display font-black text-[22px] leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors mb-3">
                        {p.title}
                      </h3>
                      <p className="font-text text-[14px] leading-relaxed text-muted-foreground line-clamp-3 mb-auto">
                        {p.excerpt}
                      </p>
                      <div className="mt-8 font-mono text-xs uppercase tracking-eyebrow text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                        Read <span>&rarr;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
