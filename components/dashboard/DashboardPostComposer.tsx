'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { currentUser } from '@/lib/user'

export default function DashboardPostComposer() {
  const [postText, setPostText] = useState('')

  return (
    <div className="border border-ink-10 rounded-xl p-4 bg-paper">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center font-display font-black text-[11px] text-paper shrink-0">
          {currentUser.initials}
        </div>
        <input
          className="flex-1 bg-ink-10/60 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-40 focus:outline-none border border-transparent focus:border-ink-20 transition-colors"
          placeholder="Ask the community for help"
          value={postText}
          onChange={(event) => setPostText(event.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <button className="font-text text-xs font-semibold px-4 py-2 bg-blue text-white rounded-full hover:bg-blue-hover transition-colors duration-[120ms] flex items-center gap-1.5">
          <Plus size={12} /> Post
        </button>
      </div>
    </div>
  )
}
