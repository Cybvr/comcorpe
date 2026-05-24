'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Clock, DollarSign, MapPin, Plus, Search, ShieldCheck, SlidersHorizontal, Users, X } from 'lucide-react'
import SLABadge from '@/components/dashboard/SLABadge'
import NetworkAffiliateBadge from '@/components/dashboard/NetworkAffiliateBadge'
import { FaLinkedin } from 'react-icons/fa'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePods, POD_MEMBER_ROLES } from '@/lib/pods'
import { useJobs } from '@/lib/jobs'
import { getTalentProfile, getClientUser, type User } from '@/lib/user'
import { useUsers } from '@/lib/user'
import { createPod, updateJob } from '@/lib/admin/store'

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

function getEndingRate(rate?: string) {
  const matches = rate?.match(/\$?([\d,]+)/g) ?? []
  if (matches.length === 0) return 0
  return Number(matches[matches.length - 1].replace(/[^\d]/g, ''))
}

function includesText(value: string | undefined, query: string) {
  return (value ?? '').toLowerCase().includes(query)
}

function getUniqueOptions(values: Array<string | undefined>) {
  return [...new Set(values.map((value) => (value ?? '').trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  )
}

function getRateBounds(rates: Array<string | undefined>) {
  const values = rates
    .flatMap((rate) => [getStartingRate(rate), getEndingRate(rate)])
    .filter((value) => value > 0)

  if (values.length === 0) {
    return { min: 0, max: 1000 }
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  }
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

      <div className="flex items-center gap-1 mx-2 sm:mx-4">
        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter((item) => {
            if (totalPages <= 7) return true
            if (item === 1 || item === totalPages) return true
            if (Math.abs(item - page) <= 1) return true
            return false
          })
          .reduce<(number | 'ellipsis')[]>((acc, item, i, arr) => {
            if (i > 0 && typeof arr[i - 1] === 'number' && (item as number) - (arr[i - 1] as number) > 1) {
              acc.push('ellipsis')
            }
            acc.push(item)
            return acc
          }, [])
          .map((item, i) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${i}`} className="w-6 text-center text-muted-foreground/50 text-sm select-none">…</span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item as number)}
                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-md font-mono text-[12px] font-bold transition-all ${item === page
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground/70 hover:bg-muted'
                  }`}
              >
                {item}
              </button>
            )
          )}
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

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (val: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={value !== 'All' ? 'border-primary/20 bg-primary/5 text-primary font-semibold' : ''}
      >
        <SelectValue placeholder={label}>
          {value === 'All' ? label : value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {['All', ...options].map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt === 'All' ? label : opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function FilterPopover({
  activeCount,
  onReset,
  children,
}: {
  activeCount: number
  onReset: () => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`flex items-center gap-2 px-4 h-10 rounded-xl border font-text text-sm transition-colors ${activeCount > 0
            ? 'border-primary/20 bg-primary/5 text-primary font-semibold'
            : 'border-border bg-background text-muted-foreground hover:border-input'
          }`}
      >
        <SlidersHorizontal size={14} />
        <span className="sm:hidden">Filters</span><span className="hidden sm:inline">More</span>
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground font-mono text-[9px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-40 w-72 bg-background border border-border rounded-2xl shadow-xl p-5 flex flex-col gap-4">
            {children}
            <div className="pt-2 border-t border-muted flex items-center justify-between">
              <button
                type="button"
                onClick={() => { onReset(); setOpen(false); }}
                className="font-text text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-text text-xs font-semibold text-primary hover:underline"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function PopoverRateSlider({
  label,
  absoluteMin,
  absoluteMax,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: {
  label: string
  absoluteMin: number
  absoluteMax: number
  minValue: number
  maxValue: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
}) {
  const effectiveMax = absoluteMax > absoluteMin ? absoluteMax : absoluteMin + 1
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-text text-sm text-muted-foreground">{label}</span>
        <span className="font-mono text-[11px] text-foreground">${minValue}–${maxValue}</span>
      </div>
      <Slider
        min={absoluteMin}
        max={effectiveMax}
        step={1}
        value={[minValue, maxValue]}
        onValueChange={([min, max]) => {
          onMinChange(min)
          onMaxChange(max)
        }}
      />
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
  const [networkAffiliateFilter, setNetworkAffiliateFilter] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')

  const podRateBounds = getRateBounds(pods.map((pod) => pod.rate))
  const talentRateBounds = getRateBounds(talentProfiles.map((profile) => profile.rate))
  const [minRateFilter, setMinRateFilter] = useState(talentRateBounds.min)
  const [maxRateFilter, setMaxRateFilter] = useState(talentRateBounds.max)

  const isPodTab = activeTab === 'pods'
  const activeRateBounds = isPodTab ? podRateBounds : talentRateBounds

  const pageSize = pageSizes[activeTab]
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const normalizedMarket = marketFilter.toLowerCase()
  const normalizedExpertise = expertiseFilter.toLowerCase()
  const normalizedNetworkAffiliate = networkAffiliateFilter.toLowerCase()
  const normalizedIndustry = industryFilter.toLowerCase()
  const normalizedRole = roleFilter.toLowerCase()

  const networkAffiliateOptions = getUniqueOptions(
    talentProfiles.flatMap((profile) => profile.networkAffiliations ?? [])
  )
  const industryOptions = getUniqueOptions(talentProfiles.map((profile) => profile.industry))
  const roleOptions = getUniqueOptions(
    talentProfiles.map((profile) => getTalentTitle(profile))
  )
  const marketOptions = getUniqueOptions(pods.flatMap((pod) => pod.markets))

  useEffect(() => {
    setMinRateFilter(activeRateBounds.min)
    setMaxRateFilter(activeRateBounds.max)
  }, [activeTab, activeRateBounds.min, activeRateBounds.max])

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
    const endingRate = getEndingRate(p.rate) || startingRate
    const matchesRate = endingRate >= minRateFilter && startingRate <= maxRateFilter
    return matchesSearch && matchesMarket && matchesExpertise && matchesRate
  })

  const filteredTalent = talentProfiles.filter(t => {
    const talentTitle = getTalentTitle(t)
    const matchesSearch = !normalizedSearch ||
      includesText(t.name, normalizedSearch) ||
      includesText(talentTitle, normalizedSearch) ||
      includesText(t.bg, normalizedSearch) ||
      includesText(t.industry, normalizedSearch) ||
      (t.disciplines ?? []).some((discipline) => includesText(discipline, normalizedSearch))
    const matchesNetworkAffiliate =
      networkAffiliateFilter === 'All' ||
      (t.networkAffiliations ?? []).some((affiliate) => affiliate.toLowerCase() === normalizedNetworkAffiliate)
    const matchesIndustry = industryFilter === 'All' || includesText(t.industry, normalizedIndustry)
    const matchesRole =
      roleFilter === 'All' ||
      getTalentTitle(t).toLowerCase() === normalizedRole
    const startingRate = getStartingRate(t.rate)
    const endingRate = getEndingRate(t.rate) || startingRate
    const matchesRate = endingRate >= minRateFilter && startingRate <= maxRateFilter
    return matchesSearch && matchesNetworkAffiliate && matchesIndustry && matchesRole && matchesRate
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
        <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-2">Search</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-none">Talent & Pods</h1>
      </div>

      <SLABadge variant="banner" className="mb-6" />

      <Tabs value={activeTab} onValueChange={(val) => selectTab(val as DiscoverTab)} className="w-full min-w-0">
        <div className="mb-8 w-full overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="flex w-max min-w-full justify-start">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
            </TabsTrigger>
            <TabsTrigger value="pods" className="flex items-center gap-2">
              Pods
            </TabsTrigger>
            <TabsTrigger value="build" className="flex items-center gap-2">
              Build a pod
              {selectedIds.size > 0 && (
                <span className="font-mono text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {selectedIds.size}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {/* Filter Section */}
          <section className="mb-8 p-1.5 bg-muted rounded-2xl flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none" />
              <input
                type="text"
                placeholder="Search talent..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); }}
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary/30 transition-all font-text text-[15px]"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <FilterSelect
                label="Network affiliate"
                options={networkAffiliateOptions}
                value={networkAffiliateFilter}
                onChange={(val) => { setNetworkAffiliateFilter(val); setActivePage(1); }}
              />
              <FilterSelect
                label="Industry"
                options={industryOptions}
                value={industryFilter}
                onChange={(val) => { setIndustryFilter(val); setActivePage(1); }}
              />
              <FilterSelect
                label="Role"
                options={roleOptions}
                value={roleFilter}
                onChange={(val) => { setRoleFilter(val); setActivePage(1); }}
              />
            </div>

            <FilterPopover
              activeCount={[
                networkAffiliateFilter !== 'All',
                industryFilter !== 'All',
                roleFilter !== 'All',
                minRateFilter !== talentRateBounds.min || maxRateFilter !== talentRateBounds.max,
              ].filter(Boolean).length}
              onReset={() => {
                setSearchQuery('')
                setNetworkAffiliateFilter('All')
                setIndustryFilter('All')
                setRoleFilter('All')
                setMinRateFilter(talentRateBounds.min)
                setMaxRateFilter(talentRateBounds.max)
              }}
            >
              <FilterSelect
                label="Network affiliate"
                options={networkAffiliateOptions}
                value={networkAffiliateFilter}
                onChange={(val) => { setNetworkAffiliateFilter(val); setActivePage(1); }}
              />
              <FilterSelect
                label="Industry"
                options={industryOptions}
                value={industryFilter}
                onChange={(val) => { setIndustryFilter(val); setActivePage(1); }}
              />
              <FilterSelect
                label="Role"
                options={roleOptions}
                value={roleFilter}
                onChange={(val) => { setRoleFilter(val); setActivePage(1); }}
              />
              <PopoverRateSlider
                label="Hourly rate"
                absoluteMin={talentRateBounds.min}
                absoluteMax={talentRateBounds.max}
                minValue={minRateFilter}
                maxValue={maxRateFilter}
                onMinChange={(value) => { setMinRateFilter(Math.min(value, maxRateFilter)); setActivePage(1); }}
                onMaxChange={(value) => { setMaxRateFilter(Math.max(value, minRateFilter)); setActivePage(1); }}
              />
            </FilterPopover>
          </section>

          {filteredTalent.length === 0 ? (
            <div className="py-20 text-center bg-background border border-dashed border-border rounded-2xl">
              <p className="font-text text-muted-foreground/70">No results for your current filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setNetworkAffiliateFilter('All')
                  setIndustryFilter('All')
                  setRoleFilter('All')
                  setMinRateFilter(talentRateBounds.min)
                  setMaxRateFilter(talentRateBounds.max)
                }}
                className="mt-4 text-primary text-sm font-semibold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {visibleTalent.map((profile) => {
                const selected = selectedIds.has(profile.id)
                return (
                  <article
                    key={profile.id}
                    className={`relative border rounded-xl p-5 bg-background transition-all group flex flex-col ${selected ? 'border-primary shadow-md' : 'border-border hover:border-input hover:shadow-lg'}`}
                  >
                    {/* Add/remove toggle */}
                    <button
                      type="button"
                      onClick={() => toggleSelect(profile.id)}
                      className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground/70 hover:bg-primary/10 hover:text-primary'}`}
                      aria-label={selected ? 'Remove from pod' : 'Add to pod'}
                    >
                      {selected ? <Check size={12} strokeWidth={2.5} /> : <Plus size={12} strokeWidth={2} />}
                    </button>

                    <Link
                      href={`/client/dashboard/search/talent/${profile.id}`}
                      className="flex flex-col flex-1"
                    >
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
                        {profile.highlights?.[0] && (
                          <p className="font-text text-[11px] text-muted-foreground/70 mt-2 leading-snug line-clamp-2">
                            {profile.highlights[0]}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        <ShieldCheck size={12} className="text-primary shrink-0" strokeWidth={2.5} />
                        {(profile.networkAffiliations ?? []).length > 0 && (
                          <NetworkAffiliateBadge affiliations={profile.networkAffiliations!} size={12} />
                        )}
                        <span
                          aria-label="LinkedIn"
                          className="inline-flex items-center justify-center text-[#0A66C2]"
                        >
                          <FaLinkedin size={12} aria-hidden="true" />
                        </span>
                        {profile.ndaSigned && (
                          <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full">
                            NDA
                          </span>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-muted flex items-center justify-between gap-2 text-muted-foreground font-text text-[11px]">
                        <div className="flex items-center gap-2 truncate">
                          <MapPin size={10} className="text-input" />
                          <span className="truncate">{profile.bg}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <SLABadge variant="chip" />
                          <span className="flex items-center gap-1 font-semibold text-foreground">
                            <DollarSign size={10} className="text-input" />
                            {profile.rate}
                          </span>
                        </div>
                      </div>
                    </Link>

                  </article>
                )
              })}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setActivePage} />
          )}
        </TabsContent>

        <TabsContent value="pods" className="mt-0">
          {/* Filter Section */}
          <section className="mb-8 p-1.5 bg-muted rounded-2xl flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none" />
              <input
                type="text"
                placeholder="Search pods..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); }}
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary/30 transition-all font-text text-[15px]"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <FilterSelect
                label="All markets"
                options={marketOptions}
                value={marketFilter}
                onChange={(val) => { setMarketFilter(val); setActivePage(1); }}
              />
              <FilterSelect
                label="Expertise"
                options={['Fintech', 'Growth', 'Strategy', 'Brand', 'Market Entry']}
                value={expertiseFilter}
                onChange={(val) => { setExpertiseFilter(val); setActivePage(1); }}
              />
            </div>

            <FilterPopover
              activeCount={[
                marketFilter !== 'All',
                expertiseFilter !== 'All',
                minRateFilter !== podRateBounds.min || maxRateFilter !== podRateBounds.max,
              ].filter(Boolean).length}
              onReset={() => {
                setSearchQuery('')
                setMarketFilter('All')
                setExpertiseFilter('All')
                setMinRateFilter(podRateBounds.min)
                setMaxRateFilter(podRateBounds.max)
              }}
            >
              <FilterSelect
                label="All markets"
                options={marketOptions}
                value={marketFilter}
                onChange={(val) => { setMarketFilter(val); setActivePage(1); }}
              />
              <FilterSelect
                label="Expertise"
                options={['Fintech', 'Growth', 'Strategy', 'Brand', 'Market Entry']}
                value={expertiseFilter}
                onChange={(val) => { setExpertiseFilter(val); setActivePage(1); }}
              />
              <PopoverRateSlider
                label="Pod rate"
                absoluteMin={podRateBounds.min}
                absoluteMax={podRateBounds.max}
                minValue={minRateFilter}
                maxValue={maxRateFilter}
                onMinChange={(value) => { setMinRateFilter(Math.min(value, maxRateFilter)); setActivePage(1); }}
                onMaxChange={(value) => { setMaxRateFilter(Math.max(value, minRateFilter)); setActivePage(1); }}
              />
            </FilterPopover>
          </section>

          {filteredPods.length === 0 ? (
            <div className="py-20 text-center bg-background border border-dashed border-border rounded-2xl">
              <p className="font-text text-muted-foreground/70">No results for your current filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setMarketFilter('All')
                  setExpertiseFilter('All')
                  setMinRateFilter(podRateBounds.min)
                  setMaxRateFilter(podRateBounds.max)
                }}
                className="mt-4 text-primary text-sm font-semibold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
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
                      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-1 truncate">{pod.focus}</p>
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
                            className={`aspect-square rounded-lg flex items-center justify-center font-display font-black text-[16px] transition-all duration-300 border overflow-hidden relative ${i === 0 && !profile.image
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
          )}

          {totalPages > 1 && (
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setActivePage} />
          )}
        </TabsContent>

        <TabsContent value="build" className="mt-0">
          <BuildTab
            memberIds={[...selectedIds]}
            talentProfiles={talentProfiles}
            onRemove={(id) => toggleSelect(id)}
            onAddMore={() => selectTab('all')}
            openBriefs={jobs.filter(j => j.status !== 'Completed')}
          />
        </TabsContent>
      </Tabs>

      {/* Pod builder tray */}
      {activeTab !== 'build' && selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 bg-foreground text-background rounded-2xl shadow-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-5 sm:min-w-[480px] sm:max-w-[640px]">
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
              Build pod
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function BuildTab({
  memberIds,
  talentProfiles,
  onRemove,
  onAddMore,
  openBriefs,
}: {
  memberIds: string[]
  talentProfiles: User[]
  onRemove: (id: string) => void
  onAddMore: () => void
  openBriefs: import('@/lib/jobs').Job[]
}) {
  const [podName, setPodName] = useState('')
  const [briefSlug, setBriefSlug] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [createdPodName, setCreatedPodName] = useState('')
  const [memberRoles, setMemberRoles] = useState<Record<string, string>>({})

  const members = memberIds
    .map(id => talentProfiles.find(p => p.id === id) ?? (() => { try { return getTalentProfile(id) } catch { return null } })())
    .filter((p): p is User => p !== null && p !== undefined)

  const handleSubmit = async () => {
    if (!podName.trim() || members.length === 0) return
    setSubmitting(true)
    try {
      const podSlug = podName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
      const newPod = await createPod({
        slug: podSlug,
        name: podName.trim(),
        focus: '',
        summary: '',
        leadId: members[0].id,
        memberIds,
        memberRoles: memberIds.map(id => ({ userId: id, role: memberRoles[id] ?? '' })).filter(r => r.role),
        markets: [],
        evidence: [],
        availability: 'Within 7 days',
        rate: '',
      })
      if (briefSlug) {
        const job = openBriefs.find(j => j.slug === briefSlug)
        if (job) await updateJob(job.id, { podSlug: newPod.slug })
      }
      setCreatedPodName(podName.trim())
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to create pod:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-24 text-center max-w-[480px] mx-auto">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
        </div>
        <h2 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground mb-3">Pod created</h2>
        <p className="font-text text-muted-foreground mb-8">
          <strong className="text-foreground">{createdPodName}</strong> has been saved. Your account lead will confirm fit and schedule intro calls within 48 hours.
        </p>
        <Link href="/client/dashboard/search" className="font-text text-sm font-semibold px-6 py-3 bg-foreground text-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]">
          View pods
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
              <button onClick={onAddMore} className="font-text text-xs text-primary hover:underline">Browse talent</button>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map(profile => (
                <div key={profile.id} className="flex items-start gap-3 p-3 border border-border rounded-xl group hover:border-input transition-colors">
                  <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-display font-black text-[12px] text-background overflow-hidden relative ${profile.color || 'bg-foreground'}`}>
                    {profile.image ? <Image src={profile.image} alt={profile.name} fill className="object-cover" /> : profile.initials}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="font-display font-black text-[14px] text-foreground leading-tight">{profile.name}</p>
                    <p className="font-text text-[11px] text-muted-foreground truncate">{getTalentTitle(profile)}</p>
                    <select
                      value={memberRoles[profile.id] ?? ''}
                      onChange={e => setMemberRoles(prev => ({ ...prev, [profile.id]: e.target.value }))}
                      className="w-full text-[11px] font-text border border-border rounded-lg px-2 py-1.5 bg-muted text-foreground focus:outline-none focus:border-primary/40 transition-colors"
                    >
                      <option value="">Assign pod role…</option>
                      {POD_MEMBER_ROLES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => onRemove(profile.id)}
                    className="w-6 h-6 rounded-full bg-muted hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-muted-foreground/70 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-1"
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
          <p className="font-text text-[11px] text-muted-foreground/70 mt-2">For your reference only &mdash; not shared with operators.</p>
        </section>

        {/* Attach to brief */}
        <section className="bg-background border border-border rounded-2xl p-6">
          <h2 className="font-display font-black text-[18px] tracking-[-0.02em] text-foreground mb-1">Attach to a brief</h2>
          <p className="font-text text-[12px] text-muted-foreground/70 mb-4">Optional &mdash; you can attach later from the brief page.</p>
          <div className="space-y-2">
            <button
              onClick={() => setBriefSlug('')}
              className={`w-full text-left px-4 py-3 border rounded-xl font-text text-sm transition-colors ${briefSlug === '' ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-border text-muted-foreground hover:border-input'}`}
            >
              No brief yet &mdash; submit for review only
            </button>
            {openBriefs.map(job => (
              <button
                key={job.slug}
                onClick={() => setBriefSlug(job.slug)}
                className={`w-full text-left px-4 py-3 border rounded-xl transition-colors ${briefSlug === job.slug ? 'border-primary bg-primary/5' : 'border-border hover:border-input'}`}
              >
                <p className={`font-text text-sm font-semibold ${briefSlug === job.slug ? 'text-primary' : 'text-foreground'}`}>{job.title}</p>
                <p className="font-text text-[11px] text-muted-foreground/70 mt-0.5">{getClientUser(job.clientId).name} · {job.status}</p>
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
              <div key={p.id} className={`w-10 h-10 rounded-full border-2 border-foreground shrink-0 flex items-center justify-center font-display font-black text-[11px] text-background overflow-hidden relative ${p.color || 'bg-primary'}`}>
                {p.image ? <Image src={p.image} alt={p.name} fill className="object-cover" /> : p.initials}
              </div>
            ))}
          </div>
          <p className="font-display font-black text-[18px] leading-tight text-background mb-1">
            {podName || <span className="text-background/30 italic text-[16px]">Unnamed pod</span>}
          </p>
          <p className="font-text text-[12px] text-background/50">
            {members.length} operator{members.length !== 1 ? 's' : ''}
            {briefSlug ? ` · ${openBriefs.find(j => j.slug === briefSlug)?.title}` : ''}
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || !podName.trim() || members.length === 0}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-full font-text text-sm font-semibold hover:bg-foreground transition-colors duration-[120ms] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating pod…' : 'Submit pod for review'}
        </button>
        <p className="font-text text-[11px] text-muted-foreground/70 text-center">Your account lead reviews fit within 48 hours.</p>
      </aside>
    </div>
  )
}
