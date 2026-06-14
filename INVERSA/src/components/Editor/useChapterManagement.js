import { useState } from 'react';
import { apiClient } from '../../api/client';
import { cleanupChapterImages } from '../../utils/chapterCleanup';
import { showError } from '../../utils/toast';

export const useChapterManagement = (
  project,
  chapters,
  onSelectChapter,
  onChaptersChange
) => {

  const [
    showCreateModal,
    setShowCreateModal
  ] = useState(false);

  const [
    chapterToDelete,
    setChapterToDelete
  ] = useState(null);

  const handleCreateChapter =
  async(chapterData)=>{

    if(!project)
    return;

    try{

      const response=
      await apiClient
      .chapters
      .create({

        project_id:
        project.id,

        ...chapterData

      });

      const newChapter=
      response.data;

      setShowCreateModal(
        false
      );

      if(
        onChaptersChange
      ){

        await onChaptersChange();

      }

      onSelectChapter(
        newChapter
      );

    }catch(error){

      console.error(
        "Error creating chapter:",
        error
      );

      showError(
        "Failed to create chapter"
      );

    }

  };

  const handleDeleteChapter =
    (chapterId) => {

      setChapterToDelete(
        chapterId
      );

    };


  const confirmDeleteChapter =
    async () => {

      if (!chapterToDelete)
        return;

      try {

        await cleanupChapterImages(
          chapterToDelete
        );

        await apiClient
          .chapters
          .delete(
            chapterToDelete
          );

        if (onChaptersChange) {

          await onChaptersChange();

        }

        if (chapters.length > 1) {

          const remaining =
            chapters.filter(
              c =>
                c.id !== chapterToDelete
            );

          onSelectChapter(
            remaining[0]
          );

        } else {

          onSelectChapter(
            null
          );

        }

        setChapterToDelete(
          null
        );

      } catch (error) {

        console.error(error);

        showError(
          "Failed to delete chapter"
        );

      }

    };


  return {

    showCreateModal,
    setShowCreateModal,

    chapterToDelete,
    setChapterToDelete,

    handleCreateChapter,
    handleDeleteChapter,
    confirmDeleteChapter,

  };

};