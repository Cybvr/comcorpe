'use client'

import { useCallback, useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { TableKit } from '@tiptap/extension-table'
import { TaskList, TaskItem } from '@tiptap/extension-list'

function displayName(name: string) {
  return name.replace(/\.(md|txt|html)$/, '').replace(/-/g, ' ')
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function parseInlineMarkdown(text: string): string {
  const escaped = escapeHtml(text)

  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
}

function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let i = 0

  while (i < lines.length) {
    const trimmed = lines[i].trim()

    if (!trimmed) {
      i += 1
      continue
    }

    if (/^---+$/.test(trimmed)) {
      html.push('<hr>')
      i += 1
      continue
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      html.push(`<h${level}>${parseInlineMarkdown(heading[2])}</h${level}>`)
      i += 1
      continue
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''))
        i += 1
      }
      html.push(`<blockquote><p>${quoteLines.map(parseInlineMarkdown).join('<br>')}</p></blockquote>`)
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(`<li>${parseInlineMarkdown(lines[i].trim().replace(/^[-*]\s+/, ''))}</li>`)
        i += 1
      }
      html.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${parseInlineMarkdown(lines[i].trim().replace(/^\d+\.\s+/, ''))}</li>`)
        i += 1
      }
      html.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    if (/^\|/.test(trimmed)) {
      const tableLines: string[] = []
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        tableLines.push(lines[i].trim())
        i += 1
      }
      const parseRow = (row: string) =>
        row.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      const isSeparator = (row: string) => /^[\s|:-]+$/.test(row)
      const [headerRow, sepRow, ...bodyRows] = tableLines
      if (sepRow && isSeparator(sepRow)) {
        const heads = parseRow(headerRow).map((c) => `<th>${parseInlineMarkdown(c)}</th>`).join('')
        const rows = bodyRows.map((r) =>
          `<tr>${parseRow(r).map((c) => `<td>${parseInlineMarkdown(c)}</td>`).join('')}</tr>`
        ).join('')
        html.push(`<table><thead><tr>${heads}</tr></thead><tbody>${rows}</tbody></table>`)
      } else {
        tableLines.forEach((l) => html.push(`<p>${parseInlineMarkdown(l)}</p>`))
      }
      continue
    }

    const paragraphLines: string[] = []
    while (i < lines.length) {
      const nextTrimmed = lines[i].trim()
      if (
        !nextTrimmed ||
        /^---+$/.test(nextTrimmed) ||
        /^(#{1,6})\s+/.test(nextTrimmed) ||
        /^>\s?/.test(nextTrimmed) ||
        /^[-*]\s+/.test(nextTrimmed) ||
        /^\d+\.\s+/.test(nextTrimmed) ||
        /^\|/.test(nextTrimmed)
      ) {
        break
      }

      paragraphLines.push(parseInlineMarkdown(nextTrimmed))
      i += 1
    }

    html.push(`<p>${paragraphLines.join('<br>')}</p>`)
  }

  return html.join('')
}

export default function DocEditor({
  name,
  saved,
  setSaved,
  onSave,
}: {
  name: string
  saved: boolean
  setSaved: (v: boolean) => void
  onSave: () => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TableKit,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: '',
    onUpdate: () => setSaved(false),
  })

  useEffect(() => {
    if (!name || !editor) return

    fetch(`/api/docs/content?name=${encodeURIComponent(name)}`)
      .then((r) => r.json())
      .then((data) => {
        const raw: string = data.content ?? ''
        const isHtml = raw.trimStart().startsWith('<')
        editor.commands.setContent(isHtml ? raw : mdToHtml(raw))
        setSaved(true)
      })
  }, [name, editor, setSaved])

  const save = useCallback(async () => {
    if (!editor) return

    const html = editor.getHTML()
    await fetch(`/api/docs/content?name=${encodeURIComponent(name)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: html }),
    })
    onSave()
  }, [editor, name, onSave])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [save])

  if (!editor) return null

  const btn = (active: boolean) =>
    `px-2 py-1 rounded text-xs transition-colors ${
      active ? 'bg-foreground text-background' : 'hover:bg-accent text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <h1 className="text-sm font-medium capitalize">{displayName(name)}</h1>
        <button
          onClick={save}
          disabled={saved}
          className="rounded border border-border px-3 py-1 text-xs transition-colors hover:bg-accent disabled:cursor-default disabled:opacity-40"
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-4 py-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}>
          <em>I</em>
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))}>
          <s>S</s>
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))}>
          <u>U</u>
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))}>H3</button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}>Bullets</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}>1. List</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))}>Quote</button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} className={btn(editor.isActive('code'))}>{'<>'}</button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={btn(editor.isActive('taskList'))}>☑ Tasks</button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className={btn(false)}
        >
          Table
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>HR</button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={btn(false) + ' disabled:opacity-30'}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={btn(false) + ' disabled:opacity-30'}
        >
          Redo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <EditorContent
          editor={editor}
          className="prose prose-sm mx-auto max-w-2xl [&_.tiptap]:min-h-[200px] [&_.tiptap]:outline-none [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_li[data-checked]>label]:line-through"
        />
      </div>
    </div>
  )
}
