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
  async(chapterId)=>{

    if(
      !window.confirm(
      "Are you sure you want to delete this chapter?"
      )
    ){
      return;
    }

    try{

      console.log(
        "START CLEANUP:",
        chapterId
      );

      await cleanupChapterImages(
        chapterId
      );

      console.log(
        "DELETE CHAPTER:",
        chapterId
      );

      await apiClient
      .chapters
      .delete(
        chapterId
      );

      if(
        onChaptersChange
      ){

        await onChaptersChange();

      }

      if(
        chapters.length > 1
      ){

        const remaining=
        chapters.filter(
          c=>
          c.id!==chapterId
        );

        onSelectChapter(
          remaining[0]
        );

      }else{

        onSelectChapter(
          null
        );

      }

    }catch(error){

      console.error(
        "Error deleting chapter:",
        error
      );

      showError(
        "Failed to delete chapter"
      );

    }

  };


  return {

    showCreateModal,

    setShowCreateModal,

    handleCreateChapter,

    handleDeleteChapter,

  };

};