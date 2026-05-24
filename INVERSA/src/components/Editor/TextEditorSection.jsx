import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { FiBold, FiItalic, FiList, FiType, FiArrowUp, FiArrowDown, FiSave } from "react-icons/fi";
import { apiClient } from "../../api/client";
import { socket } from "../../socket/socket";
import { useAuth } from "../../context/AuthContext";

const TextEditorSection = ({ section, canEdit, onDelete, onUpdate, onMoveUp, onMoveDown, onSave, isFirst, isLast, setEditingSectionId }) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState(section.content || "");
  const isLocked = !!section.locked_by && section.locked_by !== user?.id;
  const [locking, setLocking] = useState(false);

  const handleLock = async () => {
    if (!canEdit || isLocked || locking) return;
    setLocking(true);
    try {
      await apiClient.sections.lock(section.id);
      socket.emit("lock_section", { sectionId: section.id, userId: user.id });
    } catch (error) { console.error(error); } finally { setLocking(false); }
  };

  const handleUnlock = async () => {
    try { await apiClient.sections.unlock(section.id); socket.emit("unlock_section", { sectionId: section.id }); } catch (error) { console.error("Unlock failed:", error); }
  };

  const editor = useEditor({
    extensions: [

      StarterKit,

      Placeholder.configure({

        placeholder: () =>
          "Write something...",

        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:h-0 before:pointer-events-none"

      })

    ],
    content: section.content ?? "",
    editable: canEdit && !isLocked,
    onFocus: () => { setEditingSectionId(section.id); handleLock(); },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onUpdate(section.id, { content });
      setHasChanges(content !== lastSavedContent);
    },
  });

  useEffect(() => {
    if (editor?.isFocused) return;
    if (editor && section.content !== editor.getHTML()) editor.commands.setContent(section.content ?? "");
  }, [section.content]);

  useEffect(() => {
    return () => { setEditingSectionId(null); handleUnlock(); };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => handleUnlock();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
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
    } catch (error) { console.error("Failed to save section:", error); alert("Failed to save section"); } finally { setIsSaving(false); }
  };

  if (!editor) return null;

  const buttonClass = "border rounded-lg py-2 flex items-center justify-center hover:bg-white dark:hover:bg-dark-surface";

  return (
    <div className="card p-6 relative">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="relative">
            <EditorContent editor={editor} className="border rounded-lg min-h-[200px] p-4 bg-white dark:bg-dark-surface focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:cursor-text [&_.ProseMirror_p]:m-0" />
            {isLocked && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center rounded-lg">
                <div className="bg-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium dark:bg-dark-background dark:text-white">Section is being edited</div>
              </div>
            )}
          </div>
        </div>
        {canEdit && !isLocked && (
          <div className="w-56 flex flex-col">
            <div className="grid grid-cols-2 gap-3">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor
                    .chain()
                    .focus()
                    .toggleBold()
                    .run();
                }}
                className={buttonClass}
              >
                <FiBold />
              </button>

              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run();
                }}
                className={buttonClass}
              >
                <FiItalic />
              </button>

              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor
                    .chain()
                    .focus()
                    .setParagraph()
                    .run();
                }}
                className={buttonClass}
              >
                <FiType />
              </button>

              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor
                    .chain()
                    .focus()
                    .toggleBulletList()
                    .run();
                }}
                className={buttonClass}
              >
                <FiList />
              </button>

            </div>
            <button onClick={handleSave} disabled={!hasChanges || isSaving} className={`flex items-center justify-center gap-2 font-medium rounded-lg text-sm px-4 py-2.5 mt-4 ${hasChanges && !isSaving ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50" : "bg-gray-400 cursor-not-allowed text-gray-600"}`}>
              <FiSave />{isSaving ? "Saving..." : "Save"}
            </button>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={onMoveUp} disabled={isFirst} className={buttonClass}><FiArrowUp /></button>
              <button onClick={onMoveDown} disabled={isLast} className={buttonClass}><FiArrowDown /></button>
            </div>
            <button onClick={() => onDelete(section.id)} title="Delete Section" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-lg text-sm px-4 py-2.5 mt-4">✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditorSection;