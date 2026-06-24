'use client'

import { useEffect, useState } from 'react'
import { COLUMNS, SEED_TASKS, type Priority, type Status, type Task } from './tasks'
import {
  CARD_FIELDS,
  DEFAULT_VIEWS,
  PRIORITY_COLUMNS,
  type CardField,
  type GroupBy,
  type View,
  type ViewType,
} from './config'
import KanbanBoard from './components/KanbanBoard'
import TableBoard from './components/TableBoard'
import TaskDialog from './components/TaskDialog'
import CardFieldsMenu from './components/CardFieldsMenu'
import ViewTabs from './components/ViewTabs'

const TASKS_KEY = 'comcorpe-kanban-tasks-v2'
const FIELDS_KEY = 'comcorpe-kanban-fields-v1'
const VIEWS_KEY = 'comcorpe-kanban-views-v1'

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [views, setViews] = useState<View[]>(DEFAULT_VIEWS)
  const [activeViewId, setActiveViewId] = useState<string>(DEFAULT_VIEWS[0].id)
  const [group, setGroup] = useState<GroupBy>('status')
  const [fields, setFields] = useState<CardField[]>(CARD_FIELDS.map((f) => f.id))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Load any persisted state on the client only.
  useEffect(() => {
    try {
      const t = localStorage.getItem(TASKS_KEY)
      if (t) setTasks(JSON.parse(t))
      const f = localStorage.getItem(FIELDS_KEY)
      if (f) setFields(JSON.parse(f))
      const v = localStorage.getItem(VIEWS_KEY)
      if (v) {
        const parsed: View[] = JSON.parse(v)
        if (parsed.length) {
          setViews(parsed)
          setActiveViewId(parsed[0].id)
        }
      }
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks, hydrated])

  useEffect(() => {
    if (hydrated) localStorage.setItem(FIELDS_KEY, JSON.stringify(fields))
  }, [fields, hydrated])

  useEffect(() => {
    if (hydrated) localStorage.setItem(VIEWS_KEY, JSON.stringify(views))
  }, [views, hydrated])

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  // Drop target maps to status or priority depending on how the board is grouped.
  function moveToColumn(id: string, colId: string) {
    if (group === 'priority') updateTask(id, { priority: colId as Priority })
    else updateTask(id, { status: colId as Status })
  }

  function toggleField(id: CardField) {
    setFields((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  function createView(name: string, type: ViewType) {
    const view: View = { id: `view-${Date.now()}`, name, type }
    setViews((prev) => [...prev, view])
    setActiveViewId(view.id)
  }

  function deleteView(id: string) {
    setViews((prev) => {
      const next = prev.filter((v) => v.id !== id)
      if (id === activeViewId && next.length) setActiveViewId(next[0].id)
      return next
    })
  }

  const activeView = views.find((v) => v.id === activeViewId) ?? views[0]
  const selected = tasks.find((t) => t.id === selectedId) ?? null

  return (
    <div className="min-h-screen bg-zinc-100 font-text">
      <header className="border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto px-4 py-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-muted-foreground mb-2">
            Recruitment Campaign 2026
          </p>
          <h1 className="font-display font-black text-[22px] tracking-[-0.03em] text-foreground leading-tight md:text-[26px]">
            Building the Comcorpᵉ Capability Network
          </h1>
          <p className="font-text text-sm text-muted-foreground mt-1">
            Talent brings expertise. Comcorpᵉ owns the outcome.
          </p>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-6 lg:px-8">
        {/* Toolbar: view tabs + (kanban) grouping & card properties */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <ViewTabs
            views={views}
            activeId={activeViewId}
            onSelect={setActiveViewId}
            onCreate={createView}
            onDelete={deleteView}
          />

          {activeView?.type === 'kanban' && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background p-1">
                <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground pl-2">
                  Group
                </span>
                {([
                  { id: 'status', label: 'Status' },
                  { id: 'priority', label: 'Priority' },
                ] as const).map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setGroup(id)}
                    className={`font-text text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                      group === id
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <CardFieldsMenu fields={fields} onToggle={toggleField} />
            </div>
          )}
        </div>

        {activeView?.type === 'kanban' ? (
          <KanbanBoard
            columns={group === 'priority' ? PRIORITY_COLUMNS : COLUMNS}
            groupBy={group}
            tasks={tasks}
            fields={fields}
            moveToColumn={moveToColumn}
            onOpen={setSelectedId}
          />
        ) : (
          <TableBoard tasks={tasks} updateTask={updateTask} onOpen={setSelectedId} />
        )}
      </main>

      {selected && (
        <TaskDialog
          task={selected}
          onClose={() => setSelectedId(null)}
          onChange={(patch) => updateTask(selected.id, patch)}
        />
      )}
    </div>
  )
}
