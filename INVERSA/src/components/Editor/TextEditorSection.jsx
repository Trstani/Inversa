import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"

import {
  FiBold,
  FiItalic,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiType,
} from "react-icons/fi"

const TextEditorSection = ({
  section,
  canEdit,
  onDelete,
  onUpdate,

}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Title"
          }
          return "Write something..."
        },
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:h-0 before:pointer-events-none",
      }),
    ],
    content: section.content || "",
    editable: canEdit,
    onUpdate: ({ editor }) => {
      onUpdate(section.id, {
        content: editor.getHTML(),
      })
    },
  })

  if (!editor) return null

  const buttonClass =
    "border rounded-lg py-2 flex items-center justify-center hover:bg-white dark:hover:bg-dark-surface"

  return (
    <div className="card p-6">
      <div className="flex gap-6">

        {/* LEFT - EDITOR */}
        <div className="flex-1">
          <EditorContent
            editor={editor}
            className="prose dark:prose-invert border max-w-none rounded-lg min-h-[200px] p-4 bg-white dark:bg-dark-surface focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
          />
        </div>

        {/* RIGHT - TOOLBAR */}
        {canEdit && (
          <div className="w-56 flex flex-col">

            <div className="grid grid-cols-2 gap-3">

              {/* TEXT STYLE */}
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={buttonClass}
                title="Bold"
              >
                <FiBold />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={buttonClass}
                title="Italic"
              >
                <FiItalic />
              </button>

              <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={buttonClass}
                title="Paragraph"
              >
                <FiType />
              </button>

              {/* LIST */}
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonClass}
                title="Bullet List"
              >
                <FiList />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonClass}
                title="Numbered List"
              >
                1.
              </button>

              {/* ALIGN */}
              <button
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={buttonClass}
                title="Align Left"
              >
                <FiAlignLeft />
              </button>

              <button
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={buttonClass}
                title="Align Center"
              >
                <FiAlignCenter />
              </button>

              <button
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={buttonClass}
                title="Align Right"
              >
                <FiAlignRight />
              </button>

              {/* HEADINGS */}
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={buttonClass}
                title="Heading 1"
              >
                H1
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={buttonClass}
                title="Heading 2"
              >
                H2
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={buttonClass}
                title="Heading 3"
              >
                H3
              </button>

            </div>

            {/* DELETE */}
            <button
              onClick={() => onDelete(section.id)}
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 mt-4"
              title="Delete section"
            >
              ✕
            </button>

          </div>
        )}
      </div>
    </div>
  )
}

export default TextEditorSection