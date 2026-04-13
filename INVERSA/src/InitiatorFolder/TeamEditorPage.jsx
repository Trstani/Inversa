// pages/TeamEditorPage.jsx

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

import TeamEditorLayout from "../components/Editor/TeamEditorLayout";

const TeamEditorPage = () => {

  const { user } = useAuth();
  const { projectId, chapterId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitiator, setIsInitiator] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);

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

        // Check if user is initiator
        const userIsInitiator = projectData?.initiatorId === user.id;
        setIsInitiator(userIsInitiator);

        // For team projects, check if user is a member of the team
        let userIsTeamMember = false;
        if (projectData?.isTeamProject && projectData?.teamId) {
          const { getTeamById } = await import("../utils/dataManager/teamManager");
          const team = await getTeamById(projectData.teamId);
          
          userIsTeamMember = team?.collaborators?.some(
            c => c.userId === user.id && c.status === 'approved'
          );

          // If user is neither initiator nor team member, deny access
          if (!userIsInitiator && !userIsTeamMember) {
            alert("You don't have access to this project");
            navigate('/dashboard');
            return;
          }
        } else if (!userIsInitiator) {
          // For solo projects, only initiator can access
          alert("You don't have access to this project");
          navigate('/dashboard');
          return;
        }

        setIsTeamMember(userIsTeamMember);

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

    <TeamEditorLayout
      project={project}
      chapters={chapters}
      currentChapter={currentChapter}
      onSelectChapter={setCurrentChapter}
      onSave={handleSave}
      loading={loading}
      onBack={() => navigate(`/project/${projectId}`)}
      onChaptersChange={handleChaptersChange}
      isInitiator={isInitiator}
      isTeamMember={isTeamMember}
      user={user}
    />

  );

};

export default TeamEditorPage;
