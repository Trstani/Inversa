import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import EditorToolbar from "./EditorToolbar"

const TextEditorSection = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="border p-4 rounded-lg min-h-[150px] bg-white dark:bg-dark-surface"
      />
    </div>
  )
}

export default TextEditorSection