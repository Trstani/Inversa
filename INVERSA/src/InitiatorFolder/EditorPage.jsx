// pages/EditorPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveChapter, loadChapters, getProjectById } from "../utils/dataManager";
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

  useEffect(() => {
    const loadData = async () => {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      
      // Check if user is initiator
      setIsInitiator(projectData?.initiatorId === user?.id);

      const allChapters = await loadChapters(projectId);
      setChapters(allChapters);

      if (chapterId) {
        const chapter = allChapters.find(c => c.id === parseInt(chapterId));
        setCurrentChapter(chapter || null);
      } else if (allChapters.length > 0) {
        setCurrentChapter(allChapters[0]);
      }
    };

    if (projectId && user?.id) {
      loadData();
    }
  }, [projectId, chapterId, user?.id]);

  const handleSave = async (chapterData, publishNow = false) => {
    setLoading(true);
    try {
      const savedChapter = await saveChapter({
        ...chapterData,
        projectId: parseInt(projectId),
        authorId: user.id,
        status: publishNow ? "published" : "draft",
      });

      // Reload chapters
      const updated = await loadChapters(projectId);
      setChapters(updated);
      
      // Update current chapter if it's the one being saved
      if (chapterData.id === currentChapter?.id) {
        const updatedCurrent = updated.find(c => c.id === chapterData.id);
        setCurrentChapter(updatedCurrent || null);
      }

      alert(publishNow ? "Published!" : "Draft saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleChaptersChange = async () => {
    const updated = await loadChapters(projectId);
    setChapters(updated);
  };

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
