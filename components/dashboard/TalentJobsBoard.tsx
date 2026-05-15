'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Briefcase, CalendarDays, Clock, Flag, MapPin, Search, Users } from 'lucide-react'
import type { Job, JobStatus } from '@/lib/jobs'
import { getClientUser } from '@/lib/user'

type JobsBoardVariant = 'discover' | 'assigned'
type FilterKey = 'all' | 'open' | 'active'

const statusStyles: Record<JobStatus, string> = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-blue/10 text-blue border-blue/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-ink-10 text-ink-60 border-ink-20',
  Completed: 'bg-ink-10 text-ink-60 border-ink-20',
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

function matchesSearch(job: Job, search: string) {
  if (!search) return true

  const clientName = getClientUser(job.clientId).name
  const haystack = [
    job.title,
    job.summary,
    job.type,
    job.status,
    job.location,
    clientName,
    ...job.tags,
  ].join(' ').toLowerCase()

  return haystack.includes(search.toLowerCase())
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
  const [filter, setFilter] = useState<FilterKey>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')

  const secondary = secondaryFilter[variant]
  const filteredJobs = filterJobs(jobs, filter).filter((job) => matchesSearch(job, search.trim()))
  const secondaryCount = filterJobs(jobs, secondary.key).length

  return (
    <div className="px-8 py-8 max-w-[1240px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">{title}</h1>
            <span className="px-2 py-0.5 rounded-full bg-ink-5 text-ink-40 font-mono text-[10px] uppercase tracking-wider">
              {countLabel}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="inline-flex p-1 bg-ink-5 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-md font-text text-xs font-semibold transition-all ${
                  filter === 'all' ? 'bg-paper text-ink shadow-sm' : 'text-ink-40 hover:text-ink'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter(secondary.key)}
                className={`px-4 py-1.5 rounded-md font-text text-xs font-semibold transition-all flex items-center gap-2 ${
                  filter === secondary.key ? 'bg-paper text-blue shadow-sm' : 'text-ink-40 hover:text-ink'
                }`}
              >
                {secondary.label}
                {secondaryCount > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full ${filter === secondary.key ? 'bg-blue' : 'bg-ink-20'}`} />
                )}
              </button>
            </div>

            <div className="inline-flex p-1 bg-ink-5 rounded-lg w-fit border border-ink-10/50">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'grid' ? 'bg-paper text-blue shadow-sm' : 'text-ink-40 hover:text-ink'
                }`}
                title="Grid View"
              >
                <Briefcase size={16} />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'list' ? 'bg-paper text-blue shadow-sm' : 'text-ink-40 hover:text-ink'
                }`}
                title="List View"
              >
                <Users size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-40" size={16} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2.5 bg-paper border border-ink-10 rounded-full font-text text-sm focus:outline-none focus:border-blue transition-colors w-64"
          />
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const client = getClientUser(job.clientId)

            return (
              <Link
                key={job.id}
                href={`${baseHref}/${job.slug}`}
                className="border border-ink-10 rounded-2xl p-6 bg-paper hover:border-ink-20 hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-ink-5 border border-ink-10 flex items-center justify-center text-ink-20 group-hover:text-blue transition-colors shrink-0 font-display font-black text-sm">
                    {client.name[0]}
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[job.status]}`}>
                    {job.status}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-display font-black text-[14px] text-ink-40 uppercase tracking-widest mb-1">{client.name}</h3>
                  <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors leading-tight">
                    {job.title}
                  </h2>
                  <p className="font-text text-[15px] leading-relaxed text-ink-60 mt-4 line-clamp-3">{job.summary}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-6 mb-8">
                  {job.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[9px] uppercase tracking-eyebrow text-ink-40 px-2 py-0.5 border border-ink-5 rounded-sm bg-ink-5/30">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-5 border-t border-ink-5">
                  <div className="grid grid-cols-2 gap-4 text-[11px] text-ink-40 mb-4">
                    <span className="flex items-center gap-2"><Clock size={12} strokeWidth={1.5} /> {job.time}</span>
                    <span className="flex items-center gap-2"><MapPin size={12} strokeWidth={1.5} /> {job.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-[14px] text-ink">{job.rate}</span>
                    <ArrowUpRight size={16} className="text-ink-20 group-hover:text-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-[1040px]">
          {filteredJobs.map((job) => {
            const client = getClientUser(job.clientId)

            return (
              <Link
                key={job.id}
                href={`${baseHref}/${job.slug}`}
                className="group block border border-ink-10 rounded-xl p-7 bg-paper hover:border-blue transition-all duration-300"
              >
                <article>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[job.status]}`}>
                          {job.status}
                        </span>
                        <span className="font-display font-black text-[10px] text-ink-40 uppercase tracking-widest ml-2">{client.name}</span>
                      </div>
                      <h2 className="font-display font-black text-[24px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors">
                        {job.title}
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-black text-[20px] text-ink leading-none">{job.rate}</div>
                      <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mt-1">Compensation</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-blue shrink-0" />
                      <span className="font-text text-[15px] font-semibold text-ink-60">{job.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-blue shrink-0" />
                      <span className="font-text text-[15px] font-semibold text-ink-60">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag size={18} className="text-blue shrink-0" />
                      <span className="font-text text-[15px] font-semibold text-ink-60">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} className="text-blue shrink-0" />
                      <span className="font-text text-[15px] font-semibold text-ink-60">{job.updatedAt}</span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}

      {filteredJobs.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-ink-10 rounded-2xl">
          <p className="font-text text-ink-40">No {filter === 'all' ? emptyLabel : secondary.label.toLowerCase()} found.</p>
        </div>
      )}
    </div>
  )
}
