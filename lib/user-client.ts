'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { currentUser, type User } from './user'

export async function updateUserProfile(id: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', id)
  const cleanData = JSON.parse(JSON.stringify(data))
  await setDoc(userRef, cleanData, { merge: true })
}

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
