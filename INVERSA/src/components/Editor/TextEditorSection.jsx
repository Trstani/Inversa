import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import {
  FiBold,
  FiItalic,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiType,
  FiArrowUp,
  FiArrowDown,
  FiSave,
} from "react-icons/fi";

import { apiClient } from "../../api/client";
import { socket } from "../../socket/socket";
import { useAuth } from "../../context/AuthContext";

const TextEditorSection = ({
  section,
  canEdit,
  onDelete,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onSave,
  isFirst,
  isLast,
  setEditingSectionId,
}) => {

  const { user } = useAuth();

  /*
  =========================
  STATES
  =========================
  */

  const [isSaving, setIsSaving] =
    useState(false);

  const [hasChanges, setHasChanges] =
    useState(false);

  const [
    lastSavedContent,
    setLastSavedContent,
  ] = useState(
    section.content || ""
  );

  const [isLocked, setIsLocked] =
      section.locked_by &&
      section.locked_by !== user?.id

  const [locking, setLocking] =
    useState(false);

  /*
  =========================
  LOCK SECTION
  =========================
  */

  const handleLock = async () => {

    if (
      !canEdit ||
      isLocked ||
      locking
    ) {
      return;
    }

    try {

      setLocking(true);

      await apiClient.sections.lock(
        section.id
      );

      socket.emit(
        "lock_section",
        {
          sectionId: section.id,
          userId: user.id,
        }
      );

      setIsLocked(false);

    } catch (error) {

      console.error(error);

      setIsLocked(true);

    } finally {

      setLocking(false);

    }
  };

  /*
  =========================
  UNLOCK SECTION
  =========================
  */

  const handleUnlock =
    async () => {

      try {

        await apiClient.sections.unlock(
          section.id
        );

        socket.emit(
          "unlock_section",
          {
            sectionId: section.id,
          }
        );

      } catch (error) {

        console.error(
          "Unlock failed:",
          error
        );

      }
    };

  /*
  =========================
  EDITOR
  =========================
  */

  const editor = useEditor({

    extensions: [

      StarterKit,

      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
        ],
      }),

      Placeholder.configure({

        placeholder: ({
          node,
        }) => {

          if (
            node.type.name ===
            "heading"
          ) {
            return "Title";
          }

          return "Write something...";
        },

        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:h-0 before:pointer-events-none",

      }),

    ],

    content:
      section.content || "",

    editable:
      canEdit && !isLocked,

    onFocus: () => {

      setEditingSectionId(
        section.id
      );

      handleLock();
    },

    onUpdate: ({ editor }) => {

      const content =
        editor.getHTML();

      onUpdate(section.id, {
        content,
      });

      setHasChanges(
        content !==
        lastSavedContent
      );
    },

  });

  /*
  =========================
  SYNC CONTENT
  =========================
  */

  useEffect(() => {

    /*
    =========================
    SKIP ACTIVE EDITOR
    =========================
    */

    if (
      editor?.isFocused
    ) {
      return;
    }

    /*
    =========================
    SYNC REMOTE CONTENT
    =========================
    */

    if (
      editor &&
      section.content !==
      editor.getHTML()
    ) {

      editor.commands.setContent(
        section.content || ""
      );
    }

  }, [section.content]);
  /*
  =========================
  CLEANUP
  =========================
  */

  useEffect(() => {

    return () => {

      setEditingSectionId(null);

      handleUnlock();

    };

  }, []);

  /*
  =========================
  SAVE
  =========================
  */

  const handleSave =
    async () => {

      if (
        !editor ||
        !hasChanges
      ) {
        return;
      }

      setIsSaving(true);

      try {

        const content =
          editor.getHTML();

        await onSave(
          section.id,
          { content }
        );

        setLastSavedContent(
          content
        );

        setHasChanges(false);

        await handleUnlock();

        setEditingSectionId(null);

      } catch (error) {

        console.error(
          "Failed to save section:",
          error
        );

        alert(
          "Failed to save section"
        );

      } finally {

        setIsSaving(false);

      }
    };

  /*
  =========================
  RENDER
  =========================
  */

  if (!editor) return null;

  const buttonClass =
    "border rounded-lg py-2 flex items-center justify-center hover:bg-white dark:hover:bg-dark-surface";

  return (

    <div className="card p-6 relative">

      {/* LOCK OVERLAY */}

      {isLocked && (

        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">

          <div className="bg-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium dark:bg-dark-background dark:text-white">
            Section is being edited
          </div>

        </div>

      )}

      <div className="flex gap-6">

        {/* EDITOR */}

        <div className="flex-1">

          <EditorContent
            editor={editor}
            className="border rounded-lg min-h-[200px] p-4 bg-white dark:bg-dark-surface focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:cursor-text [&_.ProseMirror_p]:m-0"
          />

        </div>

        {/* TOOLBAR */}

        {canEdit && !isLocked && (

          <div className="w-56 flex flex-col">

            <div className="grid grid-cols-2 gap-3">

              <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass}>
                <FiBold />
              </button>

              <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass}>
                <FiItalic />
              </button>

              <button onClick={() => editor.chain().focus().setParagraph().run()} className={buttonClass}>
                <FiType />
              </button>

              <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass}>
                <FiList />
              </button>

              <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass}>
                1.
              </button>

              <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={buttonClass}>
                <FiAlignLeft />
              </button>

              <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={buttonClass}>
                <FiAlignCenter />
              </button>

              <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={buttonClass}>
                <FiAlignRight />
              </button>

              <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass}>
                H1
              </button>

              <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass}>
                H2
              </button>

              <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClass}>
                H3
              </button>

            </div>

            {/* SAVE */}

            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center justify-center gap-2 font-medium rounded-lg text-sm px-4 py-2.5 mt-4 ${hasChanges && !isSaving
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50"
                  : "bg-gray-400 cursor-not-allowed text-gray-600"
                }`}
            >

              <FiSave />

              {isSaving
                ? "Saving..."
                : "Save"}

            </button>

            {/* MOVE */}

            <div className="grid grid-cols-2 gap-3 mt-4">

              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className={buttonClass}
              >
                <FiArrowUp />
              </button>

              <button
                onClick={onMoveDown}
                disabled={isLast}
                className={buttonClass}
              >
                <FiArrowDown />
              </button>

            </div>

            {/* DELETE */}

            <button
              onClick={() =>
                onDelete(section.id)
              }
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-lg text-sm px-4 py-2.5 mt-4"
            >
              ✕
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default TextEditorSection;