import { RotateCcw, Search as SearchIcon } from 'lucide-react'
import DashboardPostComposer from '@/components/dashboard/DashboardPostComposer'
import PostCard from '@/components/dashboard/PostCard'
import SpaceCard from '@/components/dashboard/SpaceCard'
import { posts } from '@/lib/posts'
import { spaces } from '@/lib/spaces'

export default function CommunityPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1120px] mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-2">Community</p>
        <h1 className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">Conversations & Spaces</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        <section className="flex flex-col gap-4">
          <div className="relative">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
            <input 
              type="text" 
              placeholder="Search conversations, strategies or talent..."
              className="w-full pl-12 pr-4 py-3 bg-border/40 border border-transparent rounded-xl focus:outline-none focus:border-input transition-all font-text text-[15px]"
            />
          </div>
          <DashboardPostComposer />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          <button className="font-text text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 justify-center py-3 border border-border rounded-xl hover:border-input">
            <RotateCcw size={13} /> Load more posts
          </button>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">Spaces</h2>
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </section>
      </div>
    </div>
  )
}
