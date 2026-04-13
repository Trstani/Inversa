// components/editor/EditorLayout.jsx
import { useState } from "react";
import ChapterSidebar from "./ChapterSidebar";
import EditorHeader from "./EditorHeader";
import EditorBody from "./EditorBody";
import CreateChapterModal from "./CreateChapterModal";
import { useChapterManagement } from "./useChapterManagement";

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
  isTeamMember,
}) => {
  const {
    showCreateModal,
    setShowCreateModal,
    handleCreateChapter,
    handleDeleteChapter,
  } = useChapterManagement(project, chapters, onSelectChapter, onChaptersChange);

  // User can edit if they are initiator OR team member
  const canEdit = isInitiator || isTeamMember;

  return (
    <div className="max-w-6xl mx-auto py-8 grid grid-cols-4 gap-6">
      <ChapterSidebar
        chapters={chapters}
        currentChapter={currentChapter}
        onSelectChapter={onSelectChapter}
        onCreateChapter={() => setShowCreateModal(true)}
        onDeleteChapter={handleDeleteChapter}
        isInitiator={canEdit}
        isTeamMember={false}
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
          isInitiator={canEdit}
        />
      </div>

      {showCreateModal && canEdit && (
        <CreateChapterModal
          onSubmit={handleCreateChapter}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default EditorLayout;
