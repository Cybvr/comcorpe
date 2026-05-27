'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, XCircle, FileText } from 'lucide-react'
import { useCurrentUser, updateUserProfile } from '@/lib/user'
import { useVettingTaskForTalent } from '@/lib/vetting'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function update() {
      const diff = new Date(deadline).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Deadline passed'); return }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      setTimeLeft(`${h}h ${m}m remaining`)
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [deadline])

  const isPast = new Date(deadline).getTime() < Date.now()
  return (
    <span className={`font-mono text-sm font-semibold ${isPast ? 'text-red-600' : 'text-amber-600'}`}>
      {timeLeft}
    </span>
  )
}

export default function TalentVettingPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useCurrentUser()
  const { task, loading: taskLoading } = useVettingTaskForTalent(user?.id ?? '')
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [submissionNotes, setSubmissionNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!userLoading && user?.vettingStatus === 'approved') {
      router.replace('/talent/dashboard')
    }
  }, [user?.vettingStatus, userLoading, router])

  if (userLoading || taskLoading) {
    return <div className="py-20 text-center"><p className="font-mono text-sm text-muted-foreground animate-pulse">Loading…</p></div>
  }

  if (user?.vettingStatus === 'approved') {
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!task || !user) return
    setSubmitting(true)
    await setDoc(doc(db, 'vettingTasks', task.id), {
      status: 'submitted',
      submissionUrl: submissionUrl.trim(),
      submissionNotes: submissionNotes.trim() || null,
      submittedAt: new Date().toISOString(),
    }, { merge: true })
    await updateUserProfile(user.id, { vettingStatus: 'submitted' })
    setSubmitting(false)
  }

  const status = user?.vettingStatus

  return (
    <div className="max-w-[640px] mx-auto py-10 px-4 space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground mb-1">Vetting</p>
        <h1 className="font-display font-black text-[32px] tracking-hero text-foreground leading-tight">Your vetting task</h1>
      </div>

      {/* Pending — task not yet assigned */}
      {(!task || status === 'pending') && (
        <div className="border border-border px-6 py-8 text-center space-y-3">
          <Clock size={32} className="mx-auto text-muted-foreground/40" />
          <p className="font-text text-sm font-semibold text-foreground">Application received</p>
          <p className="font-text text-sm text-muted-foreground">
            Our team has your profile and will assign a vetting task shortly. You&apos;ll see it here as soon as it&apos;s ready.
          </p>
        </div>
      )}

      {/* Task assigned — not yet submitted */}
      {task && (status === 'task-assigned') && (
        <div className="space-y-6">
          <div className="border border-amber-200 bg-amber-50 px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-amber-600 shrink-0" />
              <p className="font-text text-sm text-amber-700 font-semibold">48-hour window open</p>
            </div>
            <Countdown deadline={task.deadline} />
          </div>

          <div className="border border-border p-6 space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">Task brief</p>
            <h2 className="font-text text-lg font-semibold text-foreground">{task.title}</h2>
            <p className="font-text text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{task.brief}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">
                Submission URL *
              </label>
              <input
                type="url"
                value={submissionUrl}
                onChange={e => setSubmissionUrl(e.target.value)}
                placeholder="https://docs.google.com/…"
                required
                className="w-full px-4 py-3 border border-input bg-background font-text text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
              />
              <p className="font-text text-xs text-muted-foreground/70">Google Doc, Notion page, PDF link, or similar.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] tracking-eyebrow uppercase text-muted-foreground">
                Notes (optional)
              </label>
              <textarea
                value={submissionNotes}
                onChange={e => setSubmissionNotes(e.target.value)}
                placeholder="Anything you want us to know about your approach…"
                rows={4}
                className="w-full px-4 py-3 border border-input bg-background font-text text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={!submissionUrl.trim() || submitting}
              className="w-full py-3.5 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Submit task'}
            </button>
          </form>
        </div>
      )}

      {/* Submitted — awaiting review */}
      {task && status === 'submitted' && (
        <div className="border border-border px-6 py-8 text-center space-y-3">
          <FileText size={32} className="mx-auto text-primary/60" />
          <p className="font-text text-sm font-semibold text-foreground">Submission received</p>
          <p className="font-text text-sm text-muted-foreground">
            We&apos;ve got your work. Our team will review it and get back to you within 2–3 business days.
          </p>
        </div>
      )}

      {/* Rejected */}
      {task && status === 'rejected' && (
        <div className="border border-red-200 bg-red-50 px-6 py-8 space-y-3">
          <div className="flex items-center gap-2 text-red-700">
            <XCircle size={18} />
            <p className="font-text text-sm font-semibold">Not approved at this time</p>
          </div>
          {task.reviewNotes && (
            <p className="font-text text-sm text-red-600/80 pl-7">{task.reviewNotes}</p>
          )}
          <p className="font-text text-sm text-red-600/70 pl-7">
            Contact <a href="mailto:talent@comcorpe.com" className="underline">talent@comcorpe.com</a> if you have questions.
          </p>
        </div>
      )}
    </div>
  )
}
