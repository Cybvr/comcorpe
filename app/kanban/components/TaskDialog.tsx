'use client'

import { useEffect, useState } from 'react'
import { Calendar, Plus, User, X } from 'lucide-react'
import { COLUMNS, type Priority, type Status, type Task } from '../tasks'
import { PRIORITIES } from '../config'

export default function TaskDialog({
  task,
  onClose,
  onChange,
}: {
  task: Task
  onClose: () => void
  onChange: (patch: Partial<Task>) => void
}) {
  // Close on Escape, like Notion's peek view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[640px] rounded-2xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="px-6 pt-8 pb-6 sm:px-10">
          {/* Title */}
          <input
            value={task.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full bg-transparent font-display font-black text-[22px] tracking-[-0.02em] text-foreground leading-tight outline-none placeholder:text-muted-foreground/40"
            placeholder="Untitled"
          />

          {/* Properties */}
          <div className="mt-5 grid grid-cols-1 gap-1 sm:grid-cols-[120px_1fr]">
            <PropLabel>Status</PropLabel>
            <div className="mb-2 sm:mb-0">
              <select
                value={task.status}
                onChange={(e) => onChange({ status: e.target.value as Status })}
                className="font-text text-sm rounded-md border border-border bg-background px-2 py-1 text-foreground"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <PropLabel>Priority</PropLabel>
            <div className="mb-2 sm:mb-0">
              <select
                value={task.priority}
                onChange={(e) => onChange({ priority: e.target.value as Priority })}
                className="font-text text-sm rounded-md border border-border bg-background px-2 py-1 text-foreground capitalize"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} className="capitalize">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <PropLabel>Owners</PropLabel>
            <div className="mb-2 sm:mb-0">
              <OwnersEditor
                owners={task.owners}
                onChange={(owners) => onChange({ owners })}
              />
            </div>

            <PropLabel>Date</PropLabel>
            <div className="mb-2 flex items-center gap-1.5 sm:mb-0">
              <Calendar size={13} className="shrink-0 text-muted-foreground" />
              <input
                type="date"
                value={task.date}
                onChange={(e) => onChange({ date: e.target.value })}
                className="font-text text-sm rounded-md border border-border bg-background px-2 py-1 text-foreground"
              />
            </div>

            <PropLabel>Tags</PropLabel>
            <div className="mb-2 sm:mb-0">
              <TagsEditor tags={task.tags} onChange={(tags) => onChange({ tags })} />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 border-t border-border pt-5">
            <PropLabel>Description</PropLabel>
            <textarea
              value={task.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={6}
              className="mt-2 w-full resize-y rounded-lg bg-transparent font-text text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/40"
              placeholder="Add a description…"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PropLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground pt-1.5">{children}</div>
  )
}

function TagsEditor({
  tags,
  onChange,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  function addTag() {
    const v = draft.trim()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setDraft('')
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide pl-1.5 pr-1 py-0.5 rounded bg-muted text-muted-foreground"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
            className="rounded hover:bg-foreground/10 hover:text-foreground transition-colors"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        placeholder="Add tag…"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={addTag}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
          }
          if (e.key === 'Backspace' && !draft && tags.length) {
            removeTag(tags[tags.length - 1])
          }
        }}
        className="min-w-[80px] flex-1 bg-transparent font-text text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
      />
    </div>
  )
}

function OwnersEditor({
  owners,
  onChange,
}: {
  owners: string[]
  onChange: (owners: string[]) => void
}) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  function updateAt(i: number, value: string) {
    onChange(owners.map((o, idx) => (idx === i ? value : o)))
  }

  function removeAt(i: number) {
    onChange(owners.filter((_, idx) => idx !== i))
  }

  function commitDraft() {
    const v = draft.trim()
    if (v) onChange([...owners, v])
    setDraft('')
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {owners.map((owner, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <User size={13} className="shrink-0 text-muted-foreground" />
          <input
            type="email"
            value={owner}
            onChange={(e) => updateAt(i, e.target.value)}
            className="flex-1 rounded-md border border-border bg-background px-2 py-1 font-text text-sm text-foreground outline-none focus:border-foreground/40"
          />
          <button
            onClick={() => removeAt(i)}
            aria-label="Remove email"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ))}

      {adding ? (
        <div className="flex items-center gap-1.5">
          <User size={13} className="shrink-0 text-muted-foreground" />
          <input
            autoFocus
            type="email"
            value={draft}
            placeholder="name@comcorpe.com"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitDraft()
              if (e.key === 'Escape') {
                setDraft('')
                setAdding(false)
              }
            }}
            className="flex-1 rounded-md border border-border bg-background px-2 py-1 font-text text-sm text-foreground outline-none focus:border-foreground/40"
          />
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 font-text text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <Plus size={13} /> Add email
        </button>
      )}
    </div>
  )
}
