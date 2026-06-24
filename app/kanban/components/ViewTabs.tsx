'use client'

import { useEffect, useRef, useState } from 'react'
import { LayoutGrid, Plus, Table2, X } from 'lucide-react'
import { type View, type ViewType } from '../config'

export default function ViewTabs({
  views,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}: {
  views: View[]
  activeId: string
  onSelect: (id: string) => void
  onCreate: (name: string, type: ViewType) => void
  onDelete: (id: string) => void
}) {
  const [creating, setCreating] = useState(false)

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {views.map((view) => {
        const Icon = view.type === 'kanban' ? LayoutGrid : Table2
        const active = view.id === activeId
        return (
          <div
            key={view.id}
            className={`group flex items-center gap-1.5 rounded-full border pl-3 pr-2 py-1.5 transition-colors ${
              active
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-background text-muted-foreground hover:text-foreground'
            }`}
          >
            <button onClick={() => onSelect(view.id)} className="flex items-center gap-1.5">
              <Icon size={13} />
              <span className="font-text text-xs font-semibold">{view.name}</span>
            </button>
            {views.length > 1 && (
              <button
                onClick={() => onDelete(view.id)}
                aria-label={`Delete ${view.name} view`}
                className={`rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  active ? 'hover:bg-background/20' : 'hover:bg-muted'
                }`}
              >
                <X size={12} />
              </button>
            )}
          </div>
        )
      })}

      <div className="relative">
        <button
          onClick={() => setCreating((c) => !c)}
          className="flex items-center gap-1 rounded-full border border-dashed border-border bg-background px-3 py-1.5 font-text text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
        >
          <Plus size={13} />
          New view
        </button>
        {creating && (
          <NewViewForm
            onCancel={() => setCreating(false)}
            onCreate={(name, type) => {
              onCreate(name, type)
              setCreating(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

function NewViewForm({
  onCreate,
  onCancel,
}: {
  onCreate: (name: string, type: ViewType) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState<ViewType>('kanban')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onCancel()
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [onCancel])

  function submit() {
    const trimmed = name.trim()
    if (trimmed) onCreate(trimmed, type)
  }

  return (
    <div
      ref={ref}
      className="absolute left-0 z-30 mt-2 w-64 rounded-xl border border-border bg-background p-3 shadow-xl"
    >
      <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground mb-2">New view</p>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="View name"
        className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 font-text text-sm text-foreground outline-none focus:border-foreground/40"
      />

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {([
          { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
          { id: 'table', label: 'Table', icon: Table2 },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setType(id)}
            className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 font-text text-xs font-semibold transition-colors ${
              type === id
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="font-text text-xs font-medium px-2.5 py-1 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={!name.trim()}
          className="font-text text-xs font-semibold px-3 py-1 rounded-md bg-foreground text-background disabled:opacity-40 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Create
        </button>
      </div>
    </div>
  )
}
