'use client'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { users, clientUsers, type User } from '@/lib/user'
import { jobs, type Job } from '@/lib/jobs'
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

