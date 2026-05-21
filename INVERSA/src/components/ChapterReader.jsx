import React, {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth }
  from "../context/AuthContext";

import { apiClient }
  from "../api/client";

import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import ChapterComments
  from './ChapterComments';

import Button from "./Button";

const ChapterReader = () => {

  /*
  =========================
  PARAMS & HOOKS
  =========================
  */

  const {
    projectId,
    chapterId,
  } = useParams();

  const { user } =
    useAuth();

  const navigate =
    useNavigate();

  /*
  =========================
  STATES
  =========================
  */

  const [project, setProject] =
    useState(null);

  const [chapters, setChapters] =
    useState([]);

  const [
    currentChapter,
    setCurrentChapter,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  /*
  =========================
  LOAD CHAPTER SECTIONS
  =========================
  */

  const loadChapterWithSections =
    async (chapter) => {

      if (!chapter) {
        return null;
      }

      try {

        const sectionsResponse =
          await apiClient.sections.getByChapter(
            chapter.id
          );

        return {
          ...chapter,
          sections:
            sectionsResponse.data || [],
        };

      } catch (error) {

        console.error(
          "Error loading sections:",
          error
        );

        return {
          ...chapter,
          sections: [],
        };
      }
    };

  /*
  =========================
  LOAD DATA
  =========================
  */

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      try {

        /*
        =========================
        PROJECT
        =========================
        */

        const projectResponse =
          await apiClient.projects.getById(
            projectId
          );

        const projectData =
          projectResponse.data;

        setProject(projectData);

        /*
        =========================
        CHAPTERS
        =========================
        */

        const chaptersResponse =
          await apiClient.chapters.getByProject(
            projectId
          );

        const allChapters =
          chaptersResponse.data || [];

        /*
        =========================
        ACCESS CHECK
        =========================
        */

        let canSeeAllChapters =
          user?.id ===
          projectData?.initiator_id;

        /*
        =========================
        TEAM MEMBER CHECK
        =========================
        */

        if (
          !canSeeAllChapters &&
          projectData?.is_team_project &&
          projectData?.team_id
        ) {

          const teamResponse =
            await apiClient.teams.getById(
              projectData.team_id
            );

          if (
            teamResponse.success &&
            teamResponse.data
          ) {

            const team =
              teamResponse.data;

            canSeeAllChapters =
              team?.members?.some(
                (member) =>
                  member.user_id === user?.id &&
                  member.status === "approved"
              );
          }
        }

        /*
        =========================
        FILTER CHAPTERS
        =========================
        */

        const visibleChapters =
          canSeeAllChapters
            ? allChapters
            : allChapters.filter(
              (chapter) =>
                chapter.status === "published"
            );

        setChapters(
          visibleChapters
        );

        /*
        =========================
        SELECT CHAPTER
        =========================
        */

        let selectedChapter =
          null;

        if (chapterId) {

          selectedChapter =
            visibleChapters.find(
              (chapter) =>
                chapter.id ===
                parseInt(chapterId)
            );
        }

        /*
        =========================
        FALLBACK FIRST CHAPTER
        =========================
        */

        if (
          !selectedChapter &&
          visibleChapters.length > 0
        ) {

          selectedChapter =
            visibleChapters[0];
        }

        /*
        =========================
        LOAD CHAPTER SECTIONS
        =========================
        */

        if (selectedChapter) {

          const chapterWithSections =
            await loadChapterWithSections(
              selectedChapter
            );

          setCurrentChapter(
            chapterWithSections
          );

          setCurrentIndex(
            visibleChapters.findIndex(
              (chapter) =>
                chapter.id ===
                selectedChapter.id
            )
          );
        }

      } catch (error) {

        console.error(
          "Error loading reader:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

    if (projectId) {
      loadData();
    }

  }, [
    projectId,
    chapterId,
    user?.id,
  ]);

  /*
  =========================
  SAVE HISTORY + VIEWS
  =========================
  */

  useEffect(() => {

    if (
      !user ||
      !currentChapter
    ) {
      return;
    }

    /*
    =========================
    SAVE READING HISTORY
    =========================
    */

    apiClient.readingHistory.save({
      project_id:
        parseInt(projectId),

      chapter_id:
        currentChapter.id,

      progress: 0,
    });

 /*
=========================
INCREMENT VIEWS
=========================
*/

const viewedKey =
  `viewed_project_${projectId}_${user?.id || "guest"}`;

const alreadyViewed =
  localStorage.getItem(
    viewedKey
  );

if (
  !alreadyViewed &&
  currentChapter.status ===
    "published"
) {

  apiClient.projects.incrementViews(
    parseInt(projectId)
  );

  localStorage.setItem(
    viewedKey,
    "true"
  );
}

}, [
  user,
  projectId,
  currentChapter,
]);
  /*
  =========================
  SELECT CHAPTER
  =========================
  */

  const selectChapter =
    async (
      chapter,
      index
    ) => {

      const chapterWithSections =
        await loadChapterWithSections(
          chapter
        );

      setCurrentChapter(
        chapterWithSections
      );

      setCurrentIndex(index);

      navigate(
        `/read/${projectId}/${chapter.id}`
      );
    };

  /*
  =========================
  PREVIOUS CHAPTER
  =========================
  */

  const handlePreviousChapter =
    async () => {

      if (currentIndex <= 0) {
        return;
      }

      const prevChapter =
        chapters[currentIndex - 1];

      await selectChapter(
        prevChapter,
        currentIndex - 1
      );
    };

  /*
  =========================
  NEXT CHAPTER
  =========================
  */

  const handleNextChapter =
    async () => {

      if (
        currentIndex >=
        chapters.length - 1
      ) {
        return;
      }

      const nextChapter =
        chapters[currentIndex + 1];

      await selectChapter(
        nextChapter,
        currentIndex + 1
      );
    };

  /*
  =========================
  LOADING
  =========================
  */

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">
          Loading chapter...
        </p>
      </div>
    );
  }

  /*
  =========================
  PROJECT NOT FOUND
  =========================
  */

  if (!project) {

    return (
      <div className="flex items-center justify-center min-h-screen">

        <div className="text-center">

          <p className="text-gray-500 mb-4">
            Project not found
          </p>

          <Button
            onClick={() =>
              navigate("/explore")
            }
          >
            Back to Explore
          </Button>

        </div>

      </div>
    );
  }

  /*
  =========================
  NO CHAPTERS
  =========================
  */

  if (!currentChapter) {

    return (
      <div className="flex items-center justify-center min-h-screen">

        <div className="text-center">

          <p className="text-gray-500 mb-4">
            No chapters available
          </p>

          <Button
            onClick={() =>
              navigate(
                `/project/${projectId}`
              )
            }
          >
            Back to Project
          </Button>

        </div>

      </div>
    );
  }

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="min-h-screen bg-light-background dark:bg-dark-background py-6 sm:py-8">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-6 sm:mb-8">

          <button
            onClick={() =>
              navigate(
                `/project/${projectId}`
              )
            }
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

              Chapter {
                currentChapter.chapter_number
              }

              : {
                currentChapter.title
              }

            </h1>

            <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary">

              {currentIndex + 1} of {
                chapters.length
              }

            </p>

          </div>

        </div>

        {/* CONTENT */}

        <div className="card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 prose dark:prose-invert max-w-none">

          <div className="text-light-primary dark:text-dark-primary leading-relaxed text-sm sm:text-base space-y-8">

            {currentChapter.sections?.map(
              (section) => {

                /*
                =========================
                TEXT SECTION
                =========================
                */

                if (
                  section.type === "text"
                ) {

                  return (
                    <div
                      key={section.id}
                      dangerouslySetInnerHTML={{
                        __html:
                          section.content,
                      }}
                    />
                  );
                }

                /*
                =========================
                IMAGE SECTION
                =========================
                */

                if (
                  section.type === "image"
                ) {

                  return (

                    <div
                      key={section.id}
                      className="my-4 sm:my-6"
                    >

                      <img
                        src={
                          section.image_url
                        }
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
              }
            )}

          </div>

        </div>

        {/* NAVIGATION */}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">

          <button
            onClick={
              handlePreviousChapter
            }
            disabled={
              currentIndex === 0
            }
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-light-surface dark:bg-dark-surface rounded-lg hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
          >
            <FiChevronLeft />
            Previous
          </button>

          <div className="text-center">

            <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary">

              Chapter {
                currentIndex + 1
              } of {
                chapters.length
              }

            </p>

          </div>

          <button
            onClick={
              handleNextChapter
            }
            disabled={
              currentIndex ===
              chapters.length - 1
            }
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-light-surface dark:bg-dark-surface rounded-lg hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
          >
            Next
            <FiChevronRight />
          </button>

        </div>
        {/* COMMENTS */}

        {currentChapter.status ===
          "published" && (

          <ChapterComments
            chapterId={
              currentChapter.id
            }
          />

        )}

        {/* CHAPTER LIST */}

        <div className="card p-4 sm:p-6">

          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Chapters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">

            {chapters.map(
              (
                chapter,
                index
              ) => (

                <button
                  key={chapter.id}
                  onClick={() =>
                    selectChapter(
                      chapter,
                      index
                    )
                  }
                  className={`p-2 sm:p-3 rounded-lg text-left transition text-sm sm:text-base ${
                    currentChapter.id ===
                    chapter.id

                      ? "bg-light-accent text-white dark:bg-dark-accent"

                      : "bg-light-surface dark:bg-dark-surface hover:bg-light-accent/10 dark:hover:bg-dark-accent/10"
                  }`}
                >

                  <p className="font-medium">

                    Chapter {
                      chapter.chapter_number
                    }

                  </p>

                  <p className="text-xs sm:text-sm opacity-75 truncate">

                    {chapter.title}

                  </p>

                </button>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ChapterReader;