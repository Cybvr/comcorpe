import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

function safeName(name: string | null): string | null {
  if (!name || name.includes('..') || name.includes('/') || name.includes('\\')) return null
  return name
}

export async function GET(req: NextRequest) {
  const name = safeName(req.nextUrl.searchParams.get('name'))
  if (!name) return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })

  const docsDir = join(process.cwd(), 'content', 'docs')
  try {
    const content = readFileSync(join(docsDir, name), 'utf-8')
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function PUT(req: NextRequest) {
  const name = safeName(req.nextUrl.searchParams.get('name'))
  if (!name) return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })

  const { content } = await req.json()
  if (typeof content !== 'string') {
    return NextResponse.json({ error: 'content must be a string' }, { status: 400 })
  }

  const docsDir = join(process.cwd(), 'content', 'docs')
  writeFileSync(join(docsDir, name), content, 'utf-8')
  return NextResponse.json({ ok: true })
}
