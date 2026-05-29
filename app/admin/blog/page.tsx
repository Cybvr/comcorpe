'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getSystemUsers } from '@/lib/admin/store'
import { storage } from '@/lib/firebase'
import type { BlogPost } from '@/lib/blog'
import type { User } from '@/lib/user'
import Modal from '@/components/admin/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Trash2, Edit2, Check, AlertCircle, FileText, UploadCloud, X } from 'lucide-react'
import PostThumbnail from '@/components/ui/PostThumbnail'

// Constants

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

// Form

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  category: 'Blog',
  author: '',
  authorId: '',
  publishedAt: '',
  coverImage: '',
  order: '',
}

type BlogFormData = typeof EMPTY_FORM

function BlogForm({
  initial,
  onSave,
  onCancel,
  saving,
  users,
}: {
  initial: BlogFormData
  onSave: (data: BlogFormData) => void
  onCancel: () => void
  saving: boolean
  users: User[]
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
    } catch (error) {
      console.error('Error uploading cover image:', error)
      setCoverError('Upload failed. Please try again.')
    } finally {
      setCoverUploading(false)
    }
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div>
        <Label>Title *</Label>
        <Input value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Post title" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="my-post-slug" />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={value => set('category', value)}>
            <SelectTrigger className="rounded-none border-input px-4 py-3 text-foreground hover:border-foreground">
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
        <Textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} required placeholder="One or two sentences summarising the post" />
      </div>

      <div>
        <Label>Body *</Label>
        <Textarea rows={10} value={form.body} onChange={e => set('body', e.target.value)} required placeholder={'Write the full post here.\n\nSeparate paragraphs with a blank line.'} />
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">Blank line = new paragraph on the site.</p>
      </div>

      {/* Author */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Home order <span className="font-mono text-[10px] text-muted-foreground/60 ml-1">(1 = first on home page)</span></Label>
          <Input type="number" min="1" value={form.order} onChange={e => set('order', e.target.value)} placeholder="e.g. 1" />
        </div>
        <div>
          <Label>Published date</Label>
          <Input value={form.publishedAt} onChange={e => set('publishedAt', e.target.value)} placeholder="e.g. 22 May 2026" />
        </div>
      </div>

      <div>
        <Label>Author</Label>
        <Select value={form.authorId || 'none'} onValueChange={value => handleAuthorSelect(value === 'none' ? '' : value)}>
          <SelectTrigger className="rounded-none border-input px-4 py-3 text-foreground hover:border-foreground">
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
      {/* Author preview */}
      {form.authorId && (() => {
        const u = users.find(u => u.id === form.authorId)
        if (!u) return null
        return (
          <div className="flex items-center gap-3 p-3 bg-muted/40 border border-border">
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
          onDragOver={(event) => {
            event.preventDefault()
            event.currentTarget.classList.add('border-foreground', 'bg-muted/30')
          }}
          onDragLeave={(event) => {
            event.currentTarget.classList.remove('border-foreground', 'bg-muted/30')
          }}
          onDrop={(event) => {
            event.preventDefault()
            event.currentTarget.classList.remove('border-foreground', 'bg-muted/30')
            handleCoverFile(event.dataTransfer.files[0])
          }}
          className="flex min-h-32 cursor-pointer flex-col items-center justify-center border border-dashed border-input bg-background px-4 py-6 text-center transition-colors hover:border-foreground hover:bg-muted/20"
        >
          <input
            id="blog-cover-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => handleCoverFile(event.target.files?.[0])}
            disabled={coverUploading}
          />
          <UploadCloud size={22} className="mb-2 text-muted-foreground/70" />
          <span className="font-text text-sm font-semibold text-foreground">
            {coverUploading ? 'Uploading cover…' : 'Drop an image here or click to upload'}
          </span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
            PNG, JPG, or WebP
          </span>
        </label>
        {coverError && (
          <p className="font-mono text-[10px] text-red-600 mt-1">{coverError}</p>
        )}
        {form.coverImage && (
          <div className="relative mt-2 h-32 w-full overflow-hidden border border-border bg-muted">
            <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => set('coverImage', '')}
              className="absolute right-2 top-2 h-7 w-7 border-background/70 bg-background/90"
              aria-label="Remove cover image"
            >
              <X size={13} />
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2 border-t border-border">
        <Button type="submit" disabled={saving || coverUploading} className="h-auto flex-1 py-3 font-text text-sm">
          {saving ? 'Saving…' : coverUploading ? 'Uploading…' : 'Publish post'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving} className="h-auto flex-1 border-input py-3 font-text text-sm text-foreground hover:bg-border">
          Cancel
        </Button>
      </div>
    </form>
  )
}

// Page

export default function AdminBlogPage() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [modal, setModal] = useState<null | 'create' | BlogPost>(null)
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([getBlogPosts(), getSystemUsers()])
      setPosts(postsData)
      setUsers(usersData)
    } catch {
      showMsg('Failed to load data.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setModal('create')
    }
  }, [searchParams])

  function showMsg(text: string, type: 'success' | 'error') {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  function postToForm(post: BlogPost): BlogFormData {
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      category: post.category,
      author: post.author,
      authorId: (post as any).authorId ?? '',
      publishedAt: post.publishedAt,
      coverImage: post.coverImage ?? '',
      order: post.order != null ? String(post.order) : '',
    }
  }

  async function handleSave(data: BlogFormData) {
    setSaving(true)
    const payload = {
      ...data,
      order: data.order !== '' ? Number(data.order) : undefined,
    }
    try {
      if (modal === 'create') {
        await createBlogPost(payload as any)
        showMsg(`"${data.title}" published.`, 'success')
      } else if (modal && typeof modal === 'object') {
        await updateBlogPost(modal.id, payload as any)
        showMsg(`"${data.title}" updated.`, 'success')
      }
      setModal(null)
      await reload()
    } catch {
      showMsg('Something went wrong.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    try {
      await deleteBlogPost(deleteTarget.id)
      showMsg(`"${deleteTarget.title}" deleted.`, 'success')
      setDeleteTarget(null)
      await reload()
    } catch {
      showMsg('Failed to delete.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered = posts.filter(p => {
    const q = search.toLowerCase()
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-[32px] tracking-hero text-foreground leading-tight">Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage every post published on the blog.
          </p>
        </div>
        <Button
          onClick={() => setModal('create')}
          className="self-start sm:self-auto h-auto px-4 py-2.5 font-text text-xs shrink-0"
        >
          <Plus size={14} /> New post
        </Button>
      </div>

      {message && (
        <div className={`border p-4 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-600' : 'bg-red-500/5 border-red-500/20 text-red-600'}`}>
          {message.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
          <span className="font-text text-sm font-semibold">{message.text}</span>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="pl-9 pr-4 py-2.5"
        />
      </div>

      {loading ? (
        <div className="border border-border p-16 text-center space-y-4">
          <div className="w-7 h-7 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Loading…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center text-muted-foreground">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-mono text-xs uppercase tracking-widest">No posts found</p>
          <p className="text-xs mt-1">{search ? 'Try a different search.' : 'Click "New post" to write the first one.'}</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {filtered.map(post => {
            const authorUser = users.find(u => u.id === (post as any).authorId)
            return (
              <div key={post.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-muted/5 transition-colors group">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="hidden sm:block shrink-0">
                    <PostThumbnail
                      src={post.coverImage}
                      alt={post.title}
                      category={post.category}
                      id={post.id}
                      className="w-16 h-16"
                      showBadge={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.category && (
                        <span className="font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase border bg-primary/10 border-primary/20 text-primary">
                          {post.category}
                        </span>
                      )}
                      <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">{post.publishedAt}</span>
                    </div>
                    <h3 className="font-display text-base font-black text-foreground leading-snug truncate pr-4">{post.title}</h3>
                    <p className="font-text text-xs text-muted-foreground line-clamp-1 max-w-[65ch]">{post.excerpt}</p>
                    <div className="flex items-center gap-2 pt-0.5">
                      {authorUser?.image && (
                        <div className={`relative w-5 h-5 rounded-sm overflow-hidden ${authorUser.color || 'bg-foreground'}`}>
                          <Image src={authorUser.image} alt={authorUser.name} fill className="object-cover" />
                        </div>
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground/60">{post.author}</span>
                      <span className="font-mono text-[10px] text-muted-foreground/40">/{post.slug}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => setModal(post)} className="h-auto w-auto p-2 text-muted-foreground hover:text-foreground hover:border-foreground" title="Edit">
                    <Edit2 size={13} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setDeleteTarget(post)} className="h-auto w-auto p-2 text-muted-foreground hover:text-red-500 hover:border-red-500" title="Delete">
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="font-mono text-[11px] text-muted-foreground/60 uppercase tracking-widest">
          {filtered.length} post{filtered.length !== 1 ? 's' : ''}{search ? ' matching' : ' total'}
        </p>
      )}

      {modal !== null && (
        <Modal
          title={modal === 'create' ? 'New post' : `Edit: ${(modal as BlogPost).title}`}
          onClose={() => !saving && setModal(null)}
        >
          <BlogForm
            initial={modal === 'create' ? EMPTY_FORM : postToForm(modal as BlogPost)}
            onSave={handleSave}
            onCancel={() => setModal(null)}
            saving={saving}
            users={users}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete post" onClose={() => !saving && setDeleteTarget(null)}>
          <div className="space-y-5">
            <p className="font-text text-sm text-foreground leading-relaxed">
              Permanently delete <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="destructive" onClick={handleDelete} disabled={saving} className="h-auto flex-1 py-3 font-text text-sm">
                {saving ? 'Deleting…' : 'Delete post'}
              </Button>
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={saving} className="h-auto flex-1 border-input py-3 font-text text-sm text-foreground hover:bg-border">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
