// components/editor/EditorToolbar.jsx
import {
  FiBold,
  FiItalic,
  FiList,
  FiCode,
} from "react-icons/fi";

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-3 border rounded">
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        <FiBold />
      </button>

      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        <FiItalic />
      </button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FiList />
      </button>

      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <FiCode />
      </button>
    </div>
  );
};

export default EditorToolbar;
