import { useState, useEffect } from "react";
import EditorNavigation from "./EditorNavigation";
import EditorActions from "./EditorActions";
import TextEditorSection from "./TextEditorSection";
import { useAuth } from "../../context/AuthContext";

const EditorBody = ({
  chapter,
  chapters,
  onSelectChapter,
  onSave,
  loading,
  onBack,
  isInitiator,
}) => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);

  const MAX_TOTAL = 20;
  const MAX_TEXT = 15;
  const MAX_IMAGE = 5;

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title || "");
      setSections(chapter.sections || []);
    }
  }, [chapter]);

  if (!chapter) {
    return (
      <div className="card p-8 text-center">
        No chapter selected.
      </div>
    );
  }

  const isDraft = chapter.status === "draft";

  // 🔥 LOGIC BARU
  // Initiator selalu bisa edit
  // Collaborator hanya bisa edit kalau draft
  const canEdit = isInitiator ? true : isDraft;

  const totalSections = sections.length;
  const textCount = sections.filter((s) => s.type === "text").length;
  const imageCount = sections.filter((s) => s.type === "image").length;

  const canAddText =
    canEdit &&
    totalSections < MAX_TOTAL &&
    textCount < MAX_TEXT;

  const canAddImage =
    canEdit &&
    totalSections < MAX_TOTAL &&
    imageCount < MAX_IMAGE;

  const addTextSection = () => {
    if (!canAddText) return;

    setSections((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "text",
        content: "",
      },
    ]);
  };

  const addImageSection = () => {
    if (!canAddImage) return;

    setSections((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "image",
        imageUrl: "",
        caption: "",
      },
    ]);
  };

  const updateSection = (id, newData) => {
    if (!canEdit) return;

    setSections((prev) =>
      prev.map((sec) =>
        sec.id === id ? { ...sec, ...newData } : sec
      )
    );
  };

  const deleteSection = (id) => {
    if (!canEdit) return;

    setSections((prev) =>
      prev.filter((sec) => sec.id !== id)
    );
  };

  const handleImageUpload = (id, file) => {
    if (!file || !canEdit) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateSection(id, { imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (publish = false) => {
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    if (!canEdit) {
      alert("You do not have permission to edit this chapter.");
      return;
    }

    if (sections.length > MAX_TOTAL) {
      alert("Section limit exceeded.");
      return;
    }

    const newVersionNumber = (chapter.currentVersion || 0) + 1;

    const newVersion = {
      version: newVersionNumber,
      editedBy: user.id,
      sections: sections,
      createdAt: new Date().toISOString(),
    };

    // 🔥 Status Logic:
    // - Kalau initiator edit published → tetap published
    // - Kalau collaborator save draft → tetap draft
    let newStatus = chapter.status;

    if (publish && isInitiator) {
      newStatus = "published";
    }

    const updatedChapter = {
      ...chapter,
      title,
      sections,
      currentVersion: newVersionNumber,
      versions: [...(chapter.versions || []), newVersion],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedChapter, publish);
  };

  return (
    <>
      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => canEdit && setTitle(e.target.value)}
        placeholder="Chapter Title"
        disabled={!canEdit}
        className="text-3xl font-bold w-full mb-6 bg-transparent disabled:opacity-60"
      />

      {/* COUNTER */}
      <div className="mb-4 text-sm text-gray-500">
        Sections: {totalSections} / {MAX_TOTAL} | Text:{" "}
        {textCount} / {MAX_TEXT} | Images: {imageCount} /{" "}
        {MAX_IMAGE}
      </div>

      {/* 🔥 Warning hanya untuk collaborator */}
      {!isDraft && !isInitiator && (
        <div className="mb-6 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
          This chapter is published. Editing is locked for collaborators.
        </div>
      )}

      {/* ADD SECTION BUTTONS */}
      {canEdit && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={addTextSection}
            disabled={!canAddText}
            className={`px-4 py-2 rounded-lg text-white ${
              canAddText
                ? "bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add Text
          </button>

          <button
            onClick={addImageSection}
            disabled={!canAddImage}
            className={`px-4 py-2 rounded-lg text-white ${
              canAddImage
                ? "bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add Image
          </button>
        </div>
      )}

      {/* RENDER SECTIONS */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="card p-6 relative">
            {canEdit && (
              <button
                onClick={() => deleteSection(section.id)}
                title="Delete section"
                className="absolute top-4 right-1 text-white bg-red-600 rounded-lg px-4 py-2"
              >
                ✕
              </button>
            )}

            {section.type === "text" && (
              <TextEditorSection
                content={section.content}
                readOnly={!canEdit}
                onChange={(html) =>
                  updateSection(section.id, { content: html })
                }
              />
            )}

            {section.type === "image" && (
              <div>
                {section.imageUrl ? (
                  <div className="w-full h-[300px] rounded-xl overflow-hidden mb-4">
                    <img
                      src={section.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  canEdit && (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-light-border dark:border-dark-border rounded-xl cursor-pointer hover:border-light-accent dark:hover:border-dark-accent transition-colors bg-light-surface dark:bg-dark-surface mb-4">
                      
                      <div className="flex flex-col items-center justify-center text-sm text-light-secondary dark:text-dark-secondary">
                        <span className="font-medium">Click to upload</span>
                        <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(
                            section.id,
                            e.target.files[0]
                          )
                        }
                        className="hidden"/>
                    </label>    
                  )
                )}

                <input
                  type="text"
                  placeholder="Caption (optional)"
                  value={section.caption}
                  disabled={!canEdit}
                  onChange={(e) =>
                    updateSection(section.id, {
                      caption: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg bg-white dark:bg-dark-surface disabled:opacity-60"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* NAVIGATION */}
      {chapters && chapters.length > 0 && (
        <EditorNavigation
          chapters={chapters}
          currentChapter={chapter}
          onSelectChapter={onSelectChapter}
        />
      )}

      {/* ACTIONS */}
      <EditorActions
        onBack={onBack}
        onSaveDraft={() => handleSave(false)}
        onPublish={() => handleSave(true)}
        loading={loading}
        isInitiator={isInitiator}
        chapterStatus={chapter?.status}
      />
    </>
  );
};

export default EditorBody;