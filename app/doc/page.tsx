'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { FileText } from 'lucide-react'

const DocEditor = dynamic(() => import('./DocEditor'), { ssr: false })

type DocFile = {
  name: string
  updatedAt: string
}

function displayName(name: string) {
  return name.replace(/\.(md|txt|html)$/, '').replace(/-/g, ' ')
}

export default function DocPage() {
  const [files, setFiles] = useState<DocFile[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    fetch('/api/docs')
      .then((r) => r.json())
      .then((data: DocFile[]) => {
        setFiles(data)
        if (data.length > 0) setSelected(data[0].name)
      })
  }, [])

  return (
    <div className="flex h-screen bg-zinc-100 font-text overflow-hidden">
      <aside className="w-56 shrink-0 flex flex-col">
        <div className="px-4 py-4">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Docs</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {files.map((f) => (
            <button
              key={f.name}
              onClick={() => setSelected(f.name)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${selected === f.name
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
            >
              <FileText
                className={`h-4 w-4 shrink-0 ${selected === f.name ? 'text-accent-foreground' : 'text-muted-foreground'
                  }`}
              />
              <span className="block min-w-0 truncate">{displayName(f.name)}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-hidden p-4">
        {selected ? (
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <DocEditor
              key={selected}
              name={selected}
              saved={saved}
              setSaved={setSaved}
              onSave={() => setSaved(true)}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground shadow-sm">
            Select a file
          </div>
        )}
      </main>
    </div>
  )
}
