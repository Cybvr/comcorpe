'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  MapPin, Pencil, Star, X, Zap,
  Search, ShieldCheck, Check, CreditCard,
} from 'lucide-react'
import { useCurrentUser, updateUserProfile, getClientUser, OMICON_AGENCIES } from '@/lib/user'
import { applications } from '@/lib/applications'
import { payouts, ccreditsBalance, type PayoutStatus } from '@/lib/payouts'
import { useJobs } from '@/lib/jobs'
import { getPodBySlug } from '@/lib/pods'

const statusStyles: Record<PayoutStatus, string> = {
  Cleared:    'bg-green-50 text-green-700 border-green-200',
  Pending:    'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-primary/10 text-primary border-primary/20',
}

type Section = 'profile' | 'payments' | 'network'

const NAV: { id: Section; label: string }[] = [
  { id: 'profile',  label: 'General' },
  { id: 'payments', label: 'Payments' },
  { id: 'network',  label: 'Network' },
]

const I = 'w-full px-4 py-3 border border-input bg-white font-text text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground transition-colors duration-100'

export default function TalentSettingsPage() {
  const { user: currentUser } = useCurrentUser()
  const { jobs } = useJobs()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as Section | null
  const [activeSection, setActiveSection] = useState<Section>(
    tabParam && ['profile', 'payments', 'network'].includes(tabParam) ? tabParam : 'profile'
  )

  // ── Profile ────────────────────────────────────────────────
  const [editing, setEditing] = useState(false)
  const [name, setName]     = useState('')
  const [role, setRole]     = useState('')
  const [bg, setBg]         = useState('')
  const [desc, setDesc]     = useState('')
  const [rate, setRate]     = useState('')
  const [saving, setSaving] = useState(false)

  // ── Payments ───────────────────────────────────────────────
  const [payoutSearch, setPayoutSearch] = useState('')

  // ── Network ────────────────────────────────────────────────
  const [affiliations, setAffiliations]     = useState<string[]>([])
  const [networkSaving, setNetworkSaving]   = useState(false)
  const [networkSaved, setNetworkSaved]     = useState(false)

  // Sync affiliations from live user profile (but not while editing)
  useEffect(() => {
    if (currentUser?.networkAffiliations) {
      setAffiliations(currentUser.networkAffiliations)
    }
  }, [currentUser?.networkAffiliations])

  if (!currentUser) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[860px] mx-auto">
        <p className="font-text text-sm text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  // ── Profile handlers ───────────────────────────────────────
  const handleEditToggle = () => {
    if (editing) { setEditing(false); return }
    setName(currentUser.name)
    setRole(currentUser.talentRole ?? '')
    setBg(currentUser.bg ?? '')
    setDesc(currentUser.desc ?? '')
    setRate(currentUser.rate ?? '')
    setEditing(true)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const computedInitials = name.split(' ').filter(Boolean)
        .map(n => n.charAt(0)).join('').toUpperCase().slice(0, 3)
      await updateUserProfile(currentUser.id, {
        name, talentRole: role, bg, desc, rate, initials: computedInitials,
      })
      setEditing(false)
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  // ── Network handlers ───────────────────────────────────────
  const toggleAffiliation = (agency: string) => {
    setAffiliations(prev =>
      prev.includes(agency) ? prev.filter(a => a !== agency) : [...prev, agency]
    )
    setNetworkSaved(false)
  }

  const handleSaveNetwork = async () => {
    setNetworkSaving(true)
    try {
      await updateUserProfile(currentUser.id, { networkAffiliations: affiliations })
      setNetworkSaved(true)
      setTimeout(() => setNetworkSaved(false), 2500)
    } catch (err) { console.error(err) }
    finally { setNetworkSaving(false) }
  }

  // ── Payments data ──────────────────────────────────────────
  const pendingTotal  = payouts.filter(p => p.status === 'Pending' || p.status === 'Processing').reduce((a, p) => a + p.amountRaw, 0)
  const clearedTotal  = payouts.filter(p => p.status === 'Cleared').reduce((a, p) => a + p.amountRaw, 0)
  const nextPayout    = payouts.filter(p => p.status === 'Pending').sort((a, b) => a.id - b.id)[0]
  const filteredPayouts = payouts.filter(p =>
    p.label.toLowerCase().includes(payoutSearch.toLowerCase()) ||
    getClientUser(p.clientId).name.toLowerCase().includes(payoutSearch.toLowerCase()) ||
    p.status.toLowerCase().includes(payoutSearch.toLowerCase())
  )

  const submittedCount = applications.length
  const activeCount    = applications.filter(a => a.status.toLowerCase() === 'active').length
  const isVerified     = (currentUser.networkAffiliations ?? []).length > 0

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1024px] mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-1">Settings</p>
          <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">
            Account Settings
          </h1>
        </div>
        {activeSection === 'profile' && (
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 px-4 py-2 border border-input font-text text-sm text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-100"
          >
            {editing ? <X size={14} strokeWidth={1.5} /> : <Pencil size={14} strokeWidth={1.5} />}
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 items-start">
        {/* Left nav */}
        <nav className="flex flex-col gap-1 border-r border-border pr-6">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setEditing(false) }}
              className={`text-left px-3 py-2 font-text text-sm font-semibold transition-all duration-100 ${
                activeSection === item.id
                  ? 'bg-foreground text-background border-l-2 border-primary pl-4'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right content */}
        <div>

          {/* ── PROFILE ─────────────────────────────────────── */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-foreground shrink-0 overflow-hidden relative">
                    {currentUser.image ? (
                      <Image src={currentUser.image} alt={currentUser.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display font-black text-[24px] text-background">
                        {currentUser.initials}
                      </div>
                    )}
                  </div>
                  {currentUser.featured && (
                    <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-eyebrow text-primary border border-primary/20 px-2 py-0.5 bg-primary/5">
                      <Star size={10} strokeWidth={2} /> Featured
                    </div>
                  )}
                  {isVerified && (
                    <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-eyebrow text-green-700 border border-green-200 px-2 py-0.5 bg-green-50">
                      <ShieldCheck size={10} strokeWidth={2} /> Network
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
                      <button onClick={handleSaveProfile} disabled={saving}
                        className="px-6 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save changes'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground">{currentUser.name}</h2>
                        <p className="font-text text-sm text-primary font-semibold mt-0.5">{currentUser.talentRole}</p>
                        <p className="font-text text-sm text-muted-foreground mt-0.5">{currentUser.bg}</p>
                        <p className="font-mono text-xs text-primary mt-1.5">{currentUser.email}</p>
                      </div>
                      {currentUser.desc && (
                        <p className="font-text text-sm text-muted-foreground leading-relaxed max-w-[48ch]">{currentUser.desc}</p>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {currentUser.rate && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground border border-input px-3 py-1.5">
                            <Zap size={11} strokeWidth={1.5} className="text-primary" /> {currentUser.rate}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground border border-input px-3 py-1.5">
                          <MapPin size={11} strokeWidth={1.5} className="text-primary" /> Remote / Africa
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-3 border border-border">
                {[
                  { label: 'Applications', value: submittedCount },
                  { label: 'Active now',   value: activeCount },
                  { label: 'CC Credits',   value: currentUser.credits ?? 3 },
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
            </div>
          )}

          {/* ── PAYMENTS ────────────────────────────────────── */}
          {activeSection === 'payments' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-foreground text-background rounded-2xl p-6">
                  <p className="font-mono text-[10px] uppercase tracking-eyebrow text-background/40 mb-3">CCredits</p>
                  <p className="font-display font-black text-[48px] tracking-[-0.03em] leading-none">{ccreditsBalance}</p>
                  <p className="font-text text-sm text-background/50 mt-4">Apply to priority briefs</p>
                </div>
                <div className="border border-border rounded-2xl p-6 bg-background">
                  <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Pending</p>
                  <p className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">${pendingTotal.toLocaleString()}</p>
                  <p className="font-text text-sm text-muted-foreground mt-4">{payouts.filter(p => p.status === 'Pending' || p.status === 'Processing').length} in flight</p>
                </div>
                <div className="border border-border rounded-2xl p-6 bg-background">
                  <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Cleared</p>
                  <p className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">${clearedTotal.toLocaleString()}</p>
                  <p className="font-text text-sm text-muted-foreground mt-4">{payouts.filter(p => p.status === 'Cleared').length} payouts received</p>
                </div>
                <div className={`border rounded-2xl p-6 bg-background ${nextPayout ? 'border-amber-200' : 'border-border'}`}>
                  <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Next payout</p>
                  {nextPayout ? (
                    <>
                      <p className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">{nextPayout.amount}</p>
                      <p className="font-text text-sm text-amber-600 mt-4">{nextPayout.date} · {getClientUser(nextPayout.clientId).name}</p>
                    </>
                  ) : (
                    <p className="font-display font-black text-[28px] tracking-[-0.03em] text-muted-foreground/70 leading-none">Nothing due</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                  <input
                    type="text"
                    placeholder="Filter payouts..."
                    value={payoutSearch}
                    onChange={e => setPayoutSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl font-text text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
                <button className="px-4 py-2.5 border border-border rounded-xl font-text text-sm font-semibold hover:bg-muted transition-colors">
                  Export CSV
                </button>
              </div>

              <div className="border border-border rounded-2xl overflow-hidden bg-background">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Status</th>
                      <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Milestone</th>
                      <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Client</th>
                      <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Pod</th>
                      <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 text-right">Amount</th>
                      <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPayouts.map(payout => {
                      const job = jobs.find(j => j.slug === payout.jobSlug)
                      const pod = job?.podSlug ? getPodBySlug(job.podSlug) : null
                      return (
                        <tr key={payout.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[payout.status]}`}>
                              {payout.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 max-w-[260px]">
                            <p className="font-text text-sm font-semibold text-foreground leading-tight truncate">{payout.label}</p>
                          </td>
                          <td className="px-5 py-4">
                            {job ? (
                              <Link href={`/talent/dashboard/jobs/${job.slug}`} className="font-text text-sm text-primary hover:underline">
                                {getClientUser(payout.clientId).name}
                              </Link>
                            ) : (
                              <span className="font-text text-sm text-muted-foreground">{getClientUser(payout.clientId).name}</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {pod ? (
                              <Link href={`/talent/dashboard/search/${pod.slug}`} className="font-text text-sm text-primary hover:underline">
                                {pod.name}
                              </Link>
                            ) : <span className="font-text text-sm text-muted-foreground/70">—</span>}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="font-mono text-sm font-bold text-foreground">{payout.amount}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-text text-xs text-muted-foreground">{payout.date}</span>
                          </td>
                        </tr>
                      )
                    })}
                    {filteredPayouts.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-12 text-center font-text text-sm text-muted-foreground/70">No payouts match your search.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── NETWORK ─────────────────────────────────────── */}
          {activeSection === 'network' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">Network Affiliations</h2>
                <p className="font-text text-sm text-muted-foreground max-w-[52ch]">
                  Select any Omicon agencies you're affiliated with. This is optional — not a requirement. Affiliations show a verified badge on your profile visible to clients.
                </p>
              </div>

              {/* Verified preview */}
              {affiliations.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg w-fit">
                  <ShieldCheck size={14} className="text-green-600" strokeWidth={2} />
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-green-700 font-bold">Verified Network Member</span>
                  <span className="font-text text-[11px] text-green-600">· {affiliations.length} affiliation{affiliations.length !== 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Agency grid */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Omicon Agencies</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {OMICON_AGENCIES.map(agency => {
                    const checked = affiliations.includes(agency)
                    return (
                      <button
                        key={agency}
                        type="button"
                        onClick={() => toggleAffiliation(agency)}
                        className={`flex items-center gap-3 px-4 py-3 border text-left rounded-lg transition-all ${
                          checked
                            ? 'border-green-300 bg-green-50 text-green-800'
                            : 'border-border bg-background text-foreground hover:border-input'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                          checked ? 'bg-green-600 border-green-600' : 'border-input'
                        }`}>
                          {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="font-text text-sm font-semibold">{agency}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={handleSaveNetwork}
                  disabled={networkSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 disabled:opacity-50"
                >
                  {networkSaving ? 'Saving...' : networkSaved ? <><Check size={14} /> Saved</> : 'Save affiliations'}
                </button>
                {affiliations.length > 0 && (
                  <button
                    onClick={() => { setAffiliations([]); setNetworkSaved(false) }}
                    className="font-text text-sm text-muted-foreground/70 hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-2">How it works</p>
                <ul className="space-y-2">
                  {[
                    'Affiliations are self-reported and not independently verified by Comcorpe.',
                    'A green "Verified Network" bar appears on your card in client search results.',
                    'Clients may filter by network affiliation when building pods.',
                    'You can update or remove affiliations at any time.',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 font-text text-sm text-muted-foreground">
                      <div className="w-1 h-1 bg-green-400 rounded-full mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
