'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import type { User } from '@/lib/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { UploadCloud, X } from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'

const CATEGORIES = [
  'Blog',
  'Insights',
  'Events',
  'Announcements',
  'Strategy',
  'Operations',
  'Growth',
  'Technology',
  'Community',
  'Other',
]

export const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  category: 'Blog',
  author: '',
  authorId: '',
  publishedAt: '',
  coverImage: '',
}

export type BlogFormData = typeof EMPTY_FORM

export default function BlogForm({
  initial,
  onSave,
  onCancel,
  saving,
  users,
  submitLabel = 'Publish post',
}: {
  initial: BlogFormData
  onSave: (data: BlogFormData) => void
  onCancel: () => void
  saving: boolean
  users: User[]
  submitLabel?: string
}) {
  const [form, setForm] = useState<BlogFormData>({ ...EMPTY_FORM, ...initial })
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverError, setCoverError] = useState('')

  function set(field: keyof BlogFormData, value: string) {
    setForm(f => {
      const next = { ...f, [field]: value }
      if (field === 'title' && !f.slug) {
        next.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
      return next
    })
  }

  function handleAuthorSelect(userId: string) {
    const user = users.find(u => u.id === userId)
    setForm(f => ({
      ...f,
      authorId: userId,
      author: user?.name ?? '',
    }))
  }

  async function handleCoverFile(file?: File | null) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setCoverError('Please choose an image file.')
      return
    }
    setCoverUploading(true)
    setCoverError('')
    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const baseSlug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'blog-cover'
      const imageRef = ref(storage, `blog-covers/${baseSlug}-${Date.now()}.${extension}`)
      const uploadResult = await uploadBytes(imageRef, file)
      const downloadUrl = await getDownloadURL(uploadResult.ref)
      set('coverImage', downloadUrl)
    } catch {
      setCoverError('Upload failed. Please try again.')
    } finally {
      setCoverUploading(false)
    }
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
      <div className="space-y-6">
        <div>
          <Label>Title *</Label>
          <Input value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Post title" className="text-lg font-semibold py-6" />
        </div>

        <div>
          <Label>Body *</Label>
          <RichTextEditor
            value={form.body}
            onChange={html => setForm(f => ({ ...f, body: html }))}
            placeholder="Write the full post here…"
            disabled={saving}
          />
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-8 bg-muted/20 p-4 border border-border">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="my-post-slug" className="h-9 px-3" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={value => set('category', value)}>
              <SelectTrigger className="rounded-none border-input h-9 px-3 text-foreground hover:border-foreground bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Excerpt *</Label>
          <Textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} required placeholder="One or two sentences summarising the post" className="bg-background min-h-[60px] px-3 py-2" />
        </div>

        <div>
          <Label>Published date</Label>
          <Input value={form.publishedAt} onChange={e => set('publishedAt', e.target.value)} placeholder="e.g. 22 May 2026" className="bg-background h-9 px-3" />
        </div>

        <div>
          <Label>Author</Label>
          <Select value={form.authorId || 'none'} onValueChange={value => handleAuthorSelect(value === 'none' ? '' : value)}>
            <SelectTrigger className="rounded-none border-input h-9 px-3 text-foreground hover:border-foreground bg-background">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Select user —</SelectItem>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}{u.role ? ` (${u.role})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {form.authorId && (() => {
          const u = users.find(u => u.id === form.authorId)
          if (!u) return null
          return (
            <div className="flex items-center gap-3 p-2 bg-background border border-border">
              <div className={`w-8 h-8 rounded-sm shrink-0 flex items-center justify-center font-display font-black text-[10px] text-background overflow-hidden relative ${u.color || 'bg-foreground'}`}>
                {u.image ? <Image src={u.image} alt={u.name} fill className="object-cover" /> : u.initials}
              </div>
              <div>
                <p className="font-text text-sm font-semibold text-foreground leading-none">{u.name}</p>
                {u.talentRole && <p className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{u.talentRole}</p>}
              </div>
            </div>
          )
        })()}

        <div>
          <Label>Cover image (optional)</Label>
          <label
            htmlFor="blog-cover-upload"
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-foreground', 'bg-muted/40') }}
            onDragLeave={e => { e.currentTarget.classList.remove('border-foreground', 'bg-muted/40') }}
            onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-foreground', 'bg-muted/40'); handleCoverFile(e.dataTransfer.files[0]) }}
            className="flex min-h-20 cursor-pointer flex-col items-center justify-center border border-dashed border-input bg-background px-3 py-3 text-center transition-colors hover:border-foreground hover:bg-muted/30"
          >
            <input
              id="blog-cover-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={e => handleCoverFile(e.target.files?.[0])}
              disabled={coverUploading}
            />
            <UploadCloud size={18} className="mb-1.5 text-muted-foreground/70" />
            <span className="font-text text-xs font-semibold text-foreground">
              {coverUploading ? 'Uploading…' : 'Drop image or click'}
            </span>
          </label>
          {coverError && <p className="font-mono text-[10px] text-red-600 mt-1">{coverError}</p>}
          {form.coverImage && (
            <div className="relative mt-2 h-20 w-full overflow-hidden border border-border bg-muted">
              <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => set('coverImage', '')}
                className="absolute right-1 top-1 h-6 w-6 border-background/70 bg-background/90"
                aria-label="Remove cover image"
              >
                <X size={12} />
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-border mt-1">
          <Button type="submit" disabled={saving || coverUploading} className="h-9 w-full font-text text-sm">
            {saving ? 'Saving…' : coverUploading ? 'Uploading…' : submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving} className="h-9 w-full border-input font-text text-sm text-foreground hover:bg-border bg-background">
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
