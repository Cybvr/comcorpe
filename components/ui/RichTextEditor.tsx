'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Minus,
} from 'lucide-react'

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write here…',
}: {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[320px] font-text text-sm text-foreground leading-relaxed prose prose-sm max-w-none prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border bg-muted/30">
        <ToolbarButton
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 size={15} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1.5" />
        <ToolbarButton
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={15} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1.5" />
        <ToolbarButton
          title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1.5" />
        <ToolbarButton
          title="Divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={15} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="px-5 py-4" />
    </div>
  )
}
