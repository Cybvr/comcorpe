'use client'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { VettingTask } from '@/lib/vetting'
import { users, clientUsers, type User } from '@/lib/user'
import { jobs, type Job } from '@/lib/jobs'
import { pods as podsSeed, type Pod } from '@/lib/pods'
import { type GrowthHeadline } from '@/lib/insights'
import { posts as postsSeed, type Post } from '@/lib/posts'
import { spaces as spacesSeed, type Space } from '@/lib/spaces'
import {
  adaptArticleEntry,
  adaptBlogEntry,
  adaptInsightEntry,
  filterContentEntries,
  mergeContentEntries,
  parseContentId,
  type ContentEntry,
} from '@/lib/content'
import {
  leadership as leadershipSeed,
  advisors as advisorsSeed,
  type LeadershipMember,
  type AdvisorMember,
} from '@/lib/people'

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Strip undefined values before writing to Firestore */
function clean<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

async function readAll<T>(collectionName: string, seed: T[]): Promise<T[]> {
  try {
    const snap = await getDocs(collection(db, collectionName))
    if (snap.empty) return seed
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as T))
  } catch {
    return seed
  }
}

async function upsert(collectionName: string, id: string, data: DocumentData): Promise<void> {
  await setDoc(doc(db, collectionName, id), clean(data), { merge: true })
}

async function remove(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id))
}

function toPostId(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return hash || 1
}

function contentEntryToPost(entry: ContentEntry): Post {
  return {
    id: toPostId(entry.id),
    slug: entry.slug,
    authorId: entry.authorId || '',
    author: entry.author,
    role: entry.role || 'Contributor',
    badge: entry.badge || entry.category || 'Articles',
    title: entry.title,
    body: entry.body,
    likes: entry.likes ?? 0,
    replies: entry.replies ?? 0,
    category: entry.category || 'Articles',
  }
}

async function getUnifiedContentEntries() {
  const [blogEntries, insightEntries, articleEntries] = await Promise.all([
    readAll<Record<string, any>>('blog', []).then((items) => items.map((item) => adaptBlogEntry(item, String(item.id ?? item.slug ?? '')))),
    readAll<Record<string, any>>('insights', []).then((items) => items.map((item) => adaptInsightEntry({ slug: item.slug || item.id, ...item }, String(item.id ?? item.slug ?? '')))),
    readAll<Record<string, any>>('posts', postsSeed as unknown as Record<string, any>[]).then((items) => items.map((item) => adaptArticleEntry(item, String(item.id ?? item.slug ?? '')))),
  ])

  return mergeContentEntries(blogEntries, insightEntries, articleEntries)
}

// ─── Talent ────────────────────────────────────────────────────────────────────
const talentSeed = users.filter(u => u.role === 'talent')

export async function getTalent(): Promise<User[]> {
  const allUsers = await readAll<User>('users', [])
  const talent = allUsers.filter(u => u.role === 'talent')
  return talent.length > 0 ? talent : talentSeed
}

export async function createTalent(data: Omit<User, 'role'>): Promise<User> {
  const record: User = { ...data, role: 'talent' }
  await upsert('users', record.id, record)
  return record
}

export async function updateTalent(id: string, data: Partial<User>): Promise<void> {
  const all = await getTalent()
  const existing = all.find(u => u.id === id) ?? {}
  await upsert('users', id, { ...existing, ...data })
}

export async function deleteTalent(id: string): Promise<void> {
  await remove('users', id)
}

// ─── Clients ───────────────────────────────────────────────────────────────────
export async function getClients(): Promise<User[]> {
  const allUsers = await readAll<User>('users', [])
  const clients = allUsers.filter(u => u.role === 'client')
  return clients.length > 0 ? clients : clientUsers
}

export async function createClient(data: Omit<User, 'role'>): Promise<User> {
  const record: User = { ...data, role: 'client' }
  await upsert('users', record.id, record)
  return record
}

export async function updateClient(id: string, data: Partial<User>): Promise<void> {
  const all = await getClients()
  const existing = all.find(u => u.id === id) ?? {}
  await upsert('users', id, { ...existing, ...data })
}

export async function deleteClient(id: string): Promise<void> {
  await remove('users', id)
}

// ─── Jobs ──────────────────────────────────────────────────────────────────────
export async function getJobs(): Promise<Job[]> {
  return readAll<Job>('jobs', jobs)
}

