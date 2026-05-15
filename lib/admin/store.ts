'use client'
import { users, clientUsers, type User } from '@/lib/user'
import { jobs, type Job } from '@/lib/jobs'

const KEYS = {
  talent: 'admin_talent',
  clients: 'admin_clients',
  jobs: 'admin_jobs',
  auth: 'admin_auth',
}

function read<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return seed
    return JSON.parse(raw) as T[]
  } catch {
    return seed
  }
}

function write<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export function adminLogin(password: string): boolean {
  if (password !== 'admin2026') return false
  localStorage.setItem(KEYS.auth, '1')
  return true
}

export function adminLogout(): void {
  localStorage.removeItem(KEYS.auth)
}

export function isAdminAuthed(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(KEYS.auth) === '1'
}

// ─── Talent ────────────────────────────────────────────────────────────────
const talentSeed = users.filter(u => u.role === 'talent')

export function getTalent(): User[] {
  return read<User>(KEYS.talent, talentSeed)
}

export function createTalent(data: Omit<User, 'role'>): User {
  const all = getTalent()
  const record: User = { ...data, role: 'talent' }
  write(KEYS.talent, [...all, record])
  return record
}

export function updateTalent(id: string, data: Partial<User>): void {
  const all = getTalent().map(u => u.id === id ? { ...u, ...data } : u)
  write(KEYS.talent, all)
}

export function deleteTalent(id: string): void {
  write(KEYS.talent, getTalent().filter(u => u.id !== id))
}

// ─── Clients ───────────────────────────────────────────────────────────────
export function getClients(): User[] {
  return read<User>(KEYS.clients, clientUsers)
}

export function createClient(data: Omit<User, 'role'>): User {
  const all = getClients()
  const record: User = { ...data, role: 'client' }
  write(KEYS.clients, [...all, record])
  return record
}

export function updateClient(id: string, data: Partial<User>): void {
  const all = getClients().map(u => u.id === id ? { ...u, ...data } : u)
  write(KEYS.clients, all)
}

export function deleteClient(id: string): void {
  write(KEYS.clients, getClients().filter(u => u.id !== id))
}

// ─── Jobs ──────────────────────────────────────────────────────────────────
export function getJobs(): Job[] {
  return read<Job>(KEYS.jobs, jobs)
}

export function createJob(data: Omit<Job, 'id'>): Job {
  const all = getJobs()
  const id = all.length > 0 ? Math.max(...all.map(j => j.id)) + 1 : 1
  const record: Job = { ...data, id }
  write(KEYS.jobs, [...all, record])
  return record
}

export function updateJob(id: number, data: Partial<Job>): void {
  const all = getJobs().map(j => j.id === id ? { ...j, ...data } : j)
  write(KEYS.jobs, all)
}

export function deleteJob(id: number): void {
  write(KEYS.jobs, getJobs().filter(j => j.id !== id))
}
