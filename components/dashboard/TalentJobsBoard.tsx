'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronDown, Clock, MapPin, Search } from 'lucide-react'
import ClientAvatar from '@/components/dashboard/ClientAvatar'
import type { Job, JobStatus, JobType } from '@/lib/jobs'
import { resolveClientUser, useUsers } from '@/lib/user'

type JobsBoardVariant = 'discover' | 'assigned'
type FilterKey = 'all' | 'open' | 'active'

const statusStyles: Record<JobStatus, string> = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-primary/10 text-primary border-primary/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-border text-muted-foreground border-input',
  Completed: 'bg-border text-muted-foreground border-input',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
}

const secondaryFilter: Record<JobsBoardVariant, { key: Exclude<FilterKey, 'all'>; label: string }> = {
  discover: { key: 'open', label: 'Open' },
  assigned: { key: 'active', label: 'Active' },
}

function filterJobs(jobs: Job[], filter: FilterKey) {
  if (filter === 'open') return jobs.filter((job) => ['Scoping', 'Pod review'].includes(job.status))
  if (filter === 'active') return jobs.filter((job) => job.status === 'Active')
  return jobs
}

function matchesSearch(job: Job, search: string, clientName: string) {
  if (!search) return true
  const haystack = [job.title, job.summary, job.type, job.status, job.location, clientName, ...job.tags]
    .join(' ').toLowerCase()
  return haystack.includes(search.toLowerCase())
}

function FilterDropdown({
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
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
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
        <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {['All', ...options].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false) }}
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

export default function TalentJobsBoard({
  jobs,
  title,
  countLabel,
  baseHref = '/talent/dashboard/jobs',
  variant = 'discover',
  searchPlaceholder = 'Search roles...',
  emptyLabel = 'jobs',
}: {
  jobs: Job[]
  title: string
  countLabel: string
  baseHref?: string
  variant?: JobsBoardVariant
  searchPlaceholder?: string
  emptyLabel?: string
}) {
  const { users } = useUsers()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [tagFilter, setTagFilter] = useState('All')

  const secondary = secondaryFilter[variant]
  const secondaryCount = filterJobs(jobs, secondary.key).length

  // Derive filter options from actual job data
  const locationOptions = Array.from(new Set(jobs.map(j => j.location).filter(Boolean))).sort()
  const tagOptions = Array.from(new Set(jobs.flatMap(j => j.tags))).sort()
  const jobsWithClients = jobs.map((job) => ({
    job,
    client: resolveClientUser(job.clientId, users),
  }))

  const filteredJobs = jobsWithClients
    .filter(({ job }) => filterJobs([job], filter).length > 0)
    .filter(({ job, client }) => matchesSearch(job, search.trim(), client.name))
    .filter(({ job }) => typeFilter === 'All' || job.type === typeFilter)
    .filter(({ job }) => locationFilter === 'All' || job.location === locationFilter)
    .filter(({ job }) => tagFilter === 'All' || job.tags.includes(tagFilter))

  const hasActiveFilters = search || typeFilter !== 'All' || locationFilter !== 'All' || tagFilter !== 'All'

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-[1240px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-display font-black text-[18px] tracking-[-0.03em] text-foreground leading-none md:text-[20px]">{title}</h1>
        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground/70 font-mono text-[10px] uppercase tracking-wider">
          {countLabel}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-border">
        {([['all', 'All'], [secondary.key, secondary.label]] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key as FilterKey)}
            className={`pb-4 font-display font-black text-[16px] tracking-[-0.01em] transition-all relative inline-flex items-center gap-2 ${
              filter === key ? 'text-primary' : 'text-muted-foreground/70 hover:text-foreground'
            }`}
          >
            {label}
            {key === secondary.key && secondaryCount > 0 && (
              <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{secondaryCount}</span>
            )}
            {filter === key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <section className="mb-8 p-1.5 bg-muted rounded-2xl flex flex-col lg:flex-row gap-2 max-w-[1040px]">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary/30 transition-all font-text text-[15px]"
          />
        </div>
        <div className="flex items-center gap-2 px-2 overflow-x-auto no-scrollbar">
          <FilterDropdown
            label="Type"
            options={['RETAINED', 'PROJECT', 'EQUITY'] satisfies JobType[]}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          <FilterDropdown
            label="Location"
            options={locationOptions}
            value={locationFilter}
            onChange={setLocationFilter}
          />
          <FilterDropdown
            label="Tag"
            options={tagOptions}
            value={tagFilter}
            onChange={setTagFilter}
          />
        </div>
      </section>

      {/* List */}
      {filteredJobs.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="font-text text-muted-foreground/70">No {filter === 'all' ? emptyLabel : secondary.label.toLowerCase()} found.</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => { setSearch(''); setTypeFilter('All'); setLocationFilter('All'); setTagFilter('All') }}
              className="mt-4 text-primary text-sm font-semibold hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-[1040px]">
          {filteredJobs.map(({ job, client }) => {
            const dateLabel = job.updatedAt.replace(/^Updated\s*/i, '')

            return (
              <Link
                key={job.id}
                href={`${baseHref}/${job.slug}`}
                className="group border border-border rounded-2xl p-3 sm:p-6 bg-background hover:border-input hover:shadow-xl transition-all"
              >
                {/* Header row: avatar + meta + arrow */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <ClientAvatar client={client} sizeClass="w-10 h-10 sm:w-11 sm:h-11" iconSize={18} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm shrink-0 ${statusStyles[job.status]}`}>
                        {job.status}
                      </span>
                      <span className="font-display font-black text-[10px] text-muted-foreground/70 uppercase tracking-widest truncate">{client.name}</span>
                    </div>
                    <h2 className="font-display font-black text-[16px] sm:text-[18px] tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 px-2 py-0.5 border border-muted rounded-sm bg-muted/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Desktop rate column */}
                  <div className="shrink-0 text-right hidden sm:block">
                    <div className="font-display font-black text-[16px] text-foreground leading-none mb-1">{job.rate}</div>
                    <div className="flex items-center gap-3 justify-end text-[11px] text-muted-foreground/70">
                      <span className="flex items-center gap-1"><Clock size={11} strokeWidth={1.5} /> {job.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} strokeWidth={1.5} /> {job.location}</span>
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-1.5">{dateLabel}</div>
                  </div>
                  <ArrowUpRight size={16} className="text-input group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>

                {/* Mobile-only rate/meta row */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50 sm:hidden">
                  <span className="font-display font-black text-[14px] text-foreground">{job.rate}</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70"><Clock size={10} strokeWidth={1.5} /> {job.time}</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70"><MapPin size={10} strokeWidth={1.5} /> {job.location}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 ml-auto">{dateLabel}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
