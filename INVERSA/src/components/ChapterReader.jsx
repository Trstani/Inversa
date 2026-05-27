import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiMessageCircle } from "react-icons/fi";
import ChapterComments from './ChapterComments';
import Button from "./Button";
import ChapterNavigation from "./ChapterNavigation";

const ChapterReader = () => {
  const { projectId, chapterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const loadChapterWithSections = async (chapter) => {
    if (!chapter) return null;
    try {
      const sectionsResponse = await apiClient.sections.getByChapter(chapter.id);
      return { ...chapter, sections: sectionsResponse.data || [] };
    } catch (error) {
      console.error("Error loading sections:", error);
      return { ...chapter, sections: [] };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const projectResponse = await apiClient.projects.getById(projectId);
        const projectData = projectResponse.data;
        setProject(projectData);

        const chaptersResponse = await apiClient.chapters.getByProject(projectId);
        const allChapters = chaptersResponse.data || [];

        let canSeeAllChapters = user?.id === projectData?.initiator_id;
        if (user?.id && !canSeeAllChapters && projectData?.is_team_project && projectData?.team_id) {
          try {
            const { success, data: team } = await apiClient.teams.getById(projectData.team_id);
            if (success && team) canSeeAllChapters = team.members?.some(m => m.user_id === user.id && m.status === "approved") ?? false;
          } catch (e) { console.error("Team check failed:", e); }
        }

        const visibleChapters = canSeeAllChapters
          ? allChapters
          : allChapters.filter((chapter) => chapter.status === "published");
        setChapters(visibleChapters);

        let selectedChapter = chapterId
          ? visibleChapters.find((chapter) => chapter.id === parseInt(chapterId))
          : null;
        if (!selectedChapter && visibleChapters.length > 0) {
          selectedChapter = visibleChapters[0];
        }

        if (selectedChapter) {
          const chapterWithSections = await loadChapterWithSections(selectedChapter);
          setCurrentChapter(chapterWithSections);
          setCurrentIndex(visibleChapters.findIndex((c) => c.id === selectedChapter.id));
        }
      } catch (error) {
        console.error("Error loading reader:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) loadData();
  }, [projectId, chapterId, user?.id]);

  useEffect(() => {

    if (
      !user ||
      !currentChapter ||
      currentChapter.status !== "published"
    ) {
      return;
    }

    const saveReadingHistory =
      async () => {

        try {

          await apiClient
            .readingHistory
            .save({

              project_id:
                parseInt(projectId),

              chapter_id:
                currentChapter.id,

              progress: 0

            });

        } catch (error) {

          console.error(
            "Reading history failed:",
            error
          );

        }

      };

    saveReadingHistory();

    const viewedKey =
      `viewed_project_${projectId}_${user.id}`;

    const alreadyViewed =
      localStorage.getItem(
        viewedKey
      );

    if (
      !alreadyViewed
    ) {

      apiClient
        .projects
        .incrementViews(
          parseInt(projectId)
        );

      localStorage.setItem(
        viewedKey,
        "true"
      );

    }

  }, [
    user?.id,
    projectId,
    currentChapter?.id
  ]);

  const selectChapter = async (chapter, index) => {
    const chapterWithSections = await loadChapterWithSections(chapter);
    setCurrentChapter(chapterWithSections);
    setCurrentIndex(index);
    navigate(`/read/${projectId}/${chapter.id}`);
  };

  const handlePreviousChapter = async () => {
    if (currentIndex <= 0) return;
    const prevChapter = chapters[currentIndex - 1];
    await selectChapter(prevChapter, currentIndex - 1);
  };

  const handleNextChapter = async () => {
    if (currentIndex >= chapters.length - 1) return;
    const nextChapter = chapters[currentIndex + 1];
    await selectChapter(nextChapter, currentIndex + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading chapter...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Project not found</p>
          <Button onClick={() => navigate("/explore")}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  if (!currentChapter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No chapters available</p>
          <Button onClick={() => navigate(`/project/${projectId}`)}>Back to Project</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className="flex items-center gap-2 text-light-accent dark:text-dark-accent hover:opacity-80 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <FiArrowLeft />
            Back to Project
          </button>
          <div className="card p-4 sm:p-6 mb-6">
            <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary mb-2">
              {project.title}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-light-primary dark:text-dark-primary mb-2">
              Chapter {currentChapter.chapter_number} : {currentChapter.title}
            </h1>
            <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary">
              {currentIndex + 1} of {chapters.length}
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 prose dark:prose-invert max-w-none">
          <div className="text-light-primary dark:text-dark-primary leading-relaxed text-sm sm:text-base space-y-8">
            {currentChapter.sections?.map((section) => {
              if (section.type === "text") {
                return (
                  <div
                    key={section.id}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                );
              }
              if (section.type === "image") {
                return (
                  <div key={section.id} className="my-4 sm:my-6">
                    <img
                      src={section.image_url}
                      alt="illustration"
                      className="w-full h-auto rounded-lg sm:rounded-xl"
                    />
                    {section.caption && (
                      <p className="text-xs sm:text-sm text-center text-gray-500 mt-2">
                        {section.caption}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <ChapterNavigation
          currentChapter={currentIndex + 1}
          totalChapters={chapters.length}
          onPrevious={handlePreviousChapter}
          onNext={handleNextChapter}
          className="mb-6 sm:mb-8"
        />

        {/* CHAPTER LIST */}
        <div className="card p-4 sm:p-6 mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Chapters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => selectChapter(chapter, index)}
                className={`p-2 sm:p-3 rounded-lg text-left transition ${
                  currentChapter.id === chapter.id
                    ? "bg-light-accent text-white dark:bg-dark-accent"
                    : "bg-light-surface dark:bg-dark-surface hover:bg-light-accent/10 dark:hover:bg-dark-accent/10"
                }`}
              >
                <p className="font-medium">Chapter {chapter.chapter_number}</p>
                <p className="text-xs opacity-75 truncate">{chapter.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* COMMENT TOGGLE */}
        {currentChapter.status === "published" && (
          <div className="card p-4 sm:p-6">
            <button
              onClick={() => setShowComments(!showComments)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <FiMessageCircle className="w-5 h-5 text-light-accent dark:text-dark-accent" />
                <span className="font-medium">Comments</span>
              </div>
              <span className="text-sm text-light-secondary dark:text-dark-secondary">
                {showComments ? "Hide" : "Show Comments"}
              </span>
            </button>
            {showComments && (
              <div className="mt-6">
                <ChapterComments chapterId={currentChapter.id} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterReader;