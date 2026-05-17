'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { User, UserRole } from './user'

export async function updateUserProfile(id: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', id)
  const cleanData = JSON.parse(JSON.stringify(data))
  await setDoc(userRef, cleanData, { merge: true })
}

export function useCurrentUser() {
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthenticated(Boolean(fbUser))
      if (fbUser) {
        try {
          const emailLower = fbUser.email?.toLowerCase().trim() ?? ''
          const usersSnap = await getDocs(collection(db, 'users'))
          const matched = usersSnap.docs.find(d => {
            const data = d.data()
            return data.firebaseUid === fbUser.uid || data.email?.toLowerCase() === emailLower
          })
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
          }
        } catch (err) {
          console.error('Error fetching dynamic user profile:', err)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
  }, [])

  return { user: userProfile, loading, isAuthenticated }
}

import { onSnapshot } from 'firebase/firestore'

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
