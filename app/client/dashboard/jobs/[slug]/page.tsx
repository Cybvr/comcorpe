'use client'

import { useState, use, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound, usePathname, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Briefcase,
  Clock,
  MapPin,
  Target,
  LayoutDashboard,
  Users2,
  FileText,
  Upload,
  Plus,
  Search,
  X,
  Check,
  CreditCard,
  ShieldCheck,
  Download,
  Pencil,
  Pause,
  Play,
  Share2,
  Link2,
} from 'lucide-react'
import { usePods, getPodMembers } from '@/lib/pods'
import NetworkAffiliateBadge from '@/components/dashboard/NetworkAffiliateBadge'
import { getTalentProfile, useUsers } from '@/lib/user'
import { getJobProgress, type JobDocument } from '@/lib/jobs'
import { useJobBySlug } from '@/lib/jobs'
import { updateJob, createPod } from '@/lib/admin/store'
import { invoices, getInvoice } from '@/lib/invoices'
import { contractTerms } from '@/lib/contract'
import { storage, db } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const statusStyles: Record<string, string> = {
  'Active': 'bg-green-50 text-green-700 border-green-100',
  'Completed': 'bg-primary/10 text-primary border-primary/20',
  'Paused': 'bg-orange-50 text-orange-700 border-orange-100',
  'Scoping': 'bg-border text-muted-foreground border-border',
  'Pod review': 'bg-accent/10 text-accent border-accent/20',
  'Cancelled': 'bg-red-50 text-red-600 border-red-200',
}

const jobTabs = ['brief', 'milestones', 'pod', 'knowledge', 'payments', 'contract'] as const
type JobTab = (typeof jobTabs)[number]

