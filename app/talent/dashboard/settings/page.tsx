'use client'
import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Pencil, Star, X, Zap } from 'lucide-react'
import { useCurrentUser, updateUserProfile } from '@/lib/user-client'
import { applications } from '@/lib/applications'

export default function TalentProfilePage() {
  const { user: currentUser } = useCurrentUser()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [bg, setBg] = useState('')
  const [desc, setDesc] = useState('')
  const [rate, setRate] = useState('')
  const [profileOverride, setProfileOverride] = useState<{
    name?: string
    talentRole?: string
    bg?: string
    desc?: string
    rate?: string
    initials?: string
  }>({})
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!currentUser) return
    setSaving(true)
    try {
      const computedInitials = name
        .split(' ')
        .filter(Boolean)
        .map(n => n.charAt(0))
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
      })

      setProfileOverride({ name, talentRole: role, bg, desc, rate, initials: computedInitials })
      setEditing(false)
    } catch (err) {
      console.error('Error saving profile changes:', err)
    } finally {
      setSaving(false)
    }
  }

  const submittedCount = applications.length
  const activeCount = applications.filter(a => a.status.toLowerCase() === 'active').length

  const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'

  if (!currentUser) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[860px] mx-auto">
        <p className="font-text text-sm text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  const handleEditToggle = () => {
    if (editing) {
      setEditing(false)
      return
    }
    setName(profileOverride.name ?? currentUser.name)
    setRole(profileOverride.talentRole ?? currentUser.talentRole ?? '')
    setBg(profileOverride.bg ?? currentUser.bg ?? '')
    setDesc(profileOverride.desc ?? currentUser.desc ?? '')
    setRate(profileOverride.rate ?? currentUser.rate ?? '')
    setEditing(true)
  }

  const profile = {
    ...currentUser,
    ...profileOverride,
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1024px] mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-1">Settings</p>
          <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">
            Account Settings
          </h1>
        </div>
        <button
          onClick={handleEditToggle}
          className="flex items-center gap-2 px-4 py-2 border border-input font-text text-sm text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-100"
        >
          {editing ? <X size={14} strokeWidth={1.5} /> : <Pencil size={14} strokeWidth={1.5} />}
          {editing ? 'Cancel' : 'Edit profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 items-start">
        {/* Left Side Settings Nav */}
        <nav className="flex flex-col gap-1 border-r border-border pr-6 min-h-[250px]">
          {[
            { label: 'General', active: true },
            { label: 'Security', active: false },
            { label: 'Billing & Invoices', active: false },
            { label: 'Notifications', active: false },
          ].map(item => (
            <button
              key={item.label}
              disabled={!item.active}
              className={`text-left px-3 py-2 font-text text-sm font-semibold transition-all duration-100 ${
                item.active
                  ? 'bg-foreground text-background border-l-2 border-primary pl-4'
                  : 'text-muted-foreground/50 hover:text-foreground cursor-not-allowed'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Main Content */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 bg-foreground shrink-0 overflow-hidden relative">
                {profile && profile.image ? (
                  <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display font-black text-[24px] text-background">
                    {profile ? profile.initials : 'U'}
                  </div>
                )}
              </div>
              {profile && profile.featured && (
                <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-eyebrow text-primary border border-primary/20 px-2 py-0.5 bg-primary/5">
                  <Star size={10} strokeWidth={2} />
                  Featured
                </div>
              )}
            </div>

            <div className="space-y-5">
              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Name</label>
                      <input className={I} value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Rate</label>
                      <input className={I} value={rate} onChange={e => setRate(e.target.value)} placeholder="$120 - $180/hr" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Role / Title</label>
                    <input className={I} value={role} onChange={e => setRole(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Background</label>
                    <input className={I} value={bg} onChange={e => setBg(e.target.value)} placeholder="Formerly at..." />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">Bio</label>
                    <textarea className={`${I} resize-none`} rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                  <p className="font-mono text-[10px] text-muted-foreground/70">Changes are saved directly in Firebase Firestore.</p>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground">{profile.name}</h2>
                    <p className="font-text text-sm text-primary font-semibold mt-0.5">{profile.talentRole}</p>
                    <p className="font-text text-sm text-muted-foreground mt-0.5">{profile.bg}</p>
                    <p className="font-mono text-xs text-primary mt-1.5">{currentUser.email}</p>
                  </div>
              {profile.desc && (
                <p className="font-text text-sm text-muted-foreground leading-relaxed max-w-[48ch]">{profile.desc}</p>
              )}
              <div className="flex flex-wrap gap-3">
                {profile.rate && (
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground border border-input px-3 py-1.5">
                    <Zap size={11} strokeWidth={1.5} className="text-primary" />
                    {profile.rate}
                  </div>
                )}
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground border border-input px-3 py-1.5">
                  <MapPin size={11} strokeWidth={1.5} className="text-primary" />
                  Remote / Africa
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 border border-border">
        {[
          { label: 'Applications', value: submittedCount },
          { label: 'Active now', value: activeCount },
          { label: 'CC Credits', value: currentUser.credits ?? 3 },
        ].map((stat, i) => (
          <div key={stat.label} className={`px-6 py-5 ${i > 0 ? 'border-l border-border' : ''}`}>
            <p className="font-display font-black text-[28px] text-foreground leading-none">{stat.value}</p>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="font-display font-black text-[18px] tracking-[-0.02em] text-foreground mb-4">Applications</h3>
        <div className="border border-border divide-y divide-border">
          {applications.map(app => (
            <div key={app.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-text text-sm font-semibold text-foreground truncate">{app.role}</p>
                <p className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{app.client} · {app.date}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 bg-border text-muted-foreground">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
        </div> {/* closes right main content <div className="space-y-6"> */}
      </div> {/* closes grid <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] ..."> */}
    </div>
  )
}