export async function createJob(data: Omit<Job, 'id'>): Promise<Job> {
  const all = await getJobs()
  const id  = all.length > 0 ? Math.max(...all.map(j => j.id)) + 1 : 1
  const record: Job = { ...data, id }
  await upsert('jobs', record.slug, record)
  return record
}

export async function updateJob(id: number, data: Partial<Job>): Promise<void> {
  const all = await getJobs()
  const existing = all.find(j => j.id === id)
  if (!existing) return
  await upsert('jobs', existing.slug, { ...existing, ...data })
}

export async function deleteJob(id: number): Promise<void> {
  const all = await getJobs()
  const existing = all.find(j => j.id === id)
  if (!existing) return
  await remove('jobs', existing.slug)
}

export async function closeJob(jobId: number): Promise<void> {
  const all = await getJobs()
  const job = all.find(j => j.id === jobId)
  if (!job) return

  const closedAt = new Date().toISOString()

  // Mark job closed
  await upsert('jobs', job.slug, { ...job, status: 'Completed', closedAt })

  // Revoke access for all pod members
  if (job.podMembers && job.podMembers.length > 0) {
    await Promise.all(
      job.podMembers.map(async (userId) => {
        const userSnap = await getDoc(doc(db, 'users', userId))
        if (!userSnap.exists()) return
        const userData = userSnap.data()
        const updated = (userData.assignedJobSlugs ?? []).filter((s: string) => s !== job.slug)
        await upsert('users', userId, { ...userData, id: userId, assignedJobSlugs: updated })
      })
    )
  }
}

// ─── Pods ─────────────────────────────────────────────────────────────────────
export async function getPods(): Promise<Pod[]> {
  try {
    const snap = await getDocs(collection(db, 'pods'))
    if (snap.empty) return podsSeed
    // Use the Firestore document ID as canonical — overrides any stale `id` field in stored data
    return snap.docs.map(d => ({ ...d.data() as Partial<Pod>, id: d.id } as Pod))
  } catch {
    return podsSeed
  }
}

export async function createPod(data: Omit<Pod, 'id'>): Promise<Pod> {
  const id = data.slug || data.name.toLowerCase().replace(/\s+/g, '-')
  const record: Pod = { ...data, id }
  await upsert('pods', id, record)
  return record
}

export async function updatePod(id: string, data: Partial<Pod>): Promise<void> {
  const all = await getPods()
  const existing = all.find(p => p.id === id) ?? {}
  await upsert('pods', id, { ...existing, ...data })
}

export async function deletePod(id: string): Promise<void> {
  await remove('pods', id)
}

export async function getGrowthHeadlines(): Promise<GrowthHeadline[]> {
  try {
    const snap = await getDoc(doc(db, 'meta', 'growthConsultingHeadlines'))
    if (!snap.exists()) return []
    return (snap.data().items as GrowthHeadline[]) ?? []
  } catch {
    return []
  }
}

// ─── Posts ────────────────────────────────────────────────────────────────────
export async function getPosts(): Promise<Post[]> {
  const entries = await getUnifiedContentEntries()
  return filterContentEntries(entries, { contentType: 'article' }).map(contentEntryToPost)
}

export async function createPost(data: Omit<Post, 'id'> & { id?: number }): Promise<Post> {
  const record = await createBlogPost({
    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    title: data.title || '',
    excerpt: data.body || '',
    body: data.body || '',
    category: 'Articles',
    publishedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    author: data.author || '',
    authorId: data.authorId || '',
    badge: data.badge || data.category || 'Articles',
    role: data.role || 'Contributor',
    likes: data.likes || 0,
    replies: data.replies || 0,
    ...((data as any).thumbnail ? { thumbnail: (data as any).thumbnail } : {}),
  } as any)

  return contentEntryToPost(record)
}