function isJobTab(value: string | null): value is JobTab {
  return value !== null && (jobTabs as readonly string[]).includes(value)
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { job, loading } = useJobBySlug(slug)
  const { pods: livePods } = usePods()

  const [jobStatus, setJobStatus] = useState('Scoping')
  const [localMilestones, setLocalMilestones] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmails, setShareEmails] = useState('')
  const [shareDescription, setShareDescription] = useState('')
  const [sharePermission, setSharePermission] = useState<'view' | 'edit'>('view')
  const [shareSent, setShareSent] = useState(false)
  const [showCreatePod, setShowCreatePod] = useState(false)
  const [podName, setPodName] = useState('')
  const [podMemberSearch, setPodMemberSearch] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [creatingPod, setCreatingPod] = useState(false)
  const { users: allUsers } = useUsers()

  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '', amount: '' })
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([])
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (job) {
      setJobStatus(job.status)
      setLocalMilestones(job.milestones || [])
    }
  }, [job])

  if (loading) {
    return (
      <div className="w-full max-w-[1040px] mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded mb-8" />
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-8 w-72 bg-muted rounded" />
            <div className="h-3 w-48 bg-muted rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-muted rounded-full" />
            <div className="h-10 w-24 bg-muted rounded-full" />
            <div className="h-10 w-10 bg-muted rounded-full" />
          </div>
        </div>
        <div className="h-10 w-full bg-muted rounded mb-8" />
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-8">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-4/6 bg-muted rounded" />
          </div>
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  if (!job) {
    notFound()
  }

  const assignedPod = job.podSlug ? (livePods.find(p => p.slug === job.podSlug) ?? null) : null
  const assignedPodMembers = assignedPod ? getPodMembers(assignedPod) : []
  const primaryPods = livePods.slice(0, 2)
  const requestedTab = searchParams.get('tab')
  const activeTab = isJobTab(requestedTab) ? requestedTab : 'brief'
  const podMemberQuery = podMemberSearch.trim().toLowerCase()
  const talentUsers = allUsers.filter(user => user.role === 'talent')
  const filteredTalentUsers = podMemberQuery
    ? talentUsers.filter(user =>
        user.name.toLowerCase().includes(podMemberQuery) ||
        (user.talentRole ?? '').toLowerCase().includes(podMemberQuery) ||
        (user.bg ?? '').toLowerCase().includes(podMemberQuery) ||
        (user.location ?? '').toLowerCase().includes(podMemberQuery)
      )
    : talentUsers

  function tabHref(tab: JobTab) {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'brief') {
      params.delete('tab')
    } else {
      params.set('tab', tab)
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleSendInvite = () => {
    setShareSent(true)
    setTimeout(() => {
      setShareSent(false)
      setShowShareModal(false)
      setShareEmails('')
      setShareDescription('')
      setSharePermission('view')
    }, 1400)
  }

  const handleCreatePod = async () => {
    if (!podName.trim() || selectedMemberIds.length === 0) return
    setCreatingPod(true)
    const slug = podName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
    const newPod = await createPod({
      slug,
      name: podName.trim(),
      focus: '',
      summary: '',
      leadId: selectedMemberIds[0],
      memberIds: selectedMemberIds,
      markets: [],
      evidence: [],
      availability: '',
      rate: '',
    })
    await updateJob(job.id, { podSlug: newPod.slug })
    setCreatingPod(false)
    setShowCreatePod(false)
    setPodName('')
    setPodMemberSearch('')
    setSelectedMemberIds([])
  }

  const handlePause = async () => {
    await updateJob(job.id, { status: 'Paused' })
    setJobStatus('Paused')
  }

  const handleResume = async () => {
    await updateJob(job.id, { status: 'Active' })
    setJobStatus('Active')
  }

  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.date) return
    const id = `m_custom_${Date.now()}`
    const rawAmount = newMilestone.amount.replace(/[^0-9.]/g, '')
    const formattedAmount = rawAmount
      ? `$${parseInt(rawAmount).toLocaleString()}`
      : '—'
    const [y, m, d] = newMilestone.date.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const formattedDate = y && m && d ? `${parseInt(d)} ${months[parseInt(m)-1]} ${y}` : newMilestone.date
    const ms: any = {
      id,
      title: newMilestone.title,
      date: formattedDate,
      status: 'pending',
      amount: formattedAmount,
    }
    setLocalMilestones([...localMilestones, ms])
    setNewMilestone({ title: '', date: '', amount: '' })
    setIsAddingMilestone(false)
  }

  const handleDeleteMilestone = (id: string) => {
    setLocalMilestones(prev => prev.filter(m => m.id !== id))
  }

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      const storagePath = `jobs/${slug}/documents/${Date.now()}-${file.name}`
      const storageRef = ref(storage, storagePath)
      const task = uploadBytesResumable(storageRef, file)

      setUploadingFiles(prev => [...prev, { name: file.name, progress: 0 }])

      task.on(
        'state_changed',
        snap => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: pct } : f))
        },
        err => {
          console.error('Upload failed:', err)
          setUploadingFiles(prev => prev.filter(f => f.name !== file.name))
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          const sizeKb = file.size / 1024
          const sizeStr = sizeKb >= 1024
            ? `${(sizeKb / 1024).toFixed(1)}MB`
            : `${Math.round(sizeKb)}KB`
          const newDoc: JobDocument = {
            name: file.name,
            size: sizeStr,
            url,
            storagePath,
            uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          }
          await updateDoc(doc(db, 'jobs', slug), { documents: arrayUnion(newDoc) })
          setUploadingFiles(prev => prev.filter(f => f.name !== file.name))
        }
      )
    })
  }

  const handleDeleteDoc = async (document: JobDocument) => {
    setDeletingDoc(document.storagePath)
    try {
      await deleteObject(ref(storage, document.storagePath))
    } catch {
      // File may already be gone from storage; still remove from Firestore
    }
    await updateDoc(doc(db, 'jobs', slug), { documents: arrayRemove(document) })
    setDeletingDoc(null)
  }

  const jobUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/client/dashboard/jobs"
              aria-label="Back to briefs"
              title="Back to briefs"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-input hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} />
            </Link>
            <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 rounded-sm border ${statusStyles[jobStatus as keyof typeof statusStyles]}`}>
              {jobStatus}
            </span>
          </div>
          <h1 className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-tight">{job.title}</h1>
        </div>
        {jobStatus !== 'Completed' && jobStatus !== 'Cancelled' && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-background border border-border rounded-full font-text text-sm font-semibold hover:border-input transition-colors"
            >
              <Share2 size={14} /> Share
            </button>
            <Link href={`/client/dashboard/jobs/${job.slug}/edit`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-background border border-border rounded-full font-text text-sm font-semibold hover:border-input transition-colors">
              <Pencil size={14} />
              Edit
            </Link>
            {jobStatus !== 'Paused' && (
              <button
                onClick={handlePause}
                aria-label="Pause engagement"
                title="Pause engagement"
                className="inline-flex h-10 w-10 items-center justify-center bg-foreground text-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms]"
              >
                <Pause size={16} />
              </button>
            )}
            {jobStatus === 'Paused' && (
              <button
                onClick={handleResume}
                aria-label="Resume engagement"
                title="Resume engagement"
                className="inline-flex h-10 w-10 items-center justify-center bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-[120ms]"
              >
                <Play size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-[520px] rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="font-display text-lg font-black tracking-tight text-foreground">Share job</h2>
                <p className="font-text text-xs text-muted-foreground mt-0.5">{job.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close share modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 block mb-2">People</label>
                <textarea
                  value={shareEmails}
                  onChange={e => setShareEmails(e.target.value)}
                  rows={2}
                  placeholder="Add emails separated by commas"
                  className="w-full resize-none rounded-xl border border-border bg-muted/40 px-4 py-3 font-text text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-muted-foreground/50"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 block mb-2">Description</label>
                <textarea
                  value={shareDescription}
                  onChange={e => setShareDescription(e.target.value)}
                  rows={4}
                  placeholder="Add context for the people you are inviting..."
                  className="w-full resize-none rounded-xl border border-border bg-muted/40 px-4 py-3 font-text text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-muted-foreground/50"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 block mb-2">Access</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSharePermission('view')}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      sharePermission === 'view' ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-foreground hover:border-input'
                    }`}
                  >
                    <span className="block font-text text-sm font-semibold">Can view</span>
                    <span className="block font-text text-[11px] opacity-70 mt-0.5">Read-only access</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSharePermission('edit')}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      sharePermission === 'edit' ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-foreground hover:border-input'
                    }`}
                  >
                    <span className="block font-text text-sm font-semibold">Can edit</span>
                    <span className="block font-text text-[11px] opacity-70 mt-0.5">Update the brief</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
                <input readOnly value={jobUrl} className="min-w-0 flex-1 bg-transparent font-text text-xs text-muted-foreground focus:outline-none" />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-text text-xs font-semibold text-foreground hover:bg-background transition-colors"
                >
                  {copied ? <Check size={13} className="text-green-500" /> : <Link2 size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2.5 font-text text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvite}
                disabled={!shareEmails.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-text text-sm font-semibold text-background hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40"
              >
                {shareSent ? <><Check size={14} /> Invited</> : <><Share2 size={14} /> Send invite</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} className="w-full min-w-0">
        <div className="mb-8 w-full overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="brief" className="flex min-w-0 items-center justify-center gap-2" asChild>
              <Link href={tabHref('brief')} scroll={false}>
                <Target size={14} /> Brief
              </Link>
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex min-w-0 items-center justify-center gap-2" asChild>
              <Link href={tabHref('milestones')} scroll={false}>
                <LayoutDashboard size={14} /> Milestones
              </Link>
            </TabsTrigger>
            <TabsTrigger value="pod" className="flex min-w-0 items-center justify-center gap-2" asChild>
              <Link href={tabHref('pod')} scroll={false}>
                <Users2 size={14} /> Pod
              </Link>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex min-w-0 items-center justify-center gap-2" asChild>
              <Link href={tabHref('knowledge')} scroll={false}>
                <FileText size={14} /> Knowledge
              </Link>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex min-w-0 items-center justify-center gap-2" asChild>
              <Link href={tabHref('payments')} scroll={false}>
                <CreditCard size={14} /> Payments
              </Link>
            </TabsTrigger>
            <TabsTrigger value="contract" className="flex min-w-0 items-center justify-center gap-2" asChild>
              <Link href={tabHref('contract')} scroll={false}>
                <ShieldCheck size={14} /> Contract
              </Link>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
          <div className="min-w-0 space-y-8">
            <TabsContent value="brief" className="mt-0">
              <section className="py-2 border-t border-border">
                <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6 mt-4">Brief summary</h2>
                <p className="font-text text-[16px] leading-relaxed text-muted-foreground mb-8 max-w-[70ch]">
                  {job.summary}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/50 pt-6">
                  <div>
                    <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Engagement scope</h3>
                    <ul className="space-y-2">
                      {job.scope.map((item) => (
                        <li key={item} className="flex items-start gap-2 font-text text-[13px] text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">Success requirements</h3>
                    <ul className="space-y-2">
                      {job.requirements.map((item) => (
                        <li key={item} className="flex items-start gap-2 font-text text-sm text-muted-foreground">
                          <div className="w-1 h-1 bg-input rounded-full mt-1.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="milestones" className="mt-0 space-y-8">
              <section className="border-t border-border">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Milestones</h2>
                    <button 
                      onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                      className="p-1 hover:bg-muted rounded-sm text-primary transition-colors flex items-center gap-1 font-mono text-[9px] uppercase tracking-tight"
                    >
                      {isAddingMilestone ? <X size={12} /> : <Plus size={12} />}
                      {isAddingMilestone ? 'Cancel' : 'Add milestone'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70">{getJobProgress({...job, milestones: localMilestones})}% Velocity</span>
                  </div>
                </div>
                
                <div className="border border-border overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[120px]">Milestone Status</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[100px]">Payment</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold">Milestone</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[100px]">Due</th>
                        <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold text-right w-[100px]">Amount</th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isAddingMilestone && (
                        <tr className="bg-primary/5">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider bg-border text-muted-foreground/70 border-input">
                              PENDING
                            </span>
                          </td>
                          <td className="px-4 py-3">
                             <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider bg-muted text-muted-foreground/70 border-border">
                                UNSET
                             </span>
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text"
                              placeholder="Milestone title..."
                              autoFocus
                              className="w-full bg-transparent border-none focus:ring-0 font-text text-sm font-bold text-foreground placeholder:text-input p-0"
                              value={newMilestone.title}
                              onChange={e => setNewMilestone({...newMilestone, title: e.target.value})}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="date"
                              className="w-full bg-transparent border-none focus:ring-0 font-text text-[10px] text-muted-foreground/70 uppercase tracking-tight p-0"
                              value={newMilestone.date}
                              onChange={e => setNewMilestone({...newMilestone, date: e.target.value})}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <input
                                type="text"
                                placeholder="$0"
                                className="w-16 bg-transparent border-none focus:ring-0 font-mono text-[11px] font-bold text-foreground placeholder:text-input p-0 text-right"
                                value={newMilestone.amount}
                                onChange={e => setNewMilestone({...newMilestone, amount: e.target.value})}
                              />
                              <button
                                onClick={handleAddMilestone}
                                disabled={!newMilestone.title || !newMilestone.date}
                                className="p-1 bg-foreground text-background rounded-sm hover:bg-primary hover:text-primary-foreground disabled:opacity-30 transition-all"
                              >
                                <Check size={12} />
                              </button>
                            </div>
                          </td>
                          <td />
                        </tr>
                      )}
                      {localMilestones.map((ms) => {
                        const inv = getInvoice(job.slug, ms.id)
                        return (
                          <tr key={ms.id} className="group hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${
                                ms.status === 'completed'  ? 'bg-primary/10 text-primary border-primary/20' :
                                ms.status === 'in-progress' ? 'bg-accent/5 text-accent border-accent/20' :
                                'bg-border text-muted-foreground/70 border-input'
                              }`}>
                                {ms.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {inv && (
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${
                                  inv.status === 'Paid'       ? 'bg-green-50 text-green-700 border-green-200' :
                                  inv.status === 'Processing' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  'bg-muted text-muted-foreground/70 border-border'
                                }`}>
                                  {inv.status}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-text text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                {ms.title}
                              </p>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p className="font-text text-[10px] text-muted-foreground/70 uppercase tracking-tight">{ms.date}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-mono text-[11px] font-bold text-foreground">
                                {inv?.amount ?? ms.amount ?? '—'}
                              </span>
                            </td>
                            <td className="pr-3 py-3 text-right">
                              <button
                                onClick={() => handleDeleteMilestone(ms.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground/50 hover:text-red-500 transition-all"
                              >
                                <X size={12} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Recent updates */}
              {job.updates && job.updates.length > 0 && (
                <section className="border-t border-border">
                  <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4 mt-4">Pulse updates</h3>
                  <ul className="space-y-3">
                    {job.updates.map((update, i) => (
                      <li key={i} className="flex items-start gap-3 font-text text-sm text-muted-foreground leading-relaxed">
                        <div className="w-1 h-1 bg-primary/30 rounded-full mt-2 shrink-0" />
                        {update}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </TabsContent>

            <TabsContent value="pod" className="mt-0">
              {assignedPod && !showCreatePod ? (
                <section className="border-t border-border">
                  <div className="flex items-center justify-between py-4">
                    <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Assigned pod</h3>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setShowCreatePod(true)} className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/50 hover:text-foreground transition-colors">
                        Change
                      </button>
                      <Link href={`/client/dashboard/search/${assignedPod.slug}?returnTo=${encodeURIComponent(tabHref('pod'))}`} className="font-mono text-[9px] uppercase tracking-eyebrow text-primary hover:underline">
                        View profile
                      </Link>
                    </div>
                  </div>
                  
                  <p className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground mb-2">{assignedPod.name}</p>
                  <p className="font-text text-sm text-muted-foreground mb-5 leading-relaxed max-w-[65ch]">{assignedPod.focus}</p>

                  <div className="mb-8 inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-background">
                    <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70">Pod/hour</span>
                    <span className="font-display font-black text-[15px] tracking-[-0.01em] text-foreground">{assignedPod.rate}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border overflow-hidden">
                    {assignedPodMembers.map(member => (
                      <Link key={member.id} href={`/client/dashboard/search/talent/${member.id}`} className="flex items-center gap-3 p-4 bg-background hover:bg-muted transition-all group">
                        <div className={`w-10 h-10 rounded-sm shrink-0 flex items-center justify-center font-display font-black text-[11px] text-background overflow-hidden relative ${member.color || 'bg-foreground'}`}>
                          {member.image ? (
                            <Image src={member.image} alt={member.name} fill className="object-cover" />
                          ) : member.initials}
                        </div>
                        <div>
                          <p className="font-text text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{member.name}</p>
                          <p className="font-text text-[11px] text-muted-foreground/70 leading-tight mt-0.5">{member.talentRole ?? member.role}</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <ShieldCheck size={11} className="text-primary shrink-0" strokeWidth={2.5} />
                            {(member.networkAffiliations ?? []).length > 0 && (
                              <NetworkAffiliateBadge affiliations={member.networkAffiliations!} size={11} />
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="border-t border-border space-y-6">
                  <div>
                    <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4 mt-4">Recommended pods</h2>
                    <div className="grid grid-cols-1 gap-px bg-border border border-border overflow-hidden">
                      {primaryPods.map((pod) => {
                        const lead = getTalentProfile(pod.leadId)
                        return (
                          <Link key={pod.id} href={`/client/dashboard/search/${pod.slug}?returnTo=${encodeURIComponent(tabHref('pod'))}`} className="p-4 bg-background flex items-center gap-4 hover:bg-muted transition-all group">
                            <div className="w-10 h-10 rounded-sm bg-foreground flex items-center justify-center font-display font-black text-[11px] text-background shrink-0 border border-border overflow-hidden relative">
                              {lead.image ? (
                                <Image src={lead.image} alt={lead.name} fill className="object-cover" />
                              ) : (
                                lead.initials
                              )}
                            </div>
                            <div>
                              <h3 className="font-display font-black text-[15px] text-foreground group-hover:text-primary transition-colors leading-tight">{pod.name}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="font-text text-[12px] text-muted-foreground">{pod.focus}</span>
                                <span className="w-1 h-1 bg-border rounded-full" />
                                <span className="font-text text-[12px] text-primary font-semibold">{pod.fitScore}%</span>
                                <span className="w-1 h-1 bg-border rounded-full" />
                                <span className="font-text text-[12px] text-foreground font-semibold">{pod.rate}</span>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Build your own pod */}
                  {!showCreatePod ? (
                    <button
                      onClick={() => setShowCreatePod(true)}
                      className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-xl text-muted-foreground/60 hover:border-primary/40 hover:text-primary transition-all group"
                    >
                      <Plus size={16} className="group-hover:scale-110 transition-transform" />
                      <span className="font-text text-sm font-semibold">Build your own pod</span>
                    </button>
                  ) : (
                    <div className="border border-border rounded-xl p-6 space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Build your pod</h3>
                        <button onClick={() => { setShowCreatePod(false); setSelectedMemberIds([]); setPodMemberSearch('') }} className="text-muted-foreground/50 hover:text-foreground transition-colors">
                          <X size={14} />
                        </button>
                      </div>

                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 block mb-2">Pod name *</label>
                        <input
                          type="text"
                          value={podName}
                          onChange={e => setPodName(e.target.value)}
                          placeholder="e.g. Growth Collective"
                          className="w-full p-3 bg-muted border border-border rounded-xl font-text text-sm text-foreground focus:outline-none focus:border-muted-foreground/50 transition-all"
                        />
                      </div>

                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-3">
                          Select people *
                          {selectedMemberIds.length > 0 && (
                            <span className="ml-2 text-primary normal-case tracking-normal font-text font-semibold">{selectedMemberIds.length} selected</span>
                          )}
                        </p>
                        <div className="relative mb-3">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                          <input
                            type="search"
                            value={podMemberSearch}
                            onChange={e => setPodMemberSearch(e.target.value)}
                            placeholder="Search talent by name, role, background, or location..."
                            className="w-full pl-9 pr-3 py-2.5 bg-muted border border-border rounded-xl font-text text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-muted-foreground/50 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
                          {filteredTalentUsers.map(person => {
                            const selected = selectedMemberIds.includes(person.id)
                            return (
                              <button
                                key={person.id}
                                type="button"
                                onClick={() => setSelectedMemberIds(prev =>
                                  selected ? prev.filter(id => id !== person.id) : [...prev, person.id]
                                )}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                  selected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-muted/30 hover:border-input'
                                }`}
                              >
                                <div className={`w-9 h-9 rounded-sm shrink-0 flex items-center justify-center font-display font-black text-[10px] text-background overflow-hidden relative ${(person as any).color || 'bg-foreground'}`}>
                                  {(person as any).image ? (
                                    <Image src={(person as any).image} alt={person.name} fill className="object-cover" />
                                  ) : (person as any).initials ?? person.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`font-text text-sm font-semibold leading-tight truncate ${selected ? 'text-primary' : 'text-foreground'}`}>{person.name}</p>
                                  <p className="font-text text-[11px] text-muted-foreground/60 leading-tight mt-0.5 truncate">{(person as any).talentRole ?? person.role}</p>
                                </div>
                                {selected && <Check size={13} className="text-primary shrink-0" />}
                              </button>
                            )
                          })}
                          {filteredTalentUsers.length === 0 && (
                            <p className="sm:col-span-2 px-3 py-8 text-center font-text text-sm text-muted-foreground/60">No talent matches that search.</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                          onClick={() => { setShowCreatePod(false); setSelectedMemberIds([]); setPodMemberSearch('') }}
                          className="font-text text-sm font-semibold text-muted-foreground/70 hover:text-foreground transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreatePod}
                          disabled={creatingPod || !podName.trim() || selectedMemberIds.length === 0}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-full font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-40"
                        >
                          {creatingPod ? 'Creating…' : <><Check size={13} /> Create pod</>}
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </TabsContent>

            <TabsContent value="knowledge" className="mt-0">
              <section className="py-2 border-t border-border">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={e => handleFilesSelected(e.target.files)}
                />
                <div className="mt-4 space-y-3">
                  <h3 className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70">Engagement Documents</h3>

                  {/* File list */}
                  {(job.documents ?? []).length > 0 && (
                    <div className="space-y-2">
                      {(job.documents ?? []).map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg group">
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                            <FileText size={16} className="text-primary/70 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-text text-xs font-bold text-foreground truncate">{file.name}</p>
                              <p className="font-text text-[9px] text-muted-foreground/70">{file.size} · {file.uploadedAt}</p>
                            </div>
                          </a>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <a href={file.url} download={file.name} className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground/50 hover:text-foreground rounded-sm transition-all">
                              <Download size={13} />
                            </a>
                            <button
                              onClick={() => handleDeleteDoc(file)}
                              disabled={deletingDoc === file.storagePath}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground/50 hover:text-red-500 rounded-sm transition-all disabled:opacity-30"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Uploading progress items */}
                  {uploadingFiles.map(f => (
                    <div key={f.name} className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <FileText size={16} className="text-primary/50 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-text text-xs font-bold text-foreground truncate">{f.name}</p>
                        <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${f.progress}%` }} />
                        </div>
                      </div>
                      <span className="font-mono text-[9px] text-primary shrink-0">{f.progress}%</span>
                    </div>
                  ))}

                  {/* Upload dropzone */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-6 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center group hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <Upload size={24} className="text-muted-foreground/40 mb-2 group-hover:text-primary/60 transition-colors" />
                    <p className="font-text text-[11px] font-bold text-foreground">Click to upload</p>
                    <p className="font-text text-[9px] text-muted-foreground/70 mt-1 uppercase tracking-wider">PDF, CSV, JSON, DOCX, XLSX</p>
                  </button>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="payments" className="mt-0">
              {(() => {
                const jobInvoices = invoices.filter(i => i.jobSlug === job.slug)
                const paid = jobInvoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.amountRaw, 0)
                const due = jobInvoices.filter(i => i.status === 'Due').reduce((a, i) => a + i.amountRaw, 0)
                const invoiceStatusStyles: Record<string, string> = {
                  Paid:       'bg-green-50 text-green-700 border-green-200',
                  Due:        'bg-amber-50 text-amber-700 border-amber-200',
                  Processing: 'bg-primary/10 text-primary border-primary/20',
                }
                return (
                  <section className="border-t border-border">
                    <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6 mt-4">Payment schedule</h2>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-foreground text-background rounded-2xl p-5">
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-2">Total invoiced</p>
                        <p className="font-display font-black text-[28px] tracking-[-0.03em] leading-none">
                          ${jobInvoices.reduce((a, i) => a + i.amountRaw, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="border border-border rounded-2xl p-5 bg-background">
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-2">Paid</p>
                        <p className="font-display font-black text-[28px] tracking-[-0.03em] text-foreground leading-none">${paid.toLocaleString()}</p>
                      </div>
                      <div className={`border rounded-2xl p-5 bg-background ${due > 0 ? 'border-amber-200' : 'border-border'}`}>
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-2">Outstanding</p>
                        <p className={`font-display font-black text-[28px] tracking-[-0.03em] leading-none ${due > 0 ? 'text-amber-600' : 'text-foreground'}`}>${due.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="border border-border overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Status</th>
                            <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Milestone</th>
                            <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 text-right">Amount</th>
                            <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {jobInvoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${invoiceStatusStyles[inv.status]}`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-text text-sm font-semibold text-foreground">{inv.label}</p>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-mono text-[11px] font-bold text-foreground">{inv.amount}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-text text-xs text-muted-foreground">{inv.date}</span>
                              </td>
                            </tr>
                          ))}
                          {jobInvoices.length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-10 text-center font-text text-sm text-muted-foreground/70">No invoices yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-text text-[11px] text-muted-foreground/50 mt-3">Payments are processed by Comcorpe and held in escrow until milestone sign-off.</p>
                  </section>
                )
              })()}
            </TabsContent>

            <TabsContent value="contract" className="mt-0">
              <section className="border-t border-border">
                <div className="flex items-center justify-between py-4 mb-2">
                  <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">Engagement Letter</h3>
                  <button className="font-mono text-[9px] uppercase tracking-eyebrow text-primary hover:underline flex items-center gap-1.5">
                    <Download size={12} /> Export PDF
                  </button>
                </div>

                <div className="h-[calc(100vh-220px)] min-h-[480px] overflow-y-auto rounded-sm border border-border bg-muted/20 p-3 md:p-4 [scrollbar-gutter:stable]">
                  <div className="bg-[#fcfcfc] border border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-sm mx-auto max-w-[800px] p-10 md:p-14 relative overflow-hidden text-slate-900">
                    {/* Compact Letterhead */}
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
                      <div>
                        <p className="font-display font-black text-xl tracking-tighter">COMCORPE</p>
                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-400 leading-none">London Â· Lagos Â· Nairobi</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] text-slate-400 uppercase tracking-wider leading-none mb-1">
                          <span className="text-primary font-bold">Jan 12, 2025</span>
                        </p>
                        <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                          REF: <span className="text-primary">{job.slug.toUpperCase()}</span>/LOE-042
                        </p>
                      </div>
                    </div>

                    {/* Body with Full Terms */}
                    <div className="font-text text-[13px] leading-relaxed space-y-6 text-slate-800">
                      <p>Dear Partners,</p>
                      <p>This Letter of Engagement confirms the terms upon which Comcorpe Ltd (&quot;the Partner&quot;) will provide strategic services to <strong className="text-primary">{job.clientId.replace(/-/g, ' ').toUpperCase()}</strong> (&quot;the Client&quot;) for the project <em className="text-primary font-bold">&quot;{job.title}&quot;</em>.</p>
                      
                      <div className="space-y-6">
                        {contractTerms.map((term) => (
                          <section key={term.id}>
                            <h3 className="font-display font-bold uppercase text-[10px] tracking-widest text-slate-900 mb-1.5">
                              {term.id}. {term.title}
                            </h3>
                            <p className="text-slate-600 leading-[1.6]">
                              {term.content.split(/(Commercial Structure|Brief|Milestones|estimated at|Job Title)/g).map((part, i) => {
                                if (part === 'estimated at') return <span key={i} className="text-primary font-bold">estimated at {job.rate}</span>
                                return part
                              })}
                            </p>
                          </section>
                        ))}
                      </div>

                      <p className="pt-4">We look forward to a successful collaboration and are committed to delivering exceptional value through this strategic engagement.</p>
                    </div>

                    {/* Compact Signature Section */}
                    <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-2 gap-12">
                      <div className="space-y-3">
                        <div className="h-10 flex items-end">
                          <span className="font-display italic text-xl text-primary/40 pb-1 border-b border-slate-200 block w-full underline decoration-primary/20">Jide Pinheiro</span>
                        </div>
                        <div>
                          <p className="font-display font-bold text-[11px] text-primary uppercase tracking-tight">Jide Pinheiro</p>
                          <p className="font-mono text-[8px] text-slate-400 uppercase tracking-widest leading-none">Partner, Comcorpe</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-right">
                        <div className="h-10 flex items-end justify-end">
                          <span className="font-display italic text-xl text-primary/40 pb-1 border-b border-slate-200 block w-full underline decoration-primary/20">/s/ Authorized Signatory</span>
                        </div>
                        <div>
                          <p className="font-display font-bold text-[11px] text-primary uppercase tracking-tight">{job.clientId.split('-')[0].toUpperCase()} REPRESENTATIVE</p>
                          <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest leading-none">Client Signatory</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>
          </div>

          <aside className="space-y-6">
            <div className="p-6 bg-background text-foreground border border-border rounded-lg shadow-sm">
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Commercial structure</p>
                  <p className="font-display font-black text-lg">{job.rate}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Expected duration</p>
                  <p className="font-display font-black text-lg">{job.time}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Location</p>
                  <p className="font-display font-black text-lg flex items-center gap-2">
                    <MapPin size={15} strokeWidth={1.5} className="text-muted-foreground/70" />
                    {job.location}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Updated</p>
                  <p className="font-display font-black text-lg flex items-center gap-2">
                    <Clock size={15} strokeWidth={1.5} className="text-muted-foreground/70" />
                    {job.updatedAt}
                  </p>
                </div>
                {job.startDate && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Engagement dates</p>
                    <p className="font-display font-black text-lg tracking-tight">{job.startDate}{' — '}{job.endDate || 'Present'}</p>
                  </div>
                )}
                {job.lead && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 mb-1">Strategic pod lead</p>
                    <p className="font-display font-black text-lg">{job.lead}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Comcorpe partner</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-black text-[11px] text-primary-foreground">
                  JP
                </div>
                <div>
                  <p className="font-text text-[13px] font-bold text-foreground leading-tight">Jide Pinheiro</p>
                  <p className="font-text text-[11px] text-muted-foreground/70 mt-0.5">Strategic Director</p>
                </div>
              </div>
              <button className="w-full mt-6 py-2 bg-foreground text-background rounded-sm font-text text-[11px] font-semibold hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-wider">
                Direct message
              </button>
            </div>
          </aside>
        </div>
      </Tabs>
    </div>
  )
}
