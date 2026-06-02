import { useState, useEffect } from "react";
import EditorNavigation from "./EditorNavigation";
import EditorActions from "./EditorActions";
import TextEditorSection from "./TextEditorSection";
import ImageSection from "./ImageSection";
import { useAuth } from "../../context/AuthContext";
import { getSocket } from "../../socket/socket";
import { apiClient } from "../../api/client";
import { supabase } from "../../lib/supabase";
import { deleteStorageFile } from "../../utils/storage";

const EditorBody = ({ chapter, chapters, onSelectChapter, onSave, loading, onBack, isInitiator, isTeamMember }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);
  const [savingSection, setSavingSection] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [hasUnsavedWorkspaceChanges, setHasUnsavedWorkspaceChanges] = useState(false);
  const MAX_TOTAL = 20, MAX_TEXT = 15, MAX_IMAGE = 5;

  useEffect(() => {

    const socket = getSocket();

    if (!socket) {
      console.warn('Socket not available');
      return;
    }

    const lock = ({
      sectionId,
      userId
    }) => {

      setSections(prev =>
        prev.map(sec =>
          sec.id === sectionId
            ? {
              ...sec,
              locked_by: userId
            }
            : sec
        )
      );

    };


    const unlock = ({
      sectionId
    }) => {

      setSections(prev =>
        prev.map(sec =>
          sec.id === sectionId
            ? {
              ...sec,
              locked_by: null
            }
            : sec
        )
      );

    };


    const updated = ({
      sectionId,
      image_url,
      caption,
      content
    }) => {

      setSections(prev =>
        prev.map(sec => {

          if (
            sec.id !== sectionId
          ) return sec;

          return {

            ...sec,

            image_url:
              image_url ??
              sec.image_url,

            caption:
              caption ??
              sec.caption,

            content:
              content ??
              sec.content

          };

        })
      );

    };


    socket.on(
      "section_locked",
      lock
    );

    socket.on(
      "section_unlocked",
      unlock
    );

    socket.on(
      "section_updated",
      updated
    );


    return () => {

      socket.off(
        "section_locked",
        lock
      );

      socket.off(
        "section_unlocked",
        unlock
      );

      socket.off(
        "section_updated",
        updated
      );

    };

  }, []);

  const hasActiveLocks = chapter?.is_team_project && sections.some(sec => sec.locked_by && sec.locked_by !== user?.id);

  const loadSections = async () => {
    try { const { data } = await apiClient.sections.getByChapter(chapter.id); setSections(data || []); } catch (e) { console.error("Load sections failed:", e); }
  };

  useEffect(() => { if (!chapter) return; setTitle(chapter.title || ""); loadSections(); }, [chapter]);

  useEffect(() => {

    if (!chapter?.id)
      return;

    const interval =
      setInterval(async () => {

        try {

          const { data } =
            await apiClient
              .sections
              .getByChapter(
                chapter.id
              );

          setSections(prev => {

            return (
              data || []
            ).map(incoming => {

              const current =
                prev.find(
                  sec =>
                    sec.id === incoming.id
                );

              // jangan overwrite
              // section yang sedang diedit user sendiri
              if (
                current?.id ===
                editingSectionId
              ) {

                return current;

              }

              return {

                ...current,
                ...incoming

              };

            });

          });

        } catch (e) {

          console.error(
            "Polling failed:",
            e
          );

        }

      }, 8000);

    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    chapter?.id,
    editingSectionId
  ]);

  if (!chapter?.id) return null;

  const isDraft = chapter.status === "draft";
  const canEdit = isInitiator || isTeamMember;
  const totalSections = sections.length;
  const textCount = sections.filter(s => s.type === "text").length;
  const imageCount = sections.filter(s => s.type === "image").length;
  const canAddText = canEdit && totalSections < MAX_TOTAL && textCount < MAX_TEXT;
  const canAddImage = canEdit && totalSections < MAX_TOTAL && imageCount < MAX_IMAGE;

  const addTextSection = async () => {
    if (!canAddText) return;
    try {
      const { data } = await apiClient.sections.create({ chapter_id: chapter.id, type: "text", content: "", section_order: sections.length + 1 });
      setSections(prev => [...prev, data]);
    } catch (e) { console.error("Add text section failed:", e); alert("Failed to add section"); }
  };

  const addImageSection = async () => {
    if (!canAddImage) return;
    try {
      const { data } = await apiClient.sections.create({ chapter_id: chapter.id, type: "image", image_url: "", caption: "", section_order: sections.length + 1 });
      setSections(prev => [...prev, data]);
    } catch (e) { console.error("Add image section failed:", e); alert("Failed to add section"); }
  };

  const updateSection = (id, newData) => canEdit && setSections(prev => prev.map(sec => sec.id === id ? { ...sec, ...newData } : sec));

  const saveSectionToAPI = async (sectionId, data) => {
    if (!user) return alert("You must be logged in.");
    if (!canEdit) return alert("You do not have permission to edit this chapter.");
    setSavingSection(sectionId);
    try { await apiClient.sections.update(sectionId, data); alert("Section saved successfully!"); } catch (e) { console.error("Save section failed:", e); alert("Failed to save section: " + e.message); } finally { setSavingSection(null); }
  };

  const moveSection = async (index, direction) => {
    if (!canEdit || isReordering) return;
    setIsReordering(true);
    try {
      const newSections = [...sections];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= sections.length) return;
      [newSections[index], newSections[target]] = [newSections[target], newSections[index]];
      const reordered = newSections.map((sec, i) => ({ ...sec, section_order: i + 1 }));
      setSections(reordered);
      setHasUnsavedWorkspaceChanges(true);
      for (const sec of reordered) await apiClient.sections.reorder(sec.id, { section_order: Number(sec.section_order) });
      await loadSections();
    } catch (e) { console.error("Reorder failed:", e); alert("Failed to reorder sections"); } finally { setIsReordering(false); }
  };

  const deleteSection =
    async (id) => {

      if (!canEdit)
        return;

      try {

        const targetSection =
          sections.find(
            sec =>
              sec.id === id
          );

        console.log(
          "TARGET:",
          targetSection
        );

        if (
          targetSection?.type === "image"
          &&
          targetSection?.image_url
        ) {

          console.log(
            "DELETE IMAGE:",
            targetSection.image_url
          );

          await deleteStorageFile(
            targetSection.image_url
          );

        }

        await apiClient
          .sections
          .delete(
            id
          );

        setSections(
          prev =>
            prev.filter(
              sec =>
                sec.id !== id
            )
        );

      } catch (error) {

        console.error(
          "Delete failed:",
          error
        );

      }

    };

  const handleImageUpload = async (
    id,
    file
  ) => {

    if (
      !file ||
      !canEdit
    ) return;

    try {

      const fileName =
        `${Date.now()}-${file.name}`;

      const { error } =
        await supabase
          .storage
          .from("images")
          .upload(
            fileName,
            file
          );

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl }
      } =
        supabase
          .storage
          .from("images")
          .getPublicUrl(
            fileName
          );

      updateSection(
        id,
        {
          image_url:
            publicUrl
        }
      );

    } catch (error) {

      console.error(
        "Upload failed:",
        error
      );

      alert(
        "Failed upload image"
      );

    }

  };

  const handleSave = (publish = false) => {
    if (!user) return alert("You must be logged in.");
    if (!canEdit) return alert("You do not have permission to edit this chapter.");
    if (sections.length > MAX_TOTAL) return alert("Section limit exceeded.");
    onSave({ id: chapter.id, title }, publish);
    setHasUnsavedWorkspaceChanges(false);
  };

  return (
    <>
      <input value={title} onChange={e => { if (!canEdit) return; setTitle(e.target.value); setHasUnsavedWorkspaceChanges(true); }} placeholder="Chapter Title" disabled={!canEdit} className="text-3xl font-bold w-full mb-6 bg-transparent disabled:opacity-60" />
      <div className="mb-4 text-sm text-gray-500">Sections: {totalSections} / {MAX_TOTAL} | Text: {textCount} / {MAX_TEXT} | Images: {imageCount} / {MAX_IMAGE}</div>
      {!isDraft && <div className="mb-6 p-3 bg-emerald-300 text-emerald-700 rounded-lg">{chapter?.is_team_project ? "This chapter is published. Team edits will update the live version for readers." : "This chapter is published. Any changes will update the live version."}</div>}
      {canEdit && (
        <div className="flex gap-4 mb-6">
          <button onClick={addTextSection} disabled={!canAddText} className={`${canAddText ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 rounded-lg" : "bg-gray-400 cursor-not-allowed"}`}>Add Text</button>
          <button onClick={addImageSection} disabled={!canAddImage} className={`${canAddImage ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 rounded-lg" : "bg-gray-400 cursor-not-allowed"}`}>Add Image</button>
        </div>
      )}
      <div className="space-y-8">
        {sections.map((section, index) =>
          section.type === "text" ? (
            <TextEditorSection key={section.id} section={section} canEdit={canEdit} setEditingSectionId={setEditingSectionId} onDelete={deleteSection} onUpdate={updateSection} onSave={saveSectionToAPI} onMoveUp={() => moveSection(index, "up")} onMoveDown={() => moveSection(index, "down")} isFirst={index === 0} isLast={index === sections.length - 1} />
          ) : section.type === "image" ? (
            <ImageSection key={section.id} section={section} canEdit={canEdit} onDelete={deleteSection} onUpdate={updateSection} onSave={saveSectionToAPI} onMoveUp={() => moveSection(index, "up")} onMoveDown={() => moveSection(index, "down")} isFirst={index === 0} isLast={index === sections.length - 1} />
          ) : null
        )}
      </div>
      {chapters?.length > 0 && <EditorNavigation chapters={chapters} currentChapter={chapter} onSelectChapter={onSelectChapter} />}
      <EditorActions onBack={onBack} onSaveDraft={() => { if (isReordering) { alert("Please wait until reorder finishes."); return; } handleSave(false); }} onPublish={() => handleSave(true)} loading={loading} isInitiator={isInitiator} isTeamMember={isTeamMember} chapterStatus={chapter?.status} hasActiveLocks={hasActiveLocks} hasUnsavedWorkspaceChanges={hasUnsavedWorkspaceChanges} />
    </>
  );
};

export default EditorBody;