'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, Search as SearchIcon } from 'lucide-react'
import PostCard from '@/components/dashboard/PostCard'
import { getPosts } from '@/lib/admin/store'
import type { Post } from '@/lib/posts'

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getPosts().then((p) => {
      setPosts(p)
    })
  }, [])

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1120px] mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-[18px] tracking-[-0.03em] text-foreground leading-none md:text-[20px]">Articles</h1>
        </div>
        <div className="relative w-full md:w-80">
          <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-border/40 border border-transparent rounded-xl focus:outline-none focus:border-input transition-all font-text text-[14px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 text-muted-foreground font-text text-sm">
          No articles found.
        </div>
      )}

      {filteredPosts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button className="font-text text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 justify-center py-3 px-6 border border-border rounded-xl hover:border-input">
            <RotateCcw size={13} /> Load more posts
          </button>
        </div>
      )}
    </div>
  )
}
