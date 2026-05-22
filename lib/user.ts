'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDocs, onSnapshot, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export type UserRole = 'client' | 'talent' | 'admin'

export interface User {
  id: string
  name: string
  initials: string
  role: UserRole
  email?: string
  company?: string
  clientId?: string
  credits?: number
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
  isOnboarded?: boolean
  industry?: string
  companySize?: string
  challenges?: string[]
  budget?: string
  timeline?: string
  source?: string
  notes?: string
  location?: string
  yearsExp?: string
  disciplines?: string[]
  portfolioUrl?: string
  linkedinUrl?: string
  availability?: string
  networkAffiliations?: string[]
}

export interface OmnicomAffiliate {
  label: string
  slug: string
  logo?: string
}

export const OMNICOM_AFFILIATES: OmnicomAffiliate[] = [
  { label: 'BBDO', slug: 'bbdo', logo: '/images/network/bbdo.jpg' },
  { label: 'DDB', slug: 'ddb' },
  { label: 'TBWA', slug: 'tbwa', logo: '/images/network/tbwa.jpeg' },
  { label: 'OMD', slug: 'omd', logo: '/images/network/omd.svg' },
  { label: 'PHD', slug: 'phd', logo: '/images/network/phd.png' },
  { label: 'Hearts & Science', slug: 'hearts-science' },
  { label: 'Interbrand', slug: 'interbrand' },
  { label: 'Rapp', slug: 'rapp', logo: '/images/network/rapp.svg' },
  { label: 'Critical Mass', slug: 'critical-mass', logo: '/images/network/critical-mass.webp' },
  { label: 'FleishmanHillard', slug: 'fleishmanhillard', logo: '/images/network/fleishmanhillard.png' },
  { label: 'Ketchum', slug: 'ketchum', logo: '/images/network/ketchum.png' },
  { label: 'Porter Novelli', slug: 'porter-novelli', logo: '/images/network/porter-novelli.svg' },
  { label: 'Other', slug: 'other' },
]

export const OMNICOM_AGENCIES = OMNICOM_AFFILIATES.map((affiliate) => affiliate.label)

const omnicomAffiliateMap = new Map(
  OMNICOM_AFFILIATES.map((affiliate) => [affiliate.label.toLowerCase(), affiliate])
)

export function getOmnicomAffiliate(label: string): OmnicomAffiliate | undefined {
  return omnicomAffiliateMap.get(label.toLowerCase())
}

export const clientUsers: User[] = [
  {
    id: 'volks-bank',
    name: 'Volks Bank',
    initials: 'VB',
    role: 'client',
    company: 'Volks Bank',
    clientId: 'volks-bank',
    credits: 8,
  },
  {
    id: 't-finance',
    name: 'T-Finance',
    initials: 'TF',
    role: 'client',
    company: 'T-Finance',
    clientId: 't-finance',
    credits: 5,
  },
  {
    id: 'gridwell',
    name: 'Gridwell',
    initials: 'GW',
    role: 'client',
    company: 'Gridwell',
    clientId: 'gridwell',
    credits: 4,
  },
  {
    id: 'volta-pay',
    name: 'Volta Pay',
    initials: 'VP',
    role: 'client',
    company: 'Volta Pay',
    clientId: 'volta-pay',
    credits: 3,
  },
]

const clientMap = new Map(clientUsers.map(u => [u.id, u]))

export function getClientUser(id: string): User {
  const user = clientMap.get(id)
  if (!user) {
    return {
      id,
      name: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      initials: id.split('-').map(w => w.charAt(0).toUpperCase()).join(''),
      role: 'client'
    }
  }
  return user
}

export const users: User[] = []

export const talentUsers = users.filter(u => u.role === 'talent')
export const talentRoster = users.filter(u => u.role === 'talent' && u.featured)

const userMap = new Map(users.map(u => [u.id, u]))

export function getTalentProfile(id: string): User {
  const user = userMap.get(id)
  if (!user) {
    return {
      id,
      name: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      initials: id.split('-').map(w => w.charAt(0).toUpperCase()).join(''),
      role: 'talent'
    }
  }
  return user
}

