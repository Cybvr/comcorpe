'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Star, Check, ShieldCheck } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useCurrentUser, updateUserProfile, OMNICOM_AFFILIATES } from '@/lib/user'
import { storage } from '@/lib/firebase'
import NetworkAffiliateBadge from '@/components/dashboard/NetworkAffiliateBadge'

const LOCATIONS = ['Lagos', 'London', 'Nairobi', 'Accra', 'Cape Town', 'New York', 'Remote only', 'Other']
const AVAILABILITY = ['Full-time (5 days/wk)', 'Part-time (2-3 days/wk)', 'Project-based only', 'Advisory (a few hrs/mo)']
const EXPERIENCE = ['2-4 years', '5-8 years', '9-14 years', '15+ years']
const SOURCES = ['Referral', 'LinkedIn', 'Comcorpe event', 'Press / media', 'Other']

const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'

export default function TalentSettingsProfilePage() {
  const { user: currentUser } = useCurrentUser()
  const [name, setName] = useState(currentUser?.name ?? '')
  const [role, setRole] = useState(currentUser?.talentRole ?? '')
  const [bg, setBg] = useState(currentUser?.bg ?? '')
  const [desc, setDesc] = useState(currentUser?.desc ?? '')
  const [rate, setRate] = useState(currentUser?.rate ?? '')
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedinUrl ?? '')
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser?.portfolioUrl ?? '')
  const [disciplines, setDisciplines] = useState(currentUser?.disciplines?.join(', ') ?? '')
  const [location, setLocation] = useState(currentUser?.location ?? '')
  const [yearsExp, setYearsExp] = useState(currentUser?.yearsExp ?? '')
  const [availability, setAvailability] = useState(currentUser?.availability ?? '')
  const [source, setSource] = useState(currentUser?.source ?? '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [affiliations, setAffiliations] = useState<string[]>(currentUser?.networkAffiliations ?? [])
  const [networkSaving, setNetworkSaving] = useState(false)
  const [networkSaved, setNetworkSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (currentUser?.networkAffiliations) setAffiliations(currentUser.networkAffiliations)
  }, [currentUser?.networkAffiliations])

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

  if (!currentUser) {
    return <p className="font-text text-sm text-muted-foreground">Loading profile...</p>
  }

  const isVerified = (currentUser.networkAffiliations ?? []).length > 0

  const hydratedFromUser =
    name.length > 0 || role.length > 0 || bg.length > 0 || desc.length > 0 || rate.length > 0 ||
    linkedinUrl.length > 0 || portfolioUrl.length > 0 || disciplines.length > 0 || location.length > 0 ||
    yearsExp.length > 0 || availability.length > 0 || source.length > 0

  if (!hydratedFromUser) {
    setName(currentUser.name)
    setRole(currentUser.talentRole ?? '')
    setBg(currentUser.bg ?? '')
    setDesc(currentUser.desc ?? '')
    setRate(currentUser.rate ?? '')
    setLinkedinUrl(currentUser.linkedinUrl ?? '')
    setPortfolioUrl(currentUser.portfolioUrl ?? '')
    setDisciplines(currentUser.disciplines?.join(', ') ?? '')
    setLocation(currentUser.location ?? '')
    setYearsExp(currentUser.yearsExp ?? '')
    setAvailability(currentUser.availability ?? '')
    setSource(currentUser.source ?? '')
  }

  const handleSaveNetwork = async () => {
    if (!currentUser) return
    setNetworkSaving(true)
    try {
      await updateUserProfile(currentUser.id, { networkAffiliations: affiliations })
      setNetworkSaved(true)
      setTimeout(() => setNetworkSaved(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setNetworkSaving(false)
    }
  }

  const handleSaveProfile = async () => {
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
        talentRole: role,
        bg,
        desc,
        rate,
        initials: computedInitials,
        linkedinUrl,
        portfolioUrl,
        disciplines: disciplines.split(',').map((d) => d.trim()).filter(Boolean),
        location,
        yearsExp,
        availability,
        source,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-20 h-20 bg-foreground shrink-0 overflow-hidden relative group"
            >
              {currentUser.image ? (
                <Image src={currentUser.image} alt={currentUser.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display font-black text-[24px] text-background">
                  {currentUser.initials}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="font-text text-[11px] text-white">{uploading ? '...' : 'Upload'}</span>
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            {currentUser.featured && (
              <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-eyebrow text-primary border border-primary/20 px-2 py-0.5 bg-primary/5">
                <Star size={10} strokeWidth={2} /> Featured
              </div>
            )}
            {isVerified && currentUser.networkAffiliations && (
              <NetworkAffiliateBadge affiliations={currentUser.networkAffiliations} size={14} />
            )}
          </div>

          <div className="space-y-5">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Name</label>
                    <input className={I} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Rate</label>
                    <input className={I} value={rate} onChange={(e) => setRate(e.target.value)} placeholder="$120 - $180/hr" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Location</label>
                    <select className={I} value={location} onChange={(e) => setLocation(e.target.value)}>
                      <option value="">Select location</option>
                      {LOCATIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Experience</label>
                    <select className={I} value={yearsExp} onChange={(e) => setYearsExp(e.target.value)}>
                      <option value="">Select experience</option>
                      {EXPERIENCE.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Availability</label>
                    <select className={I} value={availability} onChange={(e) => setAvailability(e.target.value)}>
                      <option value="">Select availability</option>
                      {AVAILABILITY.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Role / Title</label>
                  <input className={I} value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Background</label>
                  <input className={I} value={bg} onChange={(e) => setBg(e.target.value)} placeholder="Formerly at..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">LinkedIn URL</label>
                    <input className={I} value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Portfolio / Website</label>
                    <input className={I} value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Core Competencies (comma separated)</label>
                  <input className={I} value={disciplines} onChange={(e) => setDisciplines(e.target.value)} placeholder="Strategic GTM Planning, Revenue Operations" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">How you found Comcorpe</label>
                  <select className={I} value={source} onChange={(e) => setSource(e.target.value)}>
                    <option value="">Select source</option>
                    {SOURCES.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Bio</label>
                  <textarea className={`${I} resize-none`} rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 space-y-5">
          <div>
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground mb-1">Network affiliations</p>
            <p className="font-text text-sm text-muted-foreground">Omnicom agencies you're affiliated with. Shows a verified badge on your public profile.</p>
          </div>

          {affiliations.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg w-fit">
              <ShieldCheck size={13} className="text-green-600" strokeWidth={2} />
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-green-700 font-bold">Verified · {affiliations.length} affiliation{affiliations.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {OMNICOM_AFFILIATES.map((agency) => {
              const checked = affiliations.includes(agency.label)
              return (
                <button
                  key={agency.slug}
                  type="button"
                  onClick={() => setAffiliations((prev) => checked ? prev.filter((a) => a !== agency.label) : [...prev, agency.label])}
                  className={`flex items-center gap-3 px-4 py-3 border text-left rounded-lg transition-all ${
                    checked ? 'border-green-300 bg-green-50 text-green-800' : 'border-border bg-background text-foreground hover:border-input'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                    checked ? 'bg-green-600 border-green-600' : 'border-input'
                  }`}>
                    {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="font-text text-sm font-semibold">{agency.label}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveNetwork}
              disabled={networkSaving}
              className="px-6 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-50"
            >
              {networkSaving ? 'Saving...' : networkSaved ? 'Saved' : 'Save affiliations'}
            </button>
            {affiliations.length > 0 && (
              <button onClick={() => setAffiliations([])} className="font-text text-sm text-muted-foreground/70 hover:text-foreground transition-colors">
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
  )
}
