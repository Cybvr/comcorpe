'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBlogPost, getSystemUsers } from '@/lib/admin/store'
import type { User } from '@/lib/user'
import BlogForm, { EMPTY_FORM, type BlogFormData } from '@/components/admin/BlogForm'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getSystemUsers().then(setUsers).catch(() => {})
  }, [])

  async function handleSave(data: BlogFormData) {
    setSaving(true)
    setError('')
    const payload = { ...data }
    try {
      await createBlogPost(payload as any)
      router.push('/admin/blog?saved=true')
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-16 w-full">
      <div className="pb-2">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={12} /> Back to Blog
        </Link>
      </div>

      {error && (
        <div className="border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3 text-red-600">
          <AlertCircle size={15} />
          <span className="font-text text-sm font-semibold">{error}</span>
        </div>
      )}

      <BlogForm
        initial={EMPTY_FORM}
        onSave={handleSave}
        onCancel={() => router.push('/admin/blog')}
        saving={saving}
        users={users}
        submitLabel="Publish post"
      />
    </div>
  )
}
