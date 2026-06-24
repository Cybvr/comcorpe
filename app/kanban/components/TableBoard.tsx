'use client'

import { COLUMNS, type Priority, type Status, type Task } from '../tasks'
import { formatDate, PRIORITIES } from '../config'

export default function TableBoard({
  tasks,
  updateTask,
  onOpen,
}: {
  tasks: Task[]
  updateTask: (id: string, patch: Partial<Task>) => void
  onOpen: (id: string) => void
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {['Task', 'Status', 'Priority', 'Owner', 'Date'].map((h) => (
              <th
                key={h}
                className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              onClick={() => onOpen(task.id)}
              className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors align-middle cursor-pointer"
            >
              <td className="px-4 py-3 max-w-[420px]">
                <p className="font-display font-black text-[13px] text-foreground leading-tight hover:underline underline-offset-2">
                  {task.title}
                </p>
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <select
                  value={task.status}
                  onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
                  className="font-text text-xs rounded-md border border-border bg-background px-2 py-1 text-foreground"
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <select
                  value={task.priority}
                  onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
                  className="font-text text-xs rounded-md border border-border bg-background px-2 py-1 text-foreground capitalize"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p} className="capitalize">
                      {p}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-[11px] text-muted-foreground">{task.owners.join(', ')}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="font-mono text-[11px] text-muted-foreground">{formatDate(task.date)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