export async function updatePost(id: number, data: Partial<Post>): Promise<void> {
  const all = await getUnifiedContentEntries()
  const existing = filterContentEntries(all, { contentType: 'article' }).find((entry) => toPostId(entry.id) === id)
  if (!existing) return

  if (existing.sourceCollection === 'posts') {
    await upsert('posts', existing.sourceId, {
      slug: data.slug ?? existing.slug,
      authorId: data.authorId ?? existing.authorId ?? '',
      author: data.author ?? existing.author,
      role: data.role ?? existing.role ?? 'Contributor',
      badge: data.badge ?? existing.badge ?? 'Articles',
      title: data.title ?? existing.title,
      body: data.body ?? existing.body,
      likes: data.likes ?? existing.likes ?? 0,
      replies: data.replies ?? existing.replies ?? 0,
      category: data.category ?? existing.category,
    })
    return
  }

  await updateBlogPost(existing.id, {
    slug: data.slug ?? existing.slug,
    title: data.title ?? existing.title,
    excerpt: data.body ? data.body : existing.excerpt,
    body: data.body ?? existing.body,
    category: 'Articles',
    author: data.author ?? existing.author,
    authorId: data.authorId ?? existing.authorId ?? '',
    badge: data.badge ?? existing.badge ?? 'Articles',
    role: data.role ?? existing.role ?? 'Contributor',
    likes: data.likes ?? existing.likes ?? 0,
    replies: data.replies ?? existing.replies ?? 0,
  } as any)
}

