// Shared types, constants and helpers for the kanban/table views.
import type { Priority } from './tasks'

export type ViewType = 'kanban' | 'table'

// A user-created (or default) saved view. Local-only — persisted to localStorage.
export type View = {
  id: string
  name: string
  type: ViewType
}

export const DEFAULT_VIEWS: View[] = [
  { id: 'board', name: 'Board', type: 'kanban' },
  { id: 'table', name: 'Table', type: 'table' },
]

export type GroupBy = 'status' | 'priority'

export const PRIORITY_COLUMNS: { id: Priority; label: string }[] = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

export type CardField = 'tags' | 'priority' | 'date' | 'owner'

export const CARD_FIELDS: { id: CardField; label: string }[] = [
  { id: 'tags', label: 'Tags' },
  { id: 'priority', label: 'Priority' },
  { id: 'date', label: 'Date' },
  { id: 'owner', label: 'Owner' },
]

export const PRIORITIES: Priority[] = ['low', 'medium', 'high']

export const priorityStyles: Record<Priority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-primary/10 text-primary',
  high: 'bg-red-500/10 text-red-600',
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
