'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  getLeadership,
  createLeadership,
  updateLeadership,
  deleteLeadership,
  getAdvisors,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor,
} from '@/lib/admin/store'
import type { LeadershipMember, AdvisorMember } from '@/lib/people'
import { leadership as leadershipSeed, advisors as advisorsSeed } from '@/lib/people'
import { Plus, Search, Trash2, Edit2, Shield, Users, MapPin, Sparkles, Check, AlertCircle } from 'lucide-react'

type PersonType = 'leadership' | 'advisor'

interface PersonItem {
  id: string
  name: string
  title: string
  bio: string
  linkedin: string
  type: PersonType
  tags?: string[]
  geo?: string
  fullBio?: string
}

export default function PeopleAdminPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Lists
  const [people, setPeople] = useState<PersonItem[]>([])
  const [filteredPeople, setFilteredPeople] = useState<PersonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'leadership' | 'advisor'>('all')

  // Form State
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [formType, setFormType] = useState<PersonType>('leadership')
  const [formName, setFormName] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formBio, setFormBio] = useState('')
  const [formLinkedin, setFormLinkedin] = useState('')
  // Leadership extra
  const [formTags, setFormTags] = useState('')
  // Advisor extra
  const [formGeo, setFormGeo] = useState('')
  const [formFullBio, setFormFullBio] = useState('')

  // Load Data
  const loadPeople = async () => {
    setLoading(true)
    try {
      const [lList, aList] = await Promise.all([
        getLeadership(),
        getAdvisors(),
      ])

      // Format combined list
      const combined: PersonItem[] = [
        ...lList.map(m => ({ ...m, id: m.id || m.name.toLowerCase().replace(/\s+/g, '-'), type: 'leadership' as PersonType })),
        ...aList.map(m => ({ ...m, id: m.id || m.name.toLowerCase().replace(/\s+/g, '-'), type: 'advisor' as PersonType })),
      ]

      setPeople(combined)
    } catch (err) {
      console.error('Error fetching people list:', err)
      showMsg('Failed to fetch people from database.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPeople()
  }, [])

  // Auto load query params e.g. for "?new=true" from overview page
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      resetForm()
      // Scroll to form
      const el = document.getElementById('people-form-container')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [searchParams])

  // Filter People on change
  useEffect(() => {
    let result = people

    // Tab filter
    if (activeTab !== 'all') {
      result = result.filter(p => p.type === activeTab)
    }

    // Search filter
    if (search.trim() !== '') {
      const query = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.bio.toLowerCase().includes(query)
      )
    }

    setFilteredPeople(result)
  }, [people, search, activeTab])

  // Helpers
  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditId(null)
    setFormName('')
    setFormTitle('')
    setFormBio('')
    setFormLinkedin('#')
    setFormTags('')
    setFormGeo('')
    setFormFullBio('')
  }

  // Load person into form for editing
  const handleEditInit = (person: PersonItem) => {
    setIsEditing(true)
    setEditId(person.id)
    setFormType(person.type)
    setFormName(person.name)
    setFormTitle(person.title)
    setFormBio(person.bio)
    setFormLinkedin(person.linkedin || '#')
    
    if (person.type === 'leadership') {
      setFormTags(person.tags?.join(', ') || '')
      setFormGeo('')
      setFormFullBio('')
    } else {
      setFormGeo(person.geo || '')
      setFormFullBio(person.fullBio || '')
      setFormTags('')
    }

    // Scroll to form on small screens
    const el = document.getElementById('people-form-container')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formTitle.trim() || !formBio.trim()) {
      showMsg('Please fill in all core fields (Name, Title, Bio).', 'error')
      return
    }

    setActionLoading(true)
    try {
      if (formType === 'leadership') {
        const payload = {
          name: formName.trim(),
          title: formTitle.trim(),
          bio: formBio.trim(),
          linkedin: formLinkedin.trim(),
          tags: formTags.split(',').map(t => t.trim().toUpperCase()).filter(t => t !== ''),
        }

        if (isEditing && editId) {
          await updateLeadership(editId, payload)
          showMsg(`Leadership "${formName}" updated successfully!`, 'success')
        } else {
          await createLeadership(payload)
          showMsg(`Leadership "${formName}" added successfully!`, 'success')
        }
      } else {
        const payload = {
          name: formName.trim(),
          title: formTitle.trim(),
          bio: formBio.trim(),
          fullBio: formFullBio.trim() || formBio.trim(),
          geo: formGeo.trim() || 'Lagos',
          linkedin: formLinkedin.trim(),
        }

        if (isEditing && editId) {
          await updateAdvisor(editId, payload)
          showMsg(`Advisor "${formName}" updated successfully!`, 'success')
        } else {
          await createAdvisor(payload)
          showMsg(`Advisor "${formName}" added successfully!`, 'success')
        }
      }

      resetForm()
      await loadPeople()
    } catch (err) {
      console.error('Error saving person:', err)
      showMsg('An error occurred while saving to database.', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle Deletion
  const handleDelete = async (person: PersonItem) => {
    if (!confirm(`Are you absolutely sure you want to delete ${person.name} from ${person.type}?`)) {
      return
    }

    setActionLoading(true)
    try {
      if (person.type === 'leadership') {
        await deleteLeadership(person.id)
      } else {
        await deleteAdvisor(person.id)
      }
      showMsg(`Successfully deleted ${person.name}.`, 'success')
      
      // If we deleted the person currently being edited, reset form
      if (editId === person.id) {
        resetForm()
      }

      await loadPeople()
    } catch (err) {
      console.error('Error deleting person:', err)
      showMsg('Failed to delete person from Firestore.', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Dynamic Seeding Helper
  const handleSeedFallback = async () => {
    setActionLoading(true)
    try {
      let seedCount = 0
      
      // Seed Leadership
      for (const member of leadershipSeed) {
        const cleanTags = member.tags || []
        await createLeadership({
          name: member.name,
          title: member.title,
          bio: member.bio,
          linkedin: member.linkedin || '#',
          tags: cleanTags,
        })
        seedCount++
      }

      // Seed Advisors
      for (const adv of advisorsSeed) {
        await createAdvisor({
          name: adv.name,
          title: adv.title,
          bio: adv.bio,
          fullBio: adv.fullBio || adv.bio,
          geo: adv.geo || 'Global',
          linkedin: adv.linkedin || '#',
        })
        seedCount++
      }

      showMsg(`Successfully seeded ${seedCount} records into Firestore!`, 'success')
      await loadPeople()
    } catch (err) {
      console.error('Error seeding fallbacks:', err)
      showMsg('Seeding failed. Try again.', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Check if actual Firestore collection holds zero documents
  const isFirestoreEmpty = people.length === 0 && !loading

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-[32px] tracking-hero text-foreground leading-tight">People Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, view, update and delete board leadership and advisors in Firestore.</p>
        </div>
        <button
          onClick={resetForm}
          className="self-start md:self-auto font-text text-[13px] font-semibold px-4 py-2.5 bg-primary text-white hover:bg-primary/85 transition-colors duration-[120ms] inline-flex items-center gap-1.5 rounded-sm"
        >
          <Plus size={14} />
          New Leader/Advisor
        </button>
      </div>

      {/* Seeding Banner for empty state */}
      {isFirestoreEmpty && (
        <div className="border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 text-primary shrink-0 mt-0.5 sm:mt-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-display text-base tracking-h3 text-foreground font-black">No dynamic records in Firestore</h3>
              <p className="text-sm text-muted-foreground mt-0.5">We detected that the Firestore database is empty. Would you like to seed the initial team records from our local backup?</p>
            </div>
          </div>
          <button
            onClick={handleSeedFallback}
            disabled={actionLoading}
            className="shrink-0 font-text text-[12px] font-bold px-4 py-2 bg-primary text-white hover:bg-primary/85 disabled:opacity-50 transition-colors rounded-sm"
          >
            {actionLoading ? 'Seeding...' : 'Seed Initial Data'}
          </button>
        </div>
      )}

      {/* Message Notifications */}
      {message && (
        <div className={`border p-4 flex items-center gap-3 transition-all duration-300 rounded-sm
          ${message.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}
        >
          {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span className="font-text text-sm font-semibold">{message.text}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
        
        {/* Left Side: Filter and Listing Workspace */}
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Tabs */}
            <div className="flex bg-border p-1 rounded-sm border border-border">
              {[
                { id: 'all', label: 'All Members', icon: Users },
                { id: 'leadership', label: 'Founding Team', icon: Shield },
                { id: 'advisor', label: 'Advisors', icon: MapPin },
              ].map(tab => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 font-text text-xs font-semibold transition-colors duration-[120ms] border-0 cursor-pointer rounded-sm
                      ${active ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground bg-transparent'}`}
                  >
                    <Icon size={12} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/60">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people by name or title..."
                className="w-full bg-background border border-border pl-9 pr-4 py-2 font-text text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground rounded-sm"
              />
            </div>
          </div>

          {/* List Loader / Empty State */}
          {loading ? (
            <div className="border border-border p-12 text-center text-muted-foreground space-y-4">
              <div className="w-8 h-8 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
              <p className="font-mono text-xs tracking-widest uppercase">Fetching people list from Firestore...</p>
            </div>
          ) : filteredPeople.length === 0 ? (
            <div className="border border-border border-dashed p-12 text-center text-muted-foreground">
              <p className="font-mono text-xs uppercase tracking-widest">No matching members found</p>
              <p className="text-xs mt-1">Try adjusting your filters or add a new leader/advisor to this collection.</p>
            </div>
          ) : (
            /* Items List */
            <div className="grid grid-cols-1 gap-4">
              {filteredPeople.map(person => (
                <div
                  key={person.id}
                  className={`border border-border p-6 hover:border-foreground transition-all duration-100 flex flex-col sm:flex-row justify-between gap-6 group relative
                    ${editId === person.id ? 'border-primary/50 bg-primary/[0.01]' : 'bg-background'}`}
                >
                  <div className="space-y-4 max-w-2-3">
                    {/* Header Details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase rounded-sm border
                          ${person.type === 'leadership' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-accent/10 border-accent/20 text-accent'}`}
                        >
                          {person.type === 'leadership' ? 'Founding Team' : 'Advisor'}
                        </span>
                        {person.geo && (
                          <span className="font-mono text-[9px] text-muted-foreground/70 uppercase tracking-widest flex items-center gap-1">
                            <MapPin size={9} />
                            {person.geo}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg tracking-h3 text-foreground font-black leading-tight flex items-center gap-2.5">
                        {person.name}
                        {person.linkedin && (
                          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-primary transition-colors">
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                      </h3>
                      <p className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground/80 mt-0.5">{person.title}</p>
                    </div>

                    {/* Bio */}
                    <p className="font-text text-sm leading-relaxed text-muted-foreground max-w-[55ch] m-0 line-clamp-3 md:line-clamp-none">
                      {person.bio}
                    </p>

                    {/* Tags (Leadership Only) */}
                    {person.type === 'leadership' && person.tags && person.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {person.tags.map(tag => (
                          <span key={tag} className="font-mono text-[10px] tracking-widest uppercase text-foreground px-2 py-0.5 border border-border bg-border/20 rounded-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-start sm:justify-center gap-2 border-t sm:border-t-0 border-border pt-4 sm:pt-0 shrink-0">
                    <button
                      onClick={() => handleEditInit(person)}
                      disabled={actionLoading}
                      className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-50 transition-colors cursor-pointer rounded-sm"
                      title="Edit Member"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(person)}
                      disabled={actionLoading}
                      className="p-2 border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 disabled:opacity-50 transition-colors cursor-pointer rounded-sm"
                      title="Delete Member"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Sticky Add / Edit Form Workspace */}
        <div id="people-form-container" className="lg:sticky lg:top-24">
          <div className="border border-border p-6 bg-background/50 backdrop-blur-md space-y-6">
            <div>
              <h2 className="font-display text-lg tracking-h3 text-foreground font-black flex items-center gap-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
                {isEditing ? 'Modify Profile' : 'Add New Profile'}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {isEditing ? 'Editing active Firestore record profile below.' : 'Create a new team member document.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switch (Only active on create) */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">Collection Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isEditing}
                    onClick={() => {
                      setFormType('leadership')
                      // reset sub fields
                      setFormGeo('')
                      setFormFullBio('')
                    }}
                    className={`py-2 px-3 text-xs font-semibold text-center border cursor-pointer transition-colors duration-[120ms] disabled:opacity-80 rounded-sm
                      ${formType === 'leadership' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Founding Team
                  </button>
                  <button
                    type="button"
                    disabled={isEditing}
                    onClick={() => {
                      setFormType('advisor')
                      // reset sub fields
                      setFormTags('')
                    }}
                    className={`py-2 px-3 text-xs font-semibold text-center border cursor-pointer transition-colors duration-[120ms] disabled:opacity-80 rounded-sm
                      ${formType === 'advisor' ? 'border-accent bg-accent/5 text-accent' : 'border-border bg-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Advisory Network
                  </button>
                </div>
                {isEditing && (
                  <p className="text-[10px] text-muted-foreground/60 italic">Record type cannot be changed when editing.</p>
                )}
              </div>

              {/* Core fields */}
              <div className="space-y-1.5">
                <label htmlFor="p-name" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">Full Name</label>
                <input
                  id="p-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Enyi Odigbo"
                  className="w-full bg-background border border-border px-3 py-2 font-text text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground rounded-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="p-title" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">Professional Title</label>
                <input
                  id="p-title"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Chairman or Strategic Lead"
                  className="w-full bg-background border border-border px-3 py-2 font-text text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground rounded-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="p-linkedin" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">LinkedIn Link</label>
                <input
                  id="p-linkedin"
                  type="text"
                  value={formLinkedin}
                  onChange={(e) => setFormLinkedin(e.target.value)}
                  placeholder="e.g. https://linkedin.com/in/... or #"
                  className="w-full bg-background border border-border px-3 py-2 font-text text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground rounded-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="p-bio" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">Short Biography / Pitch</label>
                <textarea
                  id="p-bio"
                  rows={4}
                  required
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="A concise, high-impact summary statement displayed on overview profiles..."
                  className="w-full bg-background border border-border px-3 py-2 font-text text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground resize-none rounded-sm"
                />
              </div>

              {/* Conditional Fields: Leadership */}
              {formType === 'leadership' && (
                <div className="space-y-1.5 border-t border-border/50 pt-3">
                  <label htmlFor="p-tags" className="font-mono text-[10px] uppercase tracking-wider text-primary block">Expertise Tags</label>
                  <input
                    id="p-tags"
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="e.g. GOVERNANCE, STRATEGY, FINTECH (comma-separated)"
                    className="w-full bg-background border border-primary/20 focus:border-primary px-3 py-2 font-text text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none rounded-sm"
                  />
                  <p className="text-[10px] text-muted-foreground/60 italic leading-snug">Divide multiple tags using standard commas.</p>
                </div>
              )}

              {/* Conditional Fields: Advisor */}
              {formType === 'advisor' && (
                <div className="space-y-4 border-t border-border/50 pt-3">
                  <div className="space-y-1.5">
                    <label htmlFor="p-geo" className="font-mono text-[10px] uppercase tracking-wider text-accent block">Geographical Base</label>
                    <input
                      id="p-geo"
                      type="text"
                      value={formGeo}
                      onChange={(e) => setFormGeo(e.target.value)}
                      placeholder="e.g. Lagos, Reykjavik, Paris"
                      className="w-full bg-background border border-accent/20 focus:border-accent px-3 py-2 font-text text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none rounded-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="p-full-bio" className="font-mono text-[10px] uppercase tracking-wider text-accent block">Expanded Full Biography</label>
                    <textarea
                      id="p-full-bio"
                      rows={5}
                      value={formFullBio}
                      onChange={(e) => setFormFullBio(e.target.value)}
                      placeholder="The comprehensive professional history or statement, displayed on advisor detail pages..."
                      className="w-full bg-background border border-accent/20 focus:border-accent px-3 py-2 font-text text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none rounded-sm"
                    />
                    <p className="text-[10px] text-muted-foreground/60 italic leading-snug">Defaults to Short Bio if left blank.</p>
                  </div>
                </div>
              )}

              {/* Submission Buttons */}
              <div className="pt-4 flex gap-3 border-t border-border">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 font-text text-xs font-bold py-2.5 px-4 bg-foreground text-background hover:bg-foreground/80 disabled:opacity-50 transition-colors border-0 cursor-pointer rounded-sm"
                >
                  {actionLoading ? 'Processing...' : isEditing ? 'Update Profile' : 'Publish to Firestore'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={actionLoading}
                    className="font-text text-xs font-bold py-2.5 px-4 bg-transparent border border-border text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors cursor-pointer rounded-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
