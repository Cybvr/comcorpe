'use client'
import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Pencil, Star, X, Zap } from 'lucide-react'
import { currentUser, users } from '@/lib/user'
import { applications } from '@/lib/applications'

// Use the first featured talent as the "logged-in" talent profile
const profile = users.find(u => u.role === 'talent' && u.featured) ?? users.find(u => u.role === 'talent') ?? currentUser

export default function TalentProfilePage() {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const [role, setRole] = useState(profile.talentRole ?? '')
  const [bg, setBg] = useState(profile.bg ?? '')
  const [desc, setDesc] = useState(profile.desc ?? '')
  const [rate, setRate] = useState(profile.rate ?? '')

  const submittedCount = applications.length
  const activeCount = applications.filter(a => a.status.toLowerCase() === 'active').length

  const I = 'w-full px-4 py-3 border border-ink-20 bg-white font-text text-sm text-ink placeholder:text-ink-40 focus:outline-none focus:border-ink transition-colors duration-100'

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[860px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-1">Profile</p>
          <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-ink leading-tight">
            My profile
          </h1>
        </div>
        <button
          onClick={() => setEditing(e => !e)}
          className="flex items-center gap-2 px-4 py-2 border border-ink-20 font-text text-sm text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-100"
        >
          {editing ? <X size={14} strokeWidth={1.5} /> : <Pencil size={14} strokeWidth={1.5} />}
          {editing ? 'Cancel' : 'Edit profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-ink shrink-0 overflow-hidden relative">
            {profile.image ? (
              <Image src={profile.image} alt={profile.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display font-black text-[24px] text-paper">
                {profile.initials}
              </div>
            )}
          </div>
          {profile.featured && (
            <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-eyebrow text-blue border border-blue/20 px-2 py-0.5 bg-blue/5">
              <Star size={10} strokeWidth={2} />
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-60">Name</label>
                  <input className={I} value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-60">Rate</label>
                  <input className={I} value={rate} onChange={e => setRate(e.target.value)} placeholder="$12k - $18k/mo" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-60">Role / Title</label>
                <input className={I} value={role} onChange={e => setRole(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-60">Background</label>
                <input className={I} value={bg} onChange={e => setBg(e.target.value)} placeholder="Formerly at…" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] tracking-eyebrow uppercase text-ink-60">Bio</label>
                <textarea className={`${I} resize-none`} rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
              </div>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 bg-ink text-paper font-text text-sm font-semibold hover:bg-blue transition-colors duration-100"
              >
                Save changes
              </button>
              <p className="font-mono text-[10px] text-ink-40">Changes are saved locally in this browser.</p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-ink">{name}</h2>
                <p className="font-text text-sm text-blue font-semibold mt-0.5">{role}</p>
                <p className="font-text text-sm text-ink-60 mt-0.5">{bg}</p>
              </div>
              {desc && (
                <p className="font-text text-sm text-ink-60 leading-relaxed max-w-[48ch]">{desc}</p>
              )}
              <div className="flex flex-wrap gap-3">
                {rate && (
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-60 border border-ink-20 px-3 py-1.5">
                    <Zap size={11} strokeWidth={1.5} className="text-blue" />
                    {rate}
                  </div>
                )}
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-60 border border-ink-20 px-3 py-1.5">
                  <MapPin size={11} strokeWidth={1.5} className="text-blue" />
                  Remote / Africa
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-3 border border-ink-10">
        {[
          { label: 'Applications', value: submittedCount },
          { label: 'Active now', value: activeCount },
          { label: 'CC Credits', value: currentUser.credits ?? 3 },
        ].map((stat, i) => (
          <div key={stat.label} className={`px-6 py-5 ${i > 0 ? 'border-l border-ink-10' : ''}`}>
            <p className="font-display font-black text-[28px] text-ink leading-none">{stat.value}</p>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Applications */}
      <div className="mt-10">
        <h3 className="font-display font-black text-[18px] tracking-[-0.02em] text-ink mb-4">Applications</h3>
        <div className="border border-ink-10 divide-y divide-ink-10">
          {applications.map(app => (
            <div key={app.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-text text-sm font-semibold text-ink truncate">{app.role}</p>
                <p className="font-mono text-[10px] text-ink-40 mt-0.5">{app.client} · {app.date}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] tracking-eyebrow uppercase px-2 py-0.5 bg-ink-10 text-ink-60">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