export const talentProfiles = talentUsers

export async function updateUserProfile(id: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', id)
  const cleanData = JSON.parse(JSON.stringify(data))
  await setDoc(userRef, cleanData, { merge: true })
}

function buildProfile(docId: string, data: Record<string, any>, fbUser: { uid: string; displayName?: string | null; photoURL?: string | null; email?: string | null }): User {
  const emailLower = fbUser.email?.toLowerCase().trim() ?? ''
  const rawName = data.name || fbUser.displayName || 'User'
  return {
    id: docId,
    name: rawName,
    initials: data.initials || rawName
      .split(' ')
      .map((n: string) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 3),
    role: (data.role || 'client') as UserRole,
    email: emailLower,
    company: data.company,
    clientId: data.clientId || data.id,
    credits: data.credits ?? 3,
    talentRole: data.talentRole,
    bg: data.bg,
    desc: data.desc,
    dashboardTitle: data.dashboardTitle,
    communityRole: data.communityRole,
    color: data.color,
    featured: data.featured,
    assignedJobSlugs: data.assignedJobSlugs || [],
    image: data.image || fbUser.photoURL || undefined,
    rate: data.rate,
    isOnboarded: data.isOnboarded ?? true,
    industry: data.industry,
    companySize: data.companySize,
    challenges: data.challenges,
    budget: data.budget,
    timeline: data.timeline,
    source: data.source,
    notes: data.notes,
    location: data.location,
    yearsExp: data.yearsExp,
    disciplines: data.disciplines,
    portfolioUrl: data.portfolioUrl,
    linkedinUrl: data.linkedinUrl,
    availability: data.availability,
    networkAffiliations: data.networkAffiliations,
  }
}

export function useCurrentUser() {
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let profileUnsub: (() => void) | null = null

    const authUnsub = onAuthStateChanged(auth, async (fbUser) => {
      // Clean up any previous profile listener when auth state changes
      if (profileUnsub) { profileUnsub(); profileUnsub = null }

      setIsAuthenticated(Boolean(fbUser))

      if (!fbUser) {
        setUserProfile(null)
        setLoading(false)
        return
      }

      try {
        const emailLower = fbUser.email?.toLowerCase().trim() ?? ''

        // One-time query to find which Firestore document belongs to this user
        const usersSnap = await getDocs(collection(db, 'users'))
        const matched = usersSnap.docs.find(d => {
          const data = d.data()
          return data.firebaseUid === fbUser.uid || data.email?.toLowerCase() === emailLower
        })

        if (matched) {
          // Subscribe to the specific document so profile changes propagate immediately
          profileUnsub = onSnapshot(doc(db, 'users', matched.id), snap => {
            if (snap.exists()) {
              setUserProfile(buildProfile(snap.id, snap.data() as Record<string, any>, fbUser))
            }
            setLoading(false)
          })
        } else {
          const fallbackName = fbUser.displayName || emailLower.split('@')[0] || 'User'
          setUserProfile({
            id: fbUser.uid,
            name: fallbackName,
            initials: fallbackName
              .split(' ')
              .map((n: string) => n.charAt(0))
              .join('')
              .toUpperCase()
              .slice(0, 3),
            role: 'client',
            email: emailLower,
            credits: 0,
            image: fbUser.photoURL || undefined,
            isOnboarded: false,
          })
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => {
      authUnsub()
      if (profileUnsub) profileUnsub()
    }
  }, [])

  return { user: userProfile, loading, isAuthenticated }
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }) as User)
        setUsers(usersList)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching users:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { users, loading }
}

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const unsubscribe = onSnapshot(
      doc(db, 'users', id),
      (docSnap) => {
        if (docSnap.exists()) {
          setUser({ id: docSnap.id, ...docSnap.data() } as User)
        } else {
          setUser(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching user:', err)
        setUser(null)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [id])

  return { user, loading }
}
