'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, DollarSign, Layers3, MapPin, Plus, Search, Users, X, Sparkles, BrainCircuit } from 'lucide-react'
import { usePods } from '@/lib/pods'
import { useJobs } from '@/lib/jobs'
import { getTalentProfile, getClientUser, type User } from '@/lib/user'
import { useUsers } from '@/lib/user'

type DiscoverTab = 'all' | 'pods' | 'build'

const pageSizes: Record<DiscoverTab, number> = {
  all: 12,
  pods: 6,
  build: 12,
}

function getTalentTitle(profile: { talentRole?: string; role: string }) {
  return profile.talentRole ?? profile.role
}

function getStartingRate(rate?: string) {
  const match = rate?.match(/\$?([\d,]+)/)
  return match ? Number(match[1].replace(/,/g, '')) : 0
}

function includesText(value: string | undefined, query: string) {
  return (value ?? '').toLowerCase().includes(query)
}

function getProfile(id: string, talentProfiles: User[]) {
  return talentProfiles.find(profile => profile.id === id) ?? getTalentProfile(id)
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <nav className="flex items-center justify-center gap-2 mt-12 py-6 border-t border-muted" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-all font-text text-sm"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      
      <div className="flex items-center gap-1 mx-4">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`h-9 w-9 rounded-md font-mono text-[12px] font-bold transition-all ${
              item === page
                ? 'bg-foreground text-background'
                : 'text-muted-foreground/70 hover:bg-muted'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-all font-text text-sm"
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  )
}

function FilterDropdown({ 
  label, 
  options, 
  value, 
  onChange 
}: { 
  label: string, 
  options: string[], 
  value: string, 
  onChange: (val: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-text text-sm transition-all whitespace-nowrap ${
          value !== 'All' 
            ? 'bg-primary/5 border-primary/20 text-primary font-semibold' 
            : 'bg-background border-border text-muted-foreground hover:border-input hover:text-foreground'
        }`}
      >
        {value === 'All' ? label : value} 
        <ChevronDown size={14} className={`text-muted-foreground/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {['All', ...options].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                value === opt ? 'bg-primary/5 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DiscoverPage() {
  const { jobs } = useJobs()
  const { users } = useUsers()
  const { pods } = usePods()
  const talentProfiles = users.filter(u => u.role === 'talent')
  const [activeTab, setActiveTab] = useState<DiscoverTab>('all')
  const [activePage, setActivePage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSmartSearch, setIsSmartSearch] = useState(false)
  const [isAILoading, setIsAILoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectedProfiles = talentProfiles.filter(p => selectedIds.has(p.id))

  // Filter states
  const [marketFilter, setMarketFilter] = useState('All')
  const [expertiseFilter, setExpertiseFilter] = useState('All')
  const [budgetFilter, setBudgetFilter] = useState('All')

  const pageSize = pageSizes[activeTab]
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const normalizedMarket = marketFilter.toLowerCase()
  const normalizedExpertise = expertiseFilter.toLowerCase()
  
  // Filtering logic
  const filteredPods = pods.filter(p => {
    const matchesSearch = !normalizedSearch ||
      includesText(p.name, normalizedSearch) ||
      includesText(p.focus, normalizedSearch) ||
      includesText(p.summary, normalizedSearch) ||
      p.markets.some(market => includesText(market, normalizedSearch)) ||
      p.evidence.some(item => includesText(item, normalizedSearch))
    const matchesMarket = marketFilter === 'All' || p.markets.some(m => m.toLowerCase().includes(normalizedMarket))
    const matchesExpertise = expertiseFilter === 'All' ||
      includesText(p.focus, normalizedExpertise) ||
      includesText(p.summary, normalizedExpertise) ||
      p.evidence.some(item => includesText(item, normalizedExpertise))
    const startingRate = getStartingRate(p.rate)
    const matchesBudget = budgetFilter === 'All' || (budgetFilter === '<$600/hr' && startingRate < 600) || (budgetFilter === '>$600/hr' && startingRate >= 600)
    return matchesSearch && matchesMarket && matchesExpertise && matchesBudget
  })
  
  const filteredTalent = talentProfiles.filter(t => {
    const talentTitle = getTalentTitle(t)
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         talentTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesExpertise = expertiseFilter === 'All' || talentTitle.toLowerCase().includes(expertiseFilter.toLowerCase())
    const startingRate = getStartingRate(t.rate)
    const matchesBudget = budgetFilter === 'All' || (budgetFilter === '<$150/hr' && startingRate < 150) || (budgetFilter === '>$150/hr' && startingRate >= 150)
    return matchesSearch && matchesExpertise && matchesBudget
  })

  const itemCount = activeTab === 'pods' ? filteredPods.length : filteredTalent.length
  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize))
  const currentPage = Math.min(activePage, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  
  const visiblePods = filteredPods.slice(pageStart, pageStart + pageSize)
  const visibleTalent = filteredTalent.slice(pageStart, pageStart + pageSize)

  function selectTab(tab: DiscoverTab) {
    setActiveTab(tab)
    setActivePage(1)
    setBudgetFilter('All')
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1240px] mx-auto">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-2">Search</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-none">Talent & Pods</h1>
      </div>
      <div className="flex gap-8 mb-6 border-b border-border">
        {([['all', 'All'], ['pods', 'Pods'], ['build', 'Build a pod']] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => selectTab(tab)}
            className={`pb-4 font-display font-black text-[16px] tracking-[-0.01em] transition-all relative inline-flex items-center gap-2 ${
              activeTab === tab ? 'text-primary' : 'text-muted-foreground/70 hover:text-foreground'
            }`}
          >
            {label}
            {tab === 'build' && selectedIds.size > 0 && (
              <span className="font-mono text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{selectedIds.size}</span>
            )}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Filter Section */}
      <section className="mb-8 p-1.5 bg-muted rounded-2xl flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'all' ? 'talent' : 'pods'}...`}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); }}
            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary/30 transition-all font-text text-[15px]"
          />
          {isAILoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            </div>
          )}
        </div>
        
        <button
          onClick={() => {
            setIsSmartSearch(!isSmartSearch)
            if (!isSmartSearch && searchQuery) {
              setIsAILoading(true)
              setTimeout(() => setIsAILoading(false), 800)
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-text text-sm transition-all whitespace-nowrap ${
            isSmartSearch 
              ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
              : 'bg-background border-border text-muted-foreground hover:border-input'
          }`}
        >
          <BrainCircuit size={16} className={isSmartSearch ? 'animate-pulse' : ''} />
          Smart Search
        </button>
        
        <div className="flex items-center gap-2 px-2 overflow-x-auto no-scrollbar">
          <FilterDropdown 
            label="All markets" 
            options={['Nigeria', 'Kenya', 'South Africa', 'Ghana', 'UK']} 
            value={marketFilter}
            onChange={(val) => { setMarketFilter(val); setActivePage(1); }}
          />
          <FilterDropdown 
            label="Expertise" 
            options={['Fintech', 'Growth', 'Strategy', 'Brand', 'Market Entry']} 
            value={expertiseFilter}
            onChange={(val) => { setExpertiseFilter(val); setActivePage(1); }}
          />
          <FilterDropdown 
            label="Hourly rate" 
            options={activeTab === 'pods' ? ['<$600/hr', '>$600/hr'] : ['<$150/hr', '>$150/hr']} 
            value={budgetFilter}
            onChange={(val) => { setBudgetFilter(val); setActivePage(1); }}
          />
        </div>
      </section>

      {itemCount === 0 ? (
        <div className="py-20 text-center bg-background border border-dashed border-border rounded-2xl">
          <p className="font-text text-muted-foreground/70">No results match your current filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setMarketFilter('All'); setExpertiseFilter('All'); setBudgetFilter('All'); }}
            className="mt-4 text-primary text-sm font-semibold hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : activeTab === 'pods' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePods.map((pod) => {
            const lead = getProfile(pod.leadId, talentProfiles)
            return (
              <Link
                key={pod.id}
                href={`/client/dashboard/search/${pod.slug}`}
                className="border border-border rounded-xl p-6 bg-background flex flex-col"
              >
                <div className="mb-6">
                  <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-1">{pod.focus}</p>
                  <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground leading-tight">
                    {pod.name}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-8">
                  {pod.memberIds.slice(0, 4).map((memberId, i) => {
                    const profile = getProfile(memberId, talentProfiles)
                    return (
                      <div
                        key={memberId}
                        className={`aspect-square rounded-lg flex items-center justify-center font-display font-black text-[16px] transition-all duration-300 border overflow-hidden relative ${
                          i === 0 && !profile.image
                            ? 'bg-foreground text-background border-foreground shadow-sm' 
                            : 'bg-border/40 text-muted-foreground/70 border-border'
                        }`}
                      >
                        {profile.image ? (
                          <Image 
                            src={profile.image} 
                            alt={profile.name} 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          profile.initials
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-auto pt-5 border-t border-muted flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5 font-text text-[13px] text-muted-foreground">
                      <Users size={14} strokeWidth={1.5} className="text-muted-foreground/70" />
                      <span className="font-semibold text-foreground">{lead.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-text text-[13px] text-muted-foreground">
                      <Clock size={14} strokeWidth={1.5} className="text-muted-foreground/70" />
                      <span>{pod.availability.replace('Ready in ', '')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-text text-[13px] text-muted-foreground">
                      <DollarSign size={14} strokeWidth={1.5} className="text-muted-foreground/70" />
                      <span className="text-muted-foreground/70">Pod/hr</span>
                      <span className="font-semibold text-foreground">{pod.rate}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-input" />
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleTalent.map((profile) => {
            const selected = selectedIds.has(profile.id)
            return (
              <div
                key={profile.id}
                className={`relative border rounded-xl p-5 bg-background transition-all group flex flex-col ${selected ? 'border-primary shadow-md' : 'border-border hover:border-input hover:shadow-lg'}`}
              >
                {/* Add/remove toggle */}
                <button
                  onClick={() => toggleSelect(profile.id)}
                  className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground/70 hover:bg-primary/10 hover:text-primary'}`}
                  aria-label={selected ? 'Remove from pod' : 'Add to pod'}
                >
                  {selected ? <Check size={12} strokeWidth={2.5} /> : <Plus size={12} strokeWidth={2} />}
                </button>

                <Link href={`/client/dashboard/search/talent/${profile.id}`} className="flex flex-col flex-1">
                  <div className="mb-4">
                    <div className={`w-14 h-14 rounded-xl border border-border overflow-hidden relative flex items-center justify-center ${profile.color || 'bg-foreground'} font-display font-black text-[16px] text-background`}>
                      {profile.image ? (
                        <Image src={profile.image} alt={profile.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        profile.initials
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-black text-[18px] tracking-[-0.01em] text-foreground group-hover:text-primary transition-colors leading-tight pr-6">
                      {profile.name}
                    </h3>
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow text-primary/60 mt-1">{getTalentTitle(profile)}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-muted flex items-center justify-between gap-2 text-muted-foreground font-text text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin size={10} className="text-input" />
                      <span className="truncate">{profile.bg}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-foreground shrink-0">
                      <DollarSign size={10} className="text-input" />
                      {profile.rate}
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setActivePage} />
      )}

      {/* Pod builder tray */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-5 min-w-[480px] max-w-[640px]">
          <div className="flex -space-x-2 shrink-0">
            {selectedProfiles.slice(0, 5).map(p => (
              <div
                key={p.id}
                className={`w-9 h-9 rounded-full border-2 border-foreground flex items-center justify-center font-display font-black text-[11px] text-background shrink-0 overflow-hidden relative ${p.color || 'bg-primary'}`}
              >
                {p.image ? <Image src={p.image} alt={p.name} fill className="object-cover" /> : p.initials}
              </div>
            ))}
            {selectedIds.size > 5 && (
              <div className="w-9 h-9 rounded-full border-2 border-foreground bg-background/20 flex items-center justify-center font-mono text-[10px] text-background">
                +{selectedIds.size - 5}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-[15px] leading-tight">
              {selectedIds.size} operator{selectedIds.size !== 1 ? 's' : ''} selected
            </p>
            <p className="font-text text-[11px] text-background/50 mt-0.5 truncate">
              {selectedProfiles.map(p => p.name.split(' ')[0]).join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="w-8 h-8 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
              aria-label="Clear selection"
            >
              <X size={13} />
            </button>
            <button
              onClick={() => selectTab('build')}
              className="font-text text-sm font-semibold px-5 py-2 bg-primary hover:bg-foreground text-primary-foreground rounded-full transition-colors duration-[120ms]"
            >
              Build pod â†’
            </button>
          </div>
        </div>
      )}

      {/* Build tab inline pod builder */}
      {activeTab === 'build' && (
        <BuildTab
          memberIds={[...selectedIds]}
          onRemove={(id) => toggleSelect(id)}
          onAddMore={() => selectTab('all')}
          openBriefs={jobs.filter(j => j.status !== 'Completed')}
        />
      )}
    </div>
  )
}

function BuildTab({
  memberIds,
  onRemove,
  onAddMore,
  openBriefs,
}: {
  memberIds: string[]
  onRemove: (id: string) => void
  onAddMore: () => void
  openBriefs: import('@/lib/jobs').Job[]
}) {
  const [podName, setPodName] = useState('')
  const [briefSlug, setBriefSlug] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const members = memberIds.map(id => { try { return getTalentProfile(id) } catch { return null } }).filter(Boolean)

  if (submitted) {
    return (
      <div className="py-24 text-center max-w-[480px] mx-auto">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
        </div>
        <h2 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground mb-3">Pod submitted</h2>
        <p className="font-text text-muted-foreground mb-8">
          <strong className="text-foreground">{podName}</strong> has been submitted for review. Your account lead will confirm fit and schedule intro calls within 48 hours.
        </p>
        <Link href="/client/dashboard" className="font-text text-sm font-semibold px-6 py-3 bg-foreground text-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start mt-2">
      <div className="space-y-5">

        {/* Team */}
        <section className="bg-background border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-black text-[18px] tracking-[-0.02em] text-foreground">Team ({members.length})</h2>
            <button onClick={onAddMore} className="font-text text-xs text-primary hover:underline">+ Add operators</button>
          </div>
          {members.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-border rounded-xl">
              <p className="font-text text-sm text-muted-foreground/70 mb-3">No operators selected yet.</p>
              <button onClick={onAddMore} className="font-text text-xs text-primary hover:underline">Browse talent â†’</button>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map(profile => (
                <div key={profile!.id} className="flex items-center gap-3 p-3 border border-border rounded-xl group hover:border-input transition-colors">
                  <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-display font-black text-[12px] text-background overflow-hidden relative ${profile!.color || 'bg-foreground'}`}>
                    {profile!.image ? <Image src={profile!.image} alt={profile!.name} fill className="object-cover" /> : profile!.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-black text-[14px] text-foreground leading-tight">{profile!.name}</p>
                    <p className="font-text text-[11px] text-muted-foreground truncate">{getTalentTitle(profile!)}</p>
                  </div>
                  <button
                    onClick={() => onRemove(profile!.id)}
                    className="w-6 h-6 rounded-full bg-muted hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-muted-foreground/70 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Name */}
        <section className="bg-background border border-border rounded-2xl p-6">
          <h2 className="font-display font-black text-[18px] tracking-[-0.02em] text-foreground mb-4">Name your pod</h2>
          <input
            type="text"
            placeholder="e.g. Lagos Entry Team"
            value={podName}
            onChange={e => setPodName(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-xl font-text text-[15px] focus:outline-none focus:border-primary/40 transition-colors"
          />
          <p className="font-text text-[11px] text-muted-foreground/70 mt-2">For your reference only â€” not shared with operators.</p>
        </section>

        {/* Attach to brief */}
        <section className="bg-background border border-border rounded-2xl p-6">
          <h2 className="font-display font-black text-[18px] tracking-[-0.02em] text-foreground mb-1">Attach to a brief</h2>
          <p className="font-text text-[12px] text-muted-foreground/70 mb-4">Optional â€” you can attach later from the brief page.</p>
          <div className="space-y-2">
            <button
              onClick={() => setBriefSlug('')}
              className={`w-full text-left px-4 py-3 border rounded-xl font-text text-sm transition-colors ${briefSlug === '' ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-border text-muted-foreground hover:border-input'}`}
            >
              No brief yet â€” submit for review only
            </button>
            {openBriefs.map(job => (
              <button
                key={job.slug}
                onClick={() => setBriefSlug(job.slug)}
                className={`w-full text-left px-4 py-3 border rounded-xl transition-colors ${briefSlug === job.slug ? 'border-primary bg-primary/5' : 'border-border hover:border-input'}`}
              >
                <p className={`font-text text-sm font-semibold ${briefSlug === job.slug ? 'text-primary' : 'text-foreground'}`}>{job.title}</p>
                <p className="font-text text-[11px] text-muted-foreground/70 mt-0.5">{getClientUser(job.clientId).name} Â· {job.status}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-6">
        <div className="bg-foreground text-background rounded-2xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-background/40 mb-4">Pod summary</p>
          <div className="flex -space-x-2 mb-4">
            {members.slice(0, 5).map(p => (
              <div key={p!.id} className={`w-10 h-10 rounded-full border-2 border-foreground shrink-0 flex items-center justify-center font-display font-black text-[11px] text-background overflow-hidden relative ${p!.color || 'bg-primary'}`}>
                {p!.image ? <Image src={p!.image} alt={p!.name} fill className="object-cover" /> : p!.initials}
              </div>
            ))}
          </div>
          <p className="font-display font-black text-[18px] leading-tight text-background mb-1">
            {podName || <span className="text-background/30 italic text-[16px]">Unnamed pod</span>}
          </p>
          <p className="font-text text-[12px] text-background/50">
            {members.length} operator{members.length !== 1 ? 's' : ''}
            {briefSlug ? ` Â· ${openBriefs.find(j => j.slug === briefSlug)?.clientId}` : ''}
          </p>
        </div>
        <button
          onClick={() => { if (podName && members.length > 0) setSubmitted(true) }}
          disabled={!podName || members.length === 0}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-full font-text text-sm font-semibold hover:bg-foreground transition-colors duration-[120ms] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit pod for review
        </button>
        <p className="font-text text-[11px] text-muted-foreground/70 text-center">Your account lead reviews fit within 48 hours.</p>
      </aside>
    </div>
  )
}
