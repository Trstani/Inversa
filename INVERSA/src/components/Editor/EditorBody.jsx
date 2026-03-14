import { useState, useEffect } from "react";
import EditorNavigation from "./EditorNavigation";
import EditorActions from "./EditorActions";
import TextEditorSection from "./TextEditorSection";
import ImageSection from "./ImageSection";
import { useAuth } from "../../context/AuthContext";
import { submitContribution } from "../../utils/dataManager/index";

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

    // =============================
    // COLLABORATOR FLOW
    // =============================

    if (!isInitiator) {

      submitContribution({
        projectId: chapter.projectId,
        chapterId: chapter.id,
        authorId: user.id,
        content: sections,
        originalContent: chapter.sections
      });

      alert("Contribution submitted for review.");

      return;
    }

    // =============================
    // INITIATOR FLOW (DIRECT SAVE)
    // =============================

    const newVersionNumber = (chapter.currentVersion || 0) + 1;

    const newVersion = {
      version: newVersionNumber,
      editedBy: user.id,
      sections: sections,
      createdAt: new Date().toISOString(),
    };

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
            className={`${canAddText
              ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 rounded-lg"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Add Text
          </button>

          <button
            onClick={addImageSection}
            disabled={!canAddImage}
            className={`${canAddImage
              ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 rounded-lg"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Add Image
          </button>
        </div>
      )}

      {/* RENDER SECTIONS */}
      <div className="space-y-8">
        {sections.map((section) => {
          if (section.type === "text") {
            return (
              <TextEditorSection
                key={section.id}
                section={section}
                canEdit={canEdit}
                onDelete={deleteSection}
                onUpdate={updateSection}
              />
            );
          }

          if (section.type === "image") {
            return (
              <ImageSection
                key={section.id}
                section={section}
                canEdit={canEdit}
                onDelete={deleteSection}
                onUpdate={updateSection}
                onUpload={handleImageUpload}
              />
            );
          }

          return null;
        })}
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