export async function deletePost(id: number): Promise<void> {
  const all = await getUnifiedContentEntries()
  const existing = filterContentEntries(all, { contentType: 'article' }).find((entry) => toPostId(entry.id) === id)
  if (!existing) return

  if (existing.sourceCollection === 'posts') {
    await remove('posts', existing.sourceId)
    return
  }

  await deleteBlogPost(existing.id)
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
import type { BlogPost } from '@/lib/blog'

export async function getBlogPosts(): Promise<BlogPost[]> {
  return getUnifiedContentEntries()
}

export async function createBlogPost(
  data: Partial<BlogPost> & Pick<BlogPost, 'title' | 'body' | 'category' | 'author'>
): Promise<BlogPost> {
  const sourceId = Date.now().toString()
  const now = new Date().toISOString()
  const record = {
    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    category: data.category,
    publishedAt: data.publishedAt || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    updatedAt: now,
    author: data.author,
    authorId: (data as any).authorId || '',
    badge: (data as any).badge,
    role: (data as any).role,
    likes: (data as any).likes ?? 0,
    replies: (data as any).replies ?? 0,
    ...(data.coverImage ? { coverImage: data.coverImage } : {}),
    ...((data as any).thumbnail ? { thumbnail: (data as any).thumbnail } : {}),
    ...((data as any).order != null ? { order: (data as any).order } : {}),
  }
  await upsert('blog', sourceId, record)
  return adaptBlogEntry(record, sourceId)
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<void> {
  const parsed = parseContentId(id)
  const updatedAt = new Date().toISOString()

  if (parsed.sourceCollection === 'insights') {
    await upsert('insights', parsed.sourceId, { ...data, updatedAt, slug: data.slug ?? parsed.sourceId })
    return
  }

  if (parsed.sourceCollection === 'posts') {
    await upsert('posts', parsed.sourceId, { ...data, updatedAt })
    return
  }

  await upsert('blog', parsed.sourceId, { ...data, updatedAt })
}

export async function deleteBlogPost(id: string): Promise<void> {
  const parsed = parseContentId(id)
  await remove(parsed.sourceCollection, parsed.sourceId)
}

// ─── Spaces ───────────────────────────────────────────────────────────────────
export async function getSpaces(): Promise<Space[]> {
  return readAll<Space>('spaces', spacesSeed)
}

// ─── System Users ─────────────────────────────────────────────────────────────
export async function getSystemUsers(): Promise<User[]> {
  return readAll<User>('users', [])
}

export async function createSystemUser(data: Partial<User>): Promise<User> {
  const id = data.id || Math.random().toString(36).substring(7)
  const record = { id, name: data.name || '', email: data.email || '', role: data.role || 'client' }
  await upsert('users', id, record)
  return record as User
}

export async function updateSystemUser(id: string, data: Partial<User>): Promise<void> {
  const all = await getSystemUsers()
  const existing = all.find(u => u.id === id) ?? {}
  await upsert('users', id, { ...existing, ...data })
}

export async function deleteSystemUser(id: string): Promise<void> {
  await remove('users', id)
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
import { type Invoice, type InvoiceStatus } from '@/lib/invoices'
import { type Payout, type PayoutStatus } from '@/lib/payouts'

export async function getInvoices(): Promise<Invoice[]> {
  const snap = await getDocs(collection(db, 'invoices'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice))
}

export async function createInvoiceAdmin(data: Omit<Invoice, 'id'>): Promise<Invoice> {
  const ref = await addDoc(collection(db, 'invoices'), clean({ ...data, updatedAt: new Date().toISOString() }))
  return { id: ref.id, ...data }
}

export async function updateInvoiceAdmin(id: string, status: InvoiceStatus, extra?: Partial<Invoice>): Promise<void> {
  await upsert('invoices', id, clean({ status, ...extra, updatedAt: new Date().toISOString() }))
}

// ─── Payouts ──────────────────────────────────────────────────────────────────
export async function getPayouts(): Promise<Payout[]> {
  const snap = await getDocs(collection(db, 'payouts'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Payout))
}

export async function createPayoutAdmin(data: Omit<Payout, 'id'>): Promise<Payout> {
  const ref = await addDoc(collection(db, 'payouts'), clean({ ...data, updatedAt: new Date().toISOString() }))
  return { id: ref.id, ...data }
}

export async function updatePayoutAdmin(id: string, status: PayoutStatus, extra?: Partial<Payout>): Promise<void> {
  await upsert('payouts', id, clean({ status, ...extra, updatedAt: new Date().toISOString() }))
}

// ─── Vetting ──────────────────────────────────────────────────────────────────
export async function getVettingTasks(): Promise<VettingTask[]> {
  try {
    const snap = await getDocs(collection(db, 'vettingTasks'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as VettingTask))
  } catch {
    return []
  }
}

export async function getVettingTaskForTalent(talentId: string): Promise<VettingTask | null> {
  try {
    const q = query(collection(db, 'vettingTasks'), where('talentId', '==', talentId))
    const snap = await getDocs(q)
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as VettingTask
  } catch {
    return null
  }
}

export async function createVettingTask(data: Omit<VettingTask, 'id'>): Promise<VettingTask> {
  const id = Date.now().toString()
  const record: VettingTask = { ...data, id }
  await upsert('vettingTasks', id, clean(record))
  // Update talent's vettingStatus and vettingTaskId
  await upsert('users', data.talentId, { vettingStatus: 'task-assigned', vettingTaskId: id })
  return record
}

export async function updateVettingTask(id: string, data: Partial<VettingTask>): Promise<void> {
  const snap = await getDoc(doc(db, 'vettingTasks', id))
  const existing = snap.exists() ? snap.data() : {}
  await upsert('vettingTasks', id, clean({ ...existing, ...data, id }))

  // Sync vettingStatus to the talent's user document
  if (data.status) {
    const talentId = (existing.talentId ?? data.talentId) as string | undefined
    if (talentId) {
      const statusMap: Record<string, string> = {
        assigned: 'task-assigned',
        submitted: 'submitted',
        approved: 'approved',
        rejected: 'rejected',
      }
      await upsert('users', talentId, { vettingStatus: statusMap[data.status] ?? data.status })
    }
  }
}

// ─── Leadership ────────────────────────────────────────────────────────────────
export async function getLeadership(): Promise<LeadershipMember[]> {
  return readAll<LeadershipMember>('leadership', leadershipSeed)
}

export async function createLeadership(data: Omit<LeadershipMember, 'id'>): Promise<LeadershipMember> {
  const id = data.name.toLowerCase().replace(/\s+/g, '-')
  const record: LeadershipMember = { ...data, id }
  await upsert('leadership', id, record)
  return record
}

export async function updateLeadership(id: string, data: Partial<LeadershipMember>): Promise<void> {
  const all = await getLeadership()
  const existing = all.find(m => m.id === id) ?? {}
  await upsert('leadership', id, { ...existing, ...data })
}

export async function deleteLeadership(id: string): Promise<void> {
  await remove('leadership', id)
}

// ─── Advisors ──────────────────────────────────────────────────────────────────
export async function getAdvisors(): Promise<AdvisorMember[]> {
  return readAll<AdvisorMember>('advisors', advisorsSeed)
}

export async function createAdvisor(data: Omit<AdvisorMember, 'id'>): Promise<AdvisorMember> {
  const id = data.name.toLowerCase().replace(/\s+/g, '-')
  const record: AdvisorMember = { ...data, id }
  await upsert('advisors', id, record)
  return record
}

export async function updateAdvisor(id: string, data: Partial<AdvisorMember>): Promise<void> {
  const all = await getAdvisors()
  const existing = all.find(m => m.id === id) ?? {}
  await upsert('advisors', id, { ...existing, ...data })
}

export async function deleteAdvisor(id: string): Promise<void> {
  await remove('advisors', id)
}
