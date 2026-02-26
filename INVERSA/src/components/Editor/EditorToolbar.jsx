// components/editor/EditorToolbar.jsx
import {
  FiBold,
  FiItalic,
  FiList,
  FiCode,
  FiType,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiMinus,
} from "react-icons/fi";

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const buttonClass =
    "px-2 py-1 border rounded hover:bg-gray-200 text-sm";

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-3 border rounded">

      {/* Heading */}
      <button
        className={buttonClass}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        H1
      </button>

      <button
        className={buttonClass}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        H2
      </button>

      <button
        className={buttonClass}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        H3
      </button>

      {/* Paragraph */}
      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <FiType />
      </button>

      {/* Basic formatting */}
      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FiBold />
      </button>

      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FiItalic />
      </button>

      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        S
      </button>

      {/* Lists */}
      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FiList />
      </button>

      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </button>

      {/* Blockquote */}
      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        "
      </button>

      {/* Code block */}
      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <FiCode />
      </button>

      {/* Horizontal line */}
      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <FiMinus />
      </button>

      {/* Undo / Redo */}
      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <FiCornerUpLeft />
      </button>

      <button
        className={buttonClass}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <FiCornerUpRight />
      </button>
    </div>
  );
};

export default EditorToolbar;