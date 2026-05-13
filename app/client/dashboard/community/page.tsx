import { RotateCcw } from 'lucide-react'
import DashboardPostComposer from '@/components/dashboard/DashboardPostComposer'
import PostCard from '@/components/dashboard/PostCard'
import SpaceCard from '@/components/dashboard/SpaceCard'
import { posts } from '@/lib/posts'
import { spaces } from '@/lib/spaces'

export default function CommunityPage() {
  return (
    <div className="px-8 py-8 max-w-[1120px] mx-auto">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Community</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Community posts and spaces</h1>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-8">
        <section className="flex flex-col gap-3">
          <DashboardPostComposer />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} baseHref="/client/dashboard/community" />
          ))}
          <button className="font-text text-sm text-ink-60 hover:text-ink transition-colors flex items-center gap-2 justify-center py-3 border border-ink-10 rounded-xl hover:border-ink-20">
            <RotateCcw size={13} /> Load more posts
          </button>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Spaces</h2>
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </section>
      </div>
    </div>
  )
}
