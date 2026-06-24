import { NextResponse } from 'next/server'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

export async function GET() {
  const docsDir = join(process.cwd(), 'content', 'docs')
  const files = readdirSync(docsDir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.txt'))
    .map((name) => {
      const stat = statSync(join(docsDir, name))
      return { name, updatedAt: stat.mtime.toISOString() }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return NextResponse.json(files)
}
