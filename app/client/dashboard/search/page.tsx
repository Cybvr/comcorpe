'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Layers3, MapPin, Search, Users } from 'lucide-react'
import { pods } from '@/lib/pods'
import { talentProfiles, getTalentProfile } from '@/lib/talent'

type DiscoverTab = 'all' | 'pods'

const pageSizes: Record<DiscoverTab, number> = {
  all: 12,
  pods: 6,
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
    // Basic budget filtering (just for demo)
    const matchesBudget = budgetFilter === 'All' || (budgetFilter === '<$50k' && parseInt(p.rate.replace(/\D/g, '')) < 50) || (budgetFilter === '>$50k' && parseInt(p.rate.replace(/\D/g, '')) >= 50)
    return matchesSearch && matchesMarket && matchesExpertise && matchesBudget
  })
  
  const filteredTalent = talentProfiles.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesExpertise = expertiseFilter === 'All' || t.role.includes(expertiseFilter)
    // Basic budget filtering for talent
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
      <div className="flex gap-8 mb-6 border-b border-ink-10">
        {(['all', 'pods'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => selectTab(tab)}
            className={`pb-4 font-display font-black text-[16px] tracking-[-0.01em] transition-all relative ${
              activeTab === tab ? 'text-blue' : 'text-ink-40 hover:text-ink'
            }`}
          >
            {tab === 'pods' ? 'Pods' : 'All'}
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
        
        <div className="flex items-center flex-wrap gap-2 px-2">
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
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-eyebrow text-blue mb-1">{pod.focus}</p>
                    <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors leading-tight">
                      {pod.name}
                    </h2>
                  </div>
                  <div className="font-mono text-[10px] bg-ink-5 px-2 py-1 rounded border border-ink-10 text-ink-60 group-hover:border-blue/20 transition-colors">
                    {pod.rate}
                  </div>
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-text text-[13px] text-ink-60">
                      <Users size={14} strokeWidth={1.5} className="text-ink-40" />
                      <span className="font-semibold text-ink">{lead.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-text text-[13px] text-ink-60">
                      <Layers3 size={14} strokeWidth={1.5} className="text-ink-40" />
                      <span>{pod.availability.replace('Ready in ', '')}</span>
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
          {visibleTalent.map((profile) => (
            <Link
              key={profile.id}
              href={`/client/dashboard/search/talent/${profile.id}`}
              className="border border-ink-10 rounded-xl p-5 bg-paper hover:border-ink-20 hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl border border-ink-10 overflow-hidden relative flex items-center justify-center ${profile.color || 'bg-ink'} font-display font-black text-[16px] text-paper`}>
                  {profile.image ? (
                    <Image src={profile.image} alt={profile.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    profile.initials
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="p-1 rounded-full bg-ink-5 group-hover:bg-blue/10 transition-colors">
                    <ArrowUpRight size={14} className="text-ink-20 group-hover:text-blue transition-colors" />
                  </div>
                  <div className="font-mono text-[8px] bg-ink-5 px-1.5 py-0.5 rounded border border-ink-10 text-ink-40 uppercase tracking-tighter">
                    {profile.rate}
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-display font-black text-[18px] tracking-[-0.01em] text-ink group-hover:text-blue transition-colors leading-tight">
                  {profile.name}
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-eyebrow text-blue/60 mt-1">{profile.role}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-ink-5 flex items-center gap-2 text-ink-60 font-text text-[11px]">
                <MapPin size={10} className="text-ink-20" />
                <span className="truncate">{profile.bg}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setActivePage} />
      )}
    </div>
  )
}
