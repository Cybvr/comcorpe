'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Building2, Mail } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useCurrentUser, updateUserProfile } from '@/lib/user'
import { storage } from '@/lib/firebase'

const INDUSTRIES = ['Fintech', 'Banking', 'FMCG', 'Retail', 'Healthcare', 'Energy', 'Media', 'Other']
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']
const CHALLENGE_TYPES = ['Growth & Revenue', 'Brand & Marketing', 'Product & Innovation', 'Operations & Scaling', 'Market Entry', 'Customer Retention']
const BUDGETS = ['Under $20k', '$20k - $50k', '$50k - $100k', '$100k - $250k', '$250k+']
const TIMELINES = ['Under 4 weeks', '4-8 weeks', '8-12 weeks', '3-6 months', '6+ months (retained)']
const SOURCES = ['Referral from colleague', 'LinkedIn', 'Google search', 'Comcorpe event', 'Press / media', 'Other']

export default function ClientSettingsProfilePage() {
  const { user: currentUser } = useCurrentUser()
  const [name, setName] = useState(currentUser?.name ?? '')
  const [company, setCompany] = useState(currentUser?.company ?? '')
  const [industry, setIndustry] = useState(currentUser?.industry ?? '')
  const [companySize, setCompanySize] = useState(currentUser?.companySize ?? '')
  const [challenges, setChallenges] = useState<string[]>(currentUser?.challenges ?? [])
  const [budget, setBudget] = useState(currentUser?.budget ?? '')
  const [timeline, setTimeline] = useState(currentUser?.timeline ?? '')
  const [source, setSource] = useState(currentUser?.source ?? '')
  const [notes, setNotes] = useState(currentUser?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !currentUser) return
    setUploading(true)
    try {
      const storageRef = ref(storage, `avatars/${currentUser.id}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      await updateUserProfile(currentUser.id, { image: url })
    } catch (err) {
      console.error('Avatar upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const toggleChallenge = (challenge: string) => {
    setChallenges((current) =>
      current.includes(challenge)
        ? current.filter((item) => item !== challenge)
        : [...current, challenge]
    )
  }

  const handleSave = async () => {
    if (!currentUser) return
    setSaving(true)
    try {
      const computedInitials = name
        .split(' ')
        .filter(Boolean)
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 3)

      await updateUserProfile(currentUser.id, {
        name,
        company,
        initials: computedInitials,
        industry,
        companySize,
        challenges,
        budget,
        timeline,
        source,
        notes,
      })

    } catch (err) {
      console.error('Error saving profile changes:', err)
    } finally {
      setSaving(false)
    }
  }

  if (!currentUser) {
    return <p className="font-text text-sm text-muted-foreground">Loading profile...</p>
  }

  const hydratedFromUser = name.length > 0 || company.length > 0 || industry.length > 0 || companySize.length > 0 || challenges.length > 0 || budget.length > 0 || timeline.length > 0 || source.length > 0 || notes.length > 0

  if (!hydratedFromUser) {
    setName(currentUser.name)
    setCompany(currentUser.company ?? '')
    setIndustry(currentUser.industry ?? '')
    setCompanySize(currentUser.companySize ?? '')
    setChallenges(currentUser.challenges ?? [])
    setBudget(currentUser.budget ?? '')
    setTimeline(currentUser.timeline ?? '')
    setSource(currentUser.source ?? '')
    setNotes(currentUser.notes ?? '')
  }

  const inputClass = 'w-full px-4 py-3 border border-input bg-background font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'
  const pillClass = (selected: boolean) =>
    `px-3 py-2 border font-text text-sm transition-colors duration-100 ${
      selected
        ? 'bg-foreground text-background border-foreground'
        : 'bg-background text-foreground border-input hover:border-foreground'
    }`

  return (
    <div className="space-y-8">
      <section className="border border-border rounded-2xl p-6 bg-background">
        <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-2xl bg-foreground shrink-0 overflow-hidden relative group"
          >
            {currentUser.image ? (
              <Image src={currentUser.image} alt={currentUser.name} fill className="object-cover rounded-2xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display font-black text-[24px] text-background">
                {currentUser.initials}
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="font-text text-[11px] text-white">{uploading ? '...' : 'Upload'}</span>
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-2">Profile</p>
            <div className="space-y-4 max-w-xl">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Contact name</label>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Company</label>
                    <input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Industry</label>
                      <select className={inputClass} value={industry} onChange={(e) => setIndustry(e.target.value)}>
                        <option value="">Select industry</option>
                        {INDUSTRIES.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Company size</label>
                      <select className={inputClass} value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
                        <option value="">Select size</option>
                        {COMPANY_SIZES.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Challenges</label>
                    <div className="flex flex-wrap gap-2">
                      {CHALLENGE_TYPES.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleChallenge(option)}
                          className={pillClass(challenges.includes(option))}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Budget</label>
                      <select className={inputClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
                        <option value="">Select budget</option>
                        {BUDGETS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Timeline</label>
                      <select className={inputClass} value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                        <option value="">Select timeline</option>
                        {TIMELINES.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">How you found Comcorpe</label>
                    <select className={inputClass} value={source} onChange={(e) => setSource(e.target.value)}>
                      <option value="">Select source</option>
                      {SOURCES.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Notes</label>
                    <textarea
                      className={`${inputClass} resize-none`}
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Extra context, constraints, stakeholders, or goals"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-foreground text-background rounded-lg font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <span className="flex items-center gap-2 font-text text-sm text-muted-foreground">
                <Building2 size={14} strokeWidth={1.5} /> {currentUser.company || 'Company not set'}
              </span>
              <span className="flex items-center gap-2 font-text text-sm text-primary">
                <Mail size={14} strokeWidth={1.5} /> {currentUser.email}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
