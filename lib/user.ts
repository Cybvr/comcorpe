import { useEffect, useState } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'

export async function updateUserProfile(id: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', id)
  const cleanData = JSON.parse(JSON.stringify(data))
  await setDoc(userRef, cleanData, { merge: true })
}

export type UserRole = 'client' | 'talent' | 'admin'

export interface User {
  id: string
  name: string
  initials: string
  role: UserRole
  email?: string
  // Client fields
  company?: string
  clientId?: string
  credits?: number
  // Talent profile fields
  talentRole?: string
  bg?: string
  desc?: string
  dashboardTitle?: string
  communityRole?: string
  color?: string
  featured?: boolean
  image?: string
  rate?: string
  assignedJobSlugs?: string[]
}

// ─── Client company users ─────────────────────────────────────────────────────
export const clientUsers: User[] = []

const clientMap = new Map(clientUsers.map(u => [u.id, u]))

export function getClientUser(id: string): User {
  const user = clientMap.get(id)
  if (!user) throw new Error(`Unknown client: ${id}`)
  return user
}

// ─── Current session (mock auth) ──────────────────────────────────────────────
export const currentUser: User = {
  id: 'jide-p',
  name: 'Jide',
  initials: 'JP',
  role: 'client',
  company: 'Volta Pay',
  clientId: 'volta-pay',
  credits: 3,
  assignedJobSlugs: [
    'volks-bank-loyalty-systems',
    't-finance-retention-sprints',
    'volta-pay-nigeria-entry',
  ],
}

// ─── All platform users (talent operators) ────────────────────────────────────
export const users: User[] = []

// ─── Derived views ────────────────────────────────────────────────────────────
export const talentUsers = users.filter(u => u.role === 'talent')
export const talentRoster = users.filter(u => u.role === 'talent' && u.featured)

// ─── Lookup helper (drop-in replacement for getTalentProfile) ─────────────────
const userMap = new Map(users.map(u => [u.id, u]))

export function getTalentProfile(id: string): User {
  const user = userMap.get(id)
  if (!user) throw new Error(`Unknown user: ${id}`)
  return user
}

// Legacy alias so any code referencing talentProfiles still works
export const talentProfiles = talentUsers

// ─── Dynamic user profile hook ────────────────────────────────────────────────
export function useCurrentUser() {
  const [userProfile, setUserProfile] = useState<User>(currentUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const emailLower = fbUser.email?.toLowerCase().trim() ?? ''
          const usersSnap = await getDocs(collection(db, 'users'))
          const matched = usersSnap.docs.find(d => d.data().email?.toLowerCase() === emailLower)
          if (matched) {
            const data = matched.data()
            setUserProfile({
              id: matched.id,
              name: data.name || fbUser.displayName || 'User',
              initials: data.initials || (data.name || fbUser.displayName || 'U')
                .split(' ')
                .map((n: string) => n.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 3),
              role: data.role || 'client',
              email: emailLower,
              company: data.company,
              clientId: data.clientId || data.id,
              credits: data.credits ?? 3,
              assignedJobSlugs: data.assignedJobSlugs || [],
              image: data.image || fbUser.photoURL || undefined,
            })
          }
        } catch (err) {
          console.error('Error fetching dynamic user profile:', err)
        }
      }
      setLoading(false)
    })
  }, [])

  return { user: userProfile, loading }
}
