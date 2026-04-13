// hooks/useChapterManagement.js
// Shared logic for chapter management between EditorLayout and TeamEditorLayout

import { useState } from 'react';
import { createNewChapter, deleteChapter } from '../../utils/dataManager/index';

export const useChapterManagement = (project, chapters, onSelectChapter, onChaptersChange) => {
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

  return {
    showCreateModal,
    setShowCreateModal,
    handleCreateChapter,
    handleDeleteChapter,
  };
};
