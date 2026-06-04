import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { FiBold, FiItalic, FiList, FiArrowUp, FiArrowDown, FiSave, FiAlignLeft, FiAlignCenter, FiAlignRight } from "react-icons/fi";
import { apiClient } from "../../api/client";
import { socket } from "../../socket/socket";
import { useAuth } from "../../context/AuthContext";
import { showError } from "../../utils/toast";

const TextEditorSection = ({ section, canEdit, onDelete, onUpdate, onMoveUp, onMoveDown, onSave, isFirst, isLast, setEditingSectionId }) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState(section.content || "");
  const [locking, setLocking] = useState(false);
  const isLocked = !!section.locked_by && section.locked_by !== user?.id;

  const handleLock = async () => {
    if (!canEdit || isLocked || locking) return;
    setLocking(true);
    try {
      await apiClient.sections.lock(section.id);
      socket.emit("lock_section", { sectionId: section.id, userId: user.id });
    } catch (error) {
      console.error(error);
    } finally {
      setLocking(false);
    }
  };

  const handleUnlock = async () => {
    try {
      await apiClient.sections.unlock(section.id);
      socket.emit("unlock_section", { sectionId: section.id });
    } catch (error) {
      console.error(error);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Write something...",
        emptyEditorClass: "before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:h-0 before:pointer-events-none",
      }),
    ],
    content: section.content ?? "",
    editable: canEdit && !isLocked,
    onFocus: () => {
      setEditingSectionId(section.id);
      handleLock();
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onUpdate(section.id, { content });
      setHasChanges(content !== lastSavedContent);
    },
  });

  const insertHeading = (level) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    if (!selectedText.trim()) {
      showError("Select text first");
      return;
    }
    editor.chain().focus().deleteSelection().insertContent(`<h${level}>${selectedText}</h${level}><p></p>`).run();
  };

  const applyAlignment = (align) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    if (!selectedText.trim()) {
      editor.chain().focus().setTextAlign(align).run();
      return;
    }
    editor.chain().focus().deleteSelection().insertContent(`<p style="text-align:${align}">${selectedText}</p><p></p>`).run();
  };

  useEffect(() => {
    if (editor?.isFocused) return;
    if (editor && section.content !== editor.getHTML()) {
      editor.commands.setContent(section.content ?? "");
    }
  }, [section.content]);

  useEffect(() => {
    return () => {
      setEditingSectionId(null);
      handleUnlock();
    };
  }, []);

  const handleSave = async () => {
    if (!editor || !hasChanges) return;
    setIsSaving(true);
    try {
      const content = editor.getHTML();
      await onSave(section.id, { content });
      setLastSavedContent(content);
      setHasChanges(false);
      await handleUnlock();
      setEditingSectionId(null);
    } catch (error) {
      console.error(error);
      showError("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) return null;

  const buttonClass = "border rounded-lg py-2 flex items-center justify-center hover:bg-white dark:hover:bg-dark-surface transition";

  return (
    <div className="card p-6 relative">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="relative">
            <EditorContent
              editor={editor}
              className="border rounded-lg min-h-[200px] p-4 bg-white dark:bg-dark-surface focus-within:ring-2 focus-within:ring-blue-500 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_p]:mb-3"
            />
            {isLocked && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="bg-white dark:bg-dark-background px-5 py-3 rounded-lg">Section is being edited</div>
              </div>
            )}
          </div>
        </div>

        {canEdit && !isLocked && (
          <div className="w-full md:w-56 flex flex-col">
            <div className="grid grid-cols-3 md:grid-cols-2 gap-3">
              <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }} className={buttonClass}><FiBold /></button>
              <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }} className={buttonClass}><FiItalic /></button>
              <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }} className={buttonClass}><FiList /></button>
              <button onMouseDown={(e) => { e.preventDefault(); insertHeading(1); }} className={buttonClass}>H1</button>
              <button onMouseDown={(e) => { e.preventDefault(); insertHeading(2); }} className={buttonClass}>H2</button>
              <button onMouseDown={(e) => { e.preventDefault(); insertHeading(3); }} className={buttonClass}>H3</button>
              <button onMouseDown={(e) => { e.preventDefault(); applyAlignment("left"); }} className={buttonClass}><FiAlignLeft /></button>
              <button onMouseDown={(e) => { e.preventDefault(); applyAlignment("center"); }} className={buttonClass}><FiAlignCenter /></button>
              <button onMouseDown={(e) => { e.preventDefault(); applyAlignment("right"); }} className={buttonClass}><FiAlignRight /></button>
            </div>

            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center justify-center gap-2 mt-4 rounded-lg px-4 py-2 ${hasChanges && !isSaving ? "bg-blue-600 text-white" : "bg-gray-400 text-gray-700"}`}
            >
              <FiSave />
              {isSaving ? "Saving..." : "Save"}
            </button>

            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
              <button onClick={onMoveUp} disabled={isFirst} className={buttonClass}><FiArrowUp /></button>
              <button onClick={onMoveDown} disabled={isLast} className={buttonClass}><FiArrowDown /></button>
            </div>

            <button onClick={() => onDelete(section.id)} className="mt-4 bg-red-500 text-white rounded-lg py-2">✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditorSection;