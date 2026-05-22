'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RotateCcw } from 'lucide-react'

import { getPosts } from '@/lib/admin/store'
import type { Post } from '@/lib/posts'

export default function GrowthCommunity({ audience }: { audience: 'talent' | 'client' }) {
  const communityHref = `/${audience}/dashboard/community`
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    getPosts().then((p) => {
      setPosts(p.slice(0, 4))
    })
  }, [])
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">Latest articles</h2>
        <Link href={communityHref} className="font-text text-xs text-primary hover:underline">View all articles</Link>
      </div>

      <div className="flex flex-col gap-0 border border-border rounded-xl overflow-hidden bg-background">
        {posts.map((post) => (
          <Link key={post.id} href={`${communityHref}/${post.slug}`} className="group block border-b border-border last:border-0 p-4 hover:bg-muted/50 transition-colors">
            <h3 className="font-display font-bold text-[15px] tracking-[-0.01em] text-foreground group-hover:text-primary transition-colors leading-tight mb-1.5">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {post.category && <span className="text-primary font-mono uppercase tracking-eyebrow text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-sm">{post.category}</span>}
              <span className="truncate">{post.body.replace(/<[^>]*>?/gm, '').substring(0, 70)}...</span>
            </div>
          </Link>
        ))}
      </div>

      <button className="font-text text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 justify-center py-3 border border-border rounded-xl hover:border-input">
        <RotateCcw size={13} /> Load more posts
      </button>
    </div>
  )
}
