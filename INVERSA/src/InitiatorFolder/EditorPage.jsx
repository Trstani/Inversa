// pages/EditorPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  saveChapter,
  loadChapters,
  getProjectById,
  lockChapter,
  unlockChapter
} from "../utils/dataManager/index";

import EditorLayout from "../components/Editor/EditorLayout";

const EditorPage = () => {

  const { user } = useAuth();
  const { projectId, chapterId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitiator, setIsInitiator] = useState(false);

  /*
  =========================
  LOAD PROJECT + CHAPTER
  =========================
  */

  useEffect(() => {

    const loadData = async () => {

      if (!projectId || !user?.id) return;

      try {

        const projectData = await getProjectById(projectId);
        setProject(projectData);

        // cek apakah user initiator
        setIsInitiator(projectData?.initiatorId === user.id);

        const allChapters = await loadChapters(projectId);
        setChapters(allChapters);

        let chapter = null;

        if (chapterId) {
          chapter = allChapters.find(c => c.id === parseInt(chapterId));
        } else if (allChapters.length > 0) {
          chapter = allChapters[0];
        }

        // cek apakah chapter sedang di lock
        if (chapter?.lockedBy && chapter.lockedBy !== user.id) {
          alert("Chapter is edited by another user");
          navigate(`/project/${projectId}`);
          return;
        }

        setCurrentChapter(chapter || null);

      } catch (err) {

        console.error(err);

      }

    };

    loadData();

  }, [projectId, chapterId, user?.id, navigate]);


  /*
  =========================
  LOCK CHAPTER
  =========================
  */

  useEffect(() => {

    if (!currentChapter || !user) return;

    try {

      lockChapter(currentChapter.id, user.id);

    } catch (err) {

      alert(err.message);
      navigate(`/project/${projectId}`);

    }

    return () => {

      unlockChapter(currentChapter.id, user.id);

    };

  }, [currentChapter?.id, user?.id, projectId, navigate]);


  /*
  =========================
  SAVE CHAPTER
  =========================
  */

  const handleSave = async (chapterData, publishNow = false) => {

    setLoading(true);

    try {

      await saveChapter({
        ...chapterData,
        projectId: parseInt(projectId),
        authorId: user.id,
        status: publishNow ? "published" : "draft"
      });

      // reload chapters
      const updated = await loadChapters(projectId);
      setChapters(updated);

      // update current chapter
      if (chapterData.id === currentChapter?.id) {

        const updatedCurrent = updated.find(c => c.id === chapterData.id);
        setCurrentChapter(updatedCurrent || null);

      }

      // unlock setelah save
      unlockChapter(chapterData.id, user.id);

      alert(publishNow ? "Chapter published!" : "Draft saved!");

    } catch (err) {

      console.error(err);
      alert("Failed to save chapter");

    } finally {

      setLoading(false);

    }

  };


  /*
  =========================
  UPDATE CHAPTER LIST
  =========================
  */

  const handleChaptersChange = async () => {

    const updated = await loadChapters(projectId);
    setChapters(updated);

  };


  /*
  =========================
  GUARD
  =========================
  */

  if (!project) {
  return (
    <div className="flex items-center justify-center h-screen">
      Loading editor...
    </div>
  );
}


  /*
  =========================
  RENDER
  =========================
  */

  return (

    <EditorLayout
      project={project}
      chapters={chapters}
      currentChapter={currentChapter}
      onSelectChapter={setCurrentChapter}
      onSave={handleSave}
      loading={loading}
      onBack={() => navigate(`/project/${projectId}`)}
      onChaptersChange={handleChaptersChange}
      isInitiator={isInitiator}
    />

  );

};

export default EditorPage;