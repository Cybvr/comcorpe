'use client'

import { useState } from 'react'
import { Calendar, GripVertical, User } from 'lucide-react'
import type { Task } from '../tasks'
import { formatDate, priorityStyles, type CardField, type GroupBy } from '../config'

export default function KanbanBoard({
  columns,
  groupBy,
  tasks,
  fields,
  moveToColumn,
  onOpen,
}: {
  columns: { id: string; label: string }[]
  groupBy: GroupBy
  tasks: Task[]
  fields: CardField[]
  moveToColumn: (id: string, colId: string) => void
  onOpen: (id: string) => void
}) {
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<string | null>(null)

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${Math.min(columns.length, 4)}, minmax(0, 1fr))` }}
    >
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t[groupBy] === col.id)
        return (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault()
              setOverCol(col.id)
            }}
            onDragLeave={() => setOverCol(overCol === col.id ? null : overCol)}
            onDrop={() => {
              if (dragId) moveToColumn(dragId, col.id)
              setDragId(null)
              setOverCol(null)
            }}
            className={`rounded-xl border p-3 transition-colors ${
              overCol === col.id ? 'border-primary bg-primary/5' : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center justify-between px-1 pb-3">
              <h2 className="font-display font-black text-[13px] tracking-[-0.01em] text-foreground uppercase">
                {col.label}
              </h2>
              <span className="font-mono text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                {colTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 min-h-[80px]">
              {colTasks.map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={() => setDragId(task.id)}
                  onDragEnd={() => {
                    setDragId(null)
                    setOverCol(null)
                  }}
                  onClick={() => onOpen(task.id)}
                  className={`group relative rounded-lg border border-border bg-background p-3 shadow-sm cursor-pointer transition-opacity ${
                    dragId === task.id ? 'opacity-50' : 'hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical
                      size={14}
                      className="mt-0.5 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-black text-[13px] leading-tight text-foreground pr-5">
                        {task.title}
                      </h3>

                      {fields.includes('tags') && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {(fields.includes('priority') || fields.includes('date')) && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          {fields.includes('priority') ? (
                            <span
                              className={`font-mono text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full font-semibold ${priorityStyles[task.priority]}`}
                            >
                              {task.priority}
                            </span>
                          ) : (
                            <span />
                          )}
                          {fields.includes('date') && (
                            <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                              <Calendar size={11} />
                              {formatDate(task.date)}
                            </span>
                          )}
                        </div>
                      )}

                      {fields.includes('owner') && task.owners.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                          <User size={11} className="shrink-0" />
                          <span className="font-mono text-[10px] truncate">{task.owners.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
