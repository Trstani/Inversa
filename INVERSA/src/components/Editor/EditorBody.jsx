import { useState, useEffect } from "react";
import EditorNavigation from "./EditorNavigation";
import EditorActions from "./EditorActions";
import TextEditorSection from "./TextEditorSection";
import ImageSection from "./ImageSection";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../api/client";
import { socket }from '../../socket/socket';
const EditorBody = ({
  chapter,
  chapters,
  onSelectChapter,
  onSave,
  loading,
  onBack,
  isInitiator,
  isTeamMember,
}) => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);
  const [savingSection, setSavingSection] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const MAX_TOTAL = 20;
  const MAX_TEXT = 15;
  const MAX_IMAGE = 5;
  
  useEffect(() => {

  socket.on(
    'connect',
    () => {

      console.log(
        '⚡ Socket connected'
      );

    }
  );

  socket.on(
    'connect_error',
    (err) => {

      console.error(
        '❌ Socket error:',
        err
      );

    }
  );

  return () => {

    socket.off('connect');
    socket.off('connect_error');

  };

}, []);

  const loadSections = async () => {
    try {
      const response =
        await apiClient.sections.getByChapter(chapter.id);

      setSections(response.data || []);
    } catch (error) {
      console.error('Failed to load sections:', error);
    }
  };

  useEffect(() => {
    if (!chapter) return;

    setTitle(chapter.title || "");

    loadSections();
  }, [chapter]);

  useEffect(() => {

    if (!chapter?.id) {
      return;
    }

    const interval =
      setInterval(async () => {

        try {

          const response =
            await apiClient.sections
              .getByChapter(
                chapter.id
              );

          setSections((prev) => {

            return (
              response.data || []
            ).map((incoming) => {

              /*
              =========================
              KEEP LOCAL EDITOR STATE
              =========================
              */

              if (
                incoming.id ===
                editingSectionId
              ) {

                const local =
                  prev.find(
                    (p) =>
                      p.id === incoming.id
                  );

                return local || incoming;
              }

              return incoming;
            });

          });

        } catch (error) {

          console.error(
            "Polling failed:",
            error
          );

        }

      }, 3000);

    return () =>
      clearInterval(interval);

  }, [chapter?.id]);

  if (!chapter) {
    return <div>Loading...</div>;
  }

  


  const isDraft = chapter.status === "draft";

  // 🔥 LOGIC UPDATED
  // Initiator: always can edit
  // Team member: always can edit (full collaboration rights)
  // Others: cannot edit
  const canEdit = isInitiator || isTeamMember;

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

  const addTextSection = async () => {
    if (!canAddText) return;

    try {
      const nextOrder = sections.length + 1;

      const response = await apiClient.sections.create({
        chapter_id: chapter.id,
        type: "text",
        content: "",
        section_order: nextOrder,
      });

      setSections((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to add section:', error);
      alert('Failed to add section');
    }
  };

  const addImageSection = async () => {
    if (!canAddImage) return;

    try {
      const nextOrder = sections.length + 1;

      const response = await apiClient.sections.create({
        chapter_id: chapter.id,
        type: "image",
        image_url: "",
        caption: "",
        section_order: nextOrder,
      });

      setSections((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to add section:', error);
      alert('Failed to add section');
    }
  };

  const updateSection = (id, newData) => {
    if (!canEdit) return;

    setSections((prev) =>
      prev.map((sec) =>
        sec.id === id ? { ...sec, ...newData } : sec
      )
    );
  };

  const saveSectionToAPI = async (sectionId, data) => {
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    if (!canEdit) {
      alert("You do not have permission to edit this chapter.");
      return;
    }

    setSavingSection(sectionId);
    try {
      await apiClient.sections.update(sectionId, data);
      alert("Section saved successfully!");
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section: ' + error.message);
    } finally {
      setSavingSection(null);
    }
  };

  const moveSection = async (
    index,
    direction
  ) => {

    if (!canEdit || isReordering) return;

    setIsReordering(true);

    try {

      const newSections = [...sections];

      const targetIndex =
        direction === 'up'
          ? index - 1
          : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= sections.length
      ) {
        return;
      }

      // swap
      [
        newSections[index],
        newSections[targetIndex],
      ] = [
          newSections[targetIndex],
          newSections[index],
        ];

      // rebuild order
      const reorderedSections =
        newSections.map((sec, idx) => ({
          ...sec,
          section_order: idx + 1,
        }));

      // optimistic UI
      setSections(reorderedSections);

      // IMPORTANT:
      // wait ALL request finish
      for (const sec of reorderedSections) {

        await apiClient.sections.reorder(
          sec.id,
          {
            section_order:
              Number(sec.section_order),
          }
        );

      }

      // reload from DB
      await loadSections();

    } catch (error) {

      console.error(
        'Reorder failed:',
        error
      );

      alert(
        'Failed to reorder sections'
      );

    } finally {

      setIsReordering(false);

    }
  };

  const deleteSection = (id) => {
    if (!canEdit) return;

    setSections((prev) =>
      prev.filter((sec) => sec.id !== id)
    );

    apiClient.sections.delete(id).catch((error) => {
      console.error('Delete failed:', error);
    });
  };

  const handleImageUpload = (id, file) => {
    if (!file || !canEdit) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateSection(id, { image_url: reader.result });
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

    const updatedChapter = {
      id: chapter.id,
      title,
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

      {/* PUBLISHED INFO */}
      {!isDraft && (
        <div className="mb-6 p-3 bg-emerald-300 text-emerald-700 rounded-lg">

          {chapter?.is_team_project
            ? "This chapter is published. Team edits will update the live version for readers."
            : "This chapter is published. Any changes will update the live version."
          }

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
        {sections.map((section, index) => {
          if (section.type === "text") {
            return (
              <TextEditorSection
                key={section.id}
                section={section}
                canEdit={canEdit}
                setEditingSectionId={setEditingSectionId}
                onDelete={deleteSection}
                onUpdate={updateSection}
                onSave={saveSectionToAPI}

                onMoveUp={() =>
                  moveSection(index, 'up')
                }

                onMoveDown={() =>
                  moveSection(index, 'down')
                }

                isFirst={index === 0}

                isLast={
                  index === sections.length - 1
                }

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
                onSave={saveSectionToAPI}

                onMoveUp={() =>
                  moveSection(index, 'up')
                }

                onMoveDown={() =>
                  moveSection(index, 'down')
                }

                isFirst={index === 0}

                isLast={
                  index === sections.length - 1
                }
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
        onSaveDraft={() => { if (isReordering) { alert('Please wait until reorder finishes.'); return; } handleSave(false); }}
        onPublish={() => handleSave(true)}
        loading={loading}
        isInitiator={isInitiator}
        isTeamMember={isTeamMember}
        chapterStatus={chapter?.status}
      />
    </>
  );
};

export default EditorBody;