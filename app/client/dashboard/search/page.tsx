'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, DollarSign, Layers3, MapPin, Plus, Search, Users, X } from 'lucide-react'
import { pods } from '@/lib/pods'
import { jobs } from '@/lib/jobs'
import { talentProfiles, getTalentProfile } from '@/lib/user'

type DiscoverTab = 'all' | 'pods' | 'build'

const pageSizes: Record<DiscoverTab, number> = {
  all: 12,
  pods: 6,
  build: 12,
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
    <nav className="flex items-center justify-center gap-2 mt-12 py-6 border-t border-ink-5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-ink-10 text-ink-60 hover:bg-ink-5 disabled:opacity-30 transition-all font-text text-sm"
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
                ? 'bg-ink text-paper'
                : 'text-ink-40 hover:bg-ink-5'
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
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-ink-10 text-ink-60 hover:bg-ink-5 disabled:opacity-30 transition-all font-text text-sm"
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
            ? 'bg-blue/5 border-blue/20 text-blue font-semibold' 
            : 'bg-paper border-ink-10 text-ink-60 hover:border-ink-20 hover:text-ink'
        }`}
      >
        {value === 'All' ? label : value} 
        <ChevronDown size={14} className={`text-ink-40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-paper border border-ink-10 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {['All', ...options].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                value === opt ? 'bg-blue/5 text-blue font-semibold' : 'text-ink-60 hover:bg-ink-5 hover:text-ink'
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
  const [activeTab, setActiveTab] = useState<DiscoverTab>('all')
  const [activePage, setActivePage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
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
  
  // Filtering logic
  const filteredPods = pods.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.focus.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMarket = marketFilter === 'All' || p.markets.some(m => m.includes(marketFilter))
    const matchesExpertise = expertiseFilter === 'All' || p.focus.includes(expertiseFilter)
    const matchesBudget = budgetFilter === 'All' || (budgetFilter === '<$50k' && parseInt(p.rate.replace(/\D/g, '')) < 50) || (budgetFilter === '>$50k' && parseInt(p.rate.replace(/\D/g, '')) >= 50)
    return matchesSearch && matchesMarket && matchesExpertise && matchesBudget
  })
  
  const filteredTalent = talentProfiles.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesExpertise = expertiseFilter === 'All' || t.role.includes(expertiseFilter)
    const matchesBudget = budgetFilter === 'All' || (budgetFilter === '<$15k' && parseInt(t.rate?.replace(/\D/g, '') || '0') < 15) || (budgetFilter === '>$15k' && parseInt(t.rate?.replace(/\D/g, '') || '0') >= 15)
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
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1240px] mx-auto">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Search</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Talent & Pods</h1>
      </div>
      <div className="flex gap-8 mb-6 border-b border-ink-10">
        {([['all', 'All'], ['pods', 'Pods'], ['build', 'Build a pod']] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => selectTab(tab)}
            className={`pb-4 font-display font-black text-[16px] tracking-[-0.01em] transition-all relative inline-flex items-center gap-2 ${
              activeTab === tab ? 'text-blue' : 'text-ink-40 hover:text-ink'
            }`}
          >
            {label}
            {tab === 'build' && selectedIds.size > 0 && (
              <span className="font-mono text-[10px] font-bold bg-blue text-paper px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{selectedIds.size}</span>
            )}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue" />
            )}
          </button>
        ))}
      </div>

      {/* Filter Section */}
      <section className="mb-8 p-1.5 bg-ink-5 rounded-2xl flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-40" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'all' ? 'talent' : 'pods'}...`}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); }}
            className="w-full pl-12 pr-4 py-3 bg-paper border border-ink-10 rounded-xl focus:outline-none focus:border-blue/30 transition-all font-text text-[15px]"
          />
        </div>
        
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
            label="Monthly Budget" 
            options={activeTab === 'pods' ? ['<$50k', '>$50k'] : ['<$15k', '>$15k']} 
            value={budgetFilter}
            onChange={(val) => { setBudgetFilter(val); setActivePage(1); }}
          />
        </div>
      </section>

      {itemCount === 0 ? (
        <div className="py-20 text-center bg-paper border border-dashed border-ink-10 rounded-2xl">
          <p className="font-text text-ink-40">No results match your current filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setMarketFilter('All'); setExpertiseFilter('All'); setBudgetFilter('All'); }}
            className="mt-4 text-blue text-sm font-semibold hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : activeTab === 'pods' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePods.map((pod) => {
            const lead = getTalentProfile(pod.leadId)
            return (
              <Link
                key={pod.id}
                href={`/client/dashboard/search/${pod.slug}`}
                className="border border-ink-10 rounded-xl p-6 bg-paper hover:border-ink-20 hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="mb-6">
                  <p className="font-mono text-[10px] uppercase tracking-eyebrow text-blue mb-1">{pod.focus}</p>
                  <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors leading-tight">
                    {pod.name}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-8">
                  {pod.memberIds.slice(0, 4).map((memberId, i) => {
                    const profile = getTalentProfile(memberId)
                    return (
                      <div
                        key={memberId}
                        className={`aspect-square rounded-lg flex items-center justify-center font-display font-black text-[16px] transition-all duration-300 border overflow-hidden relative ${
                          i === 0 && !profile.image
                            ? 'bg-ink text-paper border-ink shadow-sm' 
                            : 'bg-ink-10/40 text-ink-40 border-ink-10 group-hover:border-ink-20'
                        }`}
                      >
                        {profile.image ? (
                          <Image 
                            src={profile.image} 
                            alt={profile.name} 
                            fill 
                            className="object-cover transition-transform group-hover:scale-110" 
                          />
                        ) : (
                          profile.initials
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-auto pt-5 border-t border-ink-5 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5 font-text text-[13px] text-ink-60">
                      <Users size={14} strokeWidth={1.5} className="text-ink-40" />
                      <span className="font-semibold text-ink">{lead.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-text text-[13px] text-ink-60">
                      <Clock size={14} strokeWidth={1.5} className="text-ink-40" />
                      <span>{pod.availability.replace('Ready in ', '')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-text text-[13px] text-ink-60">
                      <DollarSign size={14} strokeWidth={1.5} className="text-ink-40" />
                      <span className="font-semibold text-ink">{pod.rate.replace('/mo', '')}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-ink-20 group-hover:text-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
                className={`relative border rounded-xl p-5 bg-paper transition-all group flex flex-col ${selected ? 'border-blue shadow-md' : 'border-ink-10 hover:border-ink-20 hover:shadow-lg'}`}
              >
                {/* Add/remove toggle */}
                <button
                  onClick={() => toggleSelect(profile.id)}
                  className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 ${selected ? 'bg-blue text-paper' : 'bg-ink-5 text-ink-40 hover:bg-blue/10 hover:text-blue'}`}
                  aria-label={selected ? 'Remove from pod' : 'Add to pod'}
                >
                  {selected ? <Check size={12} strokeWidth={2.5} /> : <Plus size={12} strokeWidth={2} />}
                </button>

                <Link href={`/client/dashboard/search/talent/${profile.id}`} className="flex flex-col flex-1">
                  <div className="mb-4">
                    <div className={`w-14 h-14 rounded-xl border border-ink-10 overflow-hidden relative flex items-center justify-center ${profile.color || 'bg-ink'} font-display font-black text-[16px] text-paper`}>
                      {profile.image ? (
                        <Image src={profile.image} alt={profile.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        profile.initials
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-black text-[18px] tracking-[-0.01em] text-ink group-hover:text-blue transition-colors leading-tight pr-6">
                      {profile.name}
                    </h3>
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow text-blue/60 mt-1">{profile.role}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-ink-5 flex items-center justify-between gap-2 text-ink-60 font-text text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin size={10} className="text-ink-20" />
                      <span className="truncate">{profile.bg}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-ink shrink-0">
                      <DollarSign size={10} className="text-ink-20" />
                      {profile.rate?.replace('/mo', '')}
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-5 min-w-[480px] max-w-[640px]">
          <div className="flex -space-x-2 shrink-0">
            {selectedProfiles.slice(0, 5).map(p => (
              <div
                key={p.id}
                className={`w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center font-display font-black text-[11px] text-paper shrink-0 overflow-hidden relative ${p.color || 'bg-blue'}`}
              >
                {p.image ? <Image src={p.image} alt={p.name} fill className="object-cover" /> : p.initials}
              </div>
            ))}
            {selectedIds.size > 5 && (
              <div className="w-9 h-9 rounded-full border-2 border-ink bg-paper/20 flex items-center justify-center font-mono text-[10px] text-paper">
                +{selectedIds.size - 5}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-[15px] leading-tight">
              {selectedIds.size} operator{selectedIds.size !== 1 ? 's' : ''} selected
            </p>
            <p className="font-text text-[11px] text-paper/50 mt-0.5 truncate">
              {selectedProfiles.map(p => p.name.split(' ')[0]).join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="w-8 h-8 rounded-full bg-paper/10 hover:bg-paper/20 flex items-center justify-center transition-colors"
              aria-label="Clear selection"
            >
              <X size={13} />
            </button>
            <button
              onClick={() => selectTab('build')}
              className="font-text text-sm font-semibold px-5 py-2 bg-blue hover:bg-ink text-paper rounded-full transition-colors duration-[120ms]"
            >
              Build pod →
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
        <div className="w-14 h-14 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
        </div>
        <h2 className="font-display font-black text-[28px] tracking-[-0.03em] text-ink mb-3">Pod submitted</h2>
        <p className="font-text text-ink-60 mb-8">
          <strong className="text-ink">{podName}</strong> has been submitted for review. Your account lead will confirm fit and schedule intro calls within 48 hours.
        </p>
        <Link href="/client/dashboard" className="font-text text-sm font-semibold px-6 py-3 bg-ink text-paper rounded-full hover:bg-blue transition-colors duration-[120ms]">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start mt-2">
      <div className="space-y-5">

        {/* Team */}
        <section className="bg-paper border border-ink-10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-black text-[18px] tracking-[-0.02em] text-ink">Team ({members.length})</h2>
            <button onClick={onAddMore} className="font-text text-xs text-blue hover:underline">+ Add operators</button>
          </div>
          {members.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-ink-10 rounded-xl">
              <p className="font-text text-sm text-ink-40 mb-3">No operators selected yet.</p>
              <button onClick={onAddMore} className="font-text text-xs text-blue hover:underline">Browse talent →</button>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map(profile => (
                <div key={profile!.id} className="flex items-center gap-3 p-3 border border-ink-10 rounded-xl group hover:border-ink-20 transition-colors">
                  <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-display font-black text-[12px] text-paper overflow-hidden relative ${profile!.color || 'bg-ink'}`}>
                    {profile!.image ? <Image src={profile!.image} alt={profile!.name} fill className="object-cover" /> : profile!.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-black text-[14px] text-ink leading-tight">{profile!.name}</p>
                    <p className="font-text text-[11px] text-ink-60 truncate">{profile!.role}</p>
                  </div>
                  <button
                    onClick={() => onRemove(profile!.id)}
                    className="w-6 h-6 rounded-full bg-ink-5 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-ink-40 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Name */}
        <section className="bg-paper border border-ink-10 rounded-2xl p-6">
          <h2 className="font-display font-black text-[18px] tracking-[-0.02em] text-ink mb-4">Name your pod</h2>
          <input
            type="text"
            placeholder="e.g. Lagos Entry Team"
            value={podName}
            onChange={e => setPodName(e.target.value)}
            className="w-full px-4 py-3 border border-ink-10 rounded-xl font-text text-[15px] focus:outline-none focus:border-blue/40 transition-colors"
          />
          <p className="font-text text-[11px] text-ink-40 mt-2">For your reference only — not shared with operators.</p>
        </section>

        {/* Attach to brief */}
        <section className="bg-paper border border-ink-10 rounded-2xl p-6">
          <h2 className="font-display font-black text-[18px] tracking-[-0.02em] text-ink mb-1">Attach to a brief</h2>
          <p className="font-text text-[12px] text-ink-40 mb-4">Optional — you can attach later from the brief page.</p>
          <div className="space-y-2">
            <button
              onClick={() => setBriefSlug('')}
              className={`w-full text-left px-4 py-3 border rounded-xl font-text text-sm transition-colors ${briefSlug === '' ? 'border-blue bg-blue/5 text-blue font-semibold' : 'border-ink-10 text-ink-60 hover:border-ink-20'}`}
            >
              No brief yet — submit for review only
            </button>
            {openBriefs.map(job => (
              <button
                key={job.slug}
                onClick={() => setBriefSlug(job.slug)}
                className={`w-full text-left px-4 py-3 border rounded-xl transition-colors ${briefSlug === job.slug ? 'border-blue bg-blue/5' : 'border-ink-10 hover:border-ink-20'}`}
              >
                <p className={`font-text text-sm font-semibold ${briefSlug === job.slug ? 'text-blue' : 'text-ink'}`}>{job.title}</p>
                <p className="font-text text-[11px] text-ink-40 mt-0.5">{job.client} · {job.status}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-6">
        <div className="bg-ink text-paper rounded-2xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-paper/40 mb-4">Pod summary</p>
          <div className="flex -space-x-2 mb-4">
            {members.slice(0, 5).map(p => (
              <div key={p!.id} className={`w-10 h-10 rounded-full border-2 border-ink shrink-0 flex items-center justify-center font-display font-black text-[11px] text-paper overflow-hidden relative ${p!.color || 'bg-blue'}`}>
                {p!.image ? <Image src={p!.image} alt={p!.name} fill className="object-cover" /> : p!.initials}
              </div>
            ))}
          </div>
          <p className="font-display font-black text-[18px] leading-tight text-paper mb-1">
            {podName || <span className="text-paper/30 italic text-[16px]">Unnamed pod</span>}
          </p>
          <p className="font-text text-[12px] text-paper/50">
            {members.length} operator{members.length !== 1 ? 's' : ''}
            {briefSlug ? ` · ${openBriefs.find(j => j.slug === briefSlug)?.client}` : ''}
          </p>
        </div>
        <button
          onClick={() => { if (podName && members.length > 0) setSubmitted(true) }}
          disabled={!podName || members.length === 0}
          className="w-full py-3.5 bg-blue text-paper rounded-full font-text text-sm font-semibold hover:bg-ink transition-colors duration-[120ms] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit pod for review
        </button>
        <p className="font-text text-[11px] text-ink-40 text-center">Your account lead reviews fit within 48 hours.</p>
      </aside>
    </div>
  )
}
