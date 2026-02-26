// components/editor/EditorLayout.jsx
import { useState } from "react";
import ChapterSidebar from "./ChapterSidebar";
import EditorHeader from "./EditorHeader";
import EditorBody from "./EditorBody";
import CreateChapterModal from "./CreateChapterModal";
import { createNewChapter, deleteChapter } from "../../utils/dataManager";

const EditorLayout = ({
  project,
  chapters,
  currentChapter,
  onSelectChapter,
  onSave,
  loading,
  onBack,
  onChaptersChange,
  isInitiator,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateChapter = async (chapterData) => {
    if (!project) return;
    
    try {
      const newChapter = await createNewChapter(project.id, chapterData);
      setShowCreateModal(false);
      
      // Refresh chapters
      if (onChaptersChange) {
        await onChaptersChange();
      }
      
      // Select the new chapter
      onSelectChapter(newChapter);
    } catch (error) {
      console.error("Error creating chapter:", error);
      alert("Failed to create chapter");
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm("Are you sure you want to delete this chapter?")) {
      try {
        await deleteChapter(chapterId);
        
        // Refresh chapters
        if (onChaptersChange) {
          await onChaptersChange();
        }
        
        // Select first chapter or null
        if (chapters.length > 1) {
          const remaining = chapters.filter(c => c.id !== chapterId);
          onSelectChapter(remaining[0]);
        } else {
          onSelectChapter(null);
        }
      } catch (error) {
        console.error("Error deleting chapter:", error);
        alert("Failed to delete chapter");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 grid grid-cols-4 gap-6">
      <ChapterSidebar
        chapters={chapters}
        currentChapter={currentChapter}
        onSelectChapter={onSelectChapter}
        onCreateChapter={() => setShowCreateModal(true)}
        onDeleteChapter={handleDeleteChapter}
        isInitiator={isInitiator}
      />

      <div className="col-span-3">
        <EditorHeader project={project} chapter={currentChapter} />
        <EditorBody
          chapter={currentChapter}
          chapters={chapters}
          onSelectChapter={onSelectChapter}
          onSave={onSave}
          loading={loading}
          onBack={onBack}
          isInitiator={isInitiator}
        />
      </div>

      {showCreateModal && isInitiator && (
        <CreateChapterModal
          onSubmit={handleCreateChapter}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default EditorLayout;
