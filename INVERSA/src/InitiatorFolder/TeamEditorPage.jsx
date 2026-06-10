// pages/TeamEditorPage.jsx

import React, {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  apiClient,
} from "../api/client";

import TeamEditorLayout
  from "../components/Editor/TeamEditorLayout";
import { showError, showLoading, showSuccess } from "../utils/toast";

const TeamEditorPage = () => {

  /*
  =========================
  HOOKS
  =========================
  */

  const { user } =
    useAuth();

  const {
    projectId,
    chapterId,
  } = useParams();

  const navigate =
    useNavigate();
  
    const location = useLocation();

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
    useState(false);

  const [
    isInitiator,
    setIsInitiator,
  ] = useState(false);

  const [
    isTeamMember,
    setIsTeamMember,
  ] = useState(false);

  /*
  =========================
  LOAD DATA
  =========================
  */

  useEffect(() => {

    const loadData =
      async () => {

        if (
          !projectId ||
          !user?.id
        ) {
          return;
        }

        try {

          /*
          =========================
          PROJECT
          =========================
          */

          const projectResponse =
            await apiClient.projects
              .getById(projectId);

          const projectData =
            projectResponse.data;

          setProject(projectData);

          /*
          =========================
          INITIATOR
          =========================
          */

          const userIsInitiator =
            projectData?.initiator_id ===
            user.id;

          setIsInitiator(
            userIsInitiator
          );

          /*
          =========================
          TEAM MEMBER
          =========================
          */

          let userIsTeamMember =
            false;

          if (
            projectData?.is_team_project &&
            projectData?.team_id
          ) {

            const teamResponse =
              await apiClient.teams
                .getById(
                  projectData.team_id
                );

            const team =
              teamResponse.data;

            userIsTeamMember =
              team?.members?.some(
                (member) =>
                  member.user_id ===
                  user.id &&
                  member.status ===
                  'approved'
              );

            /*
            =========================
            ACCESS DENIED
            =========================
            */

            if (
              !userIsInitiator &&
              !userIsTeamMember
            ) {

              showError(
                "You don't have access to this project"
              );

              navigate('/dashboard');

              return;
            }

          } else if (
            !userIsInitiator
          ) {

            showError(
              "You don't have access to this project"
            );

            navigate('/dashboard');

            return;
          }

          setIsTeamMember(
            userIsTeamMember
          );

          /*
          =========================
          CHAPTERS
          =========================
          */

          const chaptersResponse =
            await apiClient.chapters
              .getByProject(
                projectId
              );

          const allChapters =
            chaptersResponse.data || [];

          /*
          =========================
          LOAD SECTIONS
          =========================
          */

          for (
            const chapter of allChapters
          ) {

            const sectionsResponse =
              await apiClient.sections
                .getByChapter(
                  chapter.id
                );

            chapter.sections =
              sectionsResponse.data || [];
          }

          setChapters(
            allChapters
          );

          /*
          =========================
          CURRENT CHAPTER
          =========================
          */

          let chapter = null;

          if (chapterId) {

            chapter =
              allChapters.find(
                (c) =>
                  c.id ===
                  parseInt(chapterId)
              );

          } else if (
            allChapters.length > 0
          ) {

            chapter =
              allChapters[0];
          }

          /*
          =========================
          LOCK CHECK
          =========================
          */
         
          if (
            chapter?.locked_by &&
            chapter.locked_by !==
            user.id
          ) {

            showError(
              "Chapter is edited by another user"
            );

            navigate(
              `/project/${projectId}`
            );

            return;
          }

          setCurrentChapter(
            chapter || null
          );

        } catch (error) {

          console.error(
            'Error loading editor:',
            error
          );
        }
      };

    loadData();

  }, [
    projectId,
    chapterId,
    user?.id,
    navigate,
  ]);

  /*
  =========================
  SAVE CHAPTER
  =========================
  */

  const handleSave =
    async (
      chapterData,
      publishNow = false
    ) => {

      setLoading(true);

      try {

        /*
        =========================
        UPDATE CHAPTER
        =========================
        */

        await apiClient.chapters
          .update(
            chapterData.id,
            {
              title:
                chapterData.title,
            }
          );


        /*
        =========================
        PUBLISH
        =========================
        */

        if (publishNow) {

          await apiClient.chapters
            .publish(
              chapterData.id
            );
        }

        /*
        =========================
        RELOAD CHAPTERS
        =========================
        */

        const chaptersResponse =
          await apiClient.chapters
            .getByProject(
              projectId
            );

        const updatedChapters =
          chaptersResponse.data || [];

        /*
        =========================
        LOAD SECTIONS
        =========================
        */

        for (
          const chapter of updatedChapters
        ) {

          const sectionsResponse =
            await apiClient.sections
              .getByChapter(
                chapter.id
              );

          chapter.sections =
            sectionsResponse.data || [];
        }

        setChapters(
          updatedChapters
        );

        /*
        =========================
        REFRESH PROJECT DATA IF PUBLISHED
        =========================
        */

        if (publishNow) {
          try {
            const projectResponse =
              await apiClient.projects.getById(
                projectId
              );
            setProject(projectResponse.data);
          } catch (error) {
            console.error(
              "Failed to refresh project data:",
              error
            );
          }
        }

        /*
        =========================
        UPDATE CURRENT
        =========================
        */

        const updatedCurrent =
          updatedChapters.find(
            (c) =>
              c.id ===
              chapterData.id
          );

        setCurrentChapter(
          updatedCurrent || null
        );

        showSuccess(
          publishNow
            ? 'Chapter published!'
            : 'Draft saved!'
        );

      } catch (error) {

        console.error(error);

        showError(
          'Failed to save chapter'
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  =========================
  CHAPTERS CHANGE
  =========================
  */

  const handleChaptersChange =
    async () => {

      try {

        const response =
          await apiClient.chapters
            .getByProject(
              projectId
            );

        const updatedChapters =
          response.data || [];

        for (
          const chapter of updatedChapters
        ) {

          const sectionsResponse =
            await apiClient.sections
              .getByChapter(
                chapter.id
              );

          chapter.sections =
            sectionsResponse.data || [];
        }

        setChapters(
          updatedChapters
        );

      } catch (error) {

        console.error(error);
      }
    };

  /*
  =========================
  LOADING
  =========================
  */

  if (!project) {

    return (

      <div
        className="
          flex items-center
          justify-center

          h-screen
        "
      >
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
      onBack={() =>
        navigate(-1)
      }
      onChaptersChange={
        handleChaptersChange
      }
      isInitiator={isInitiator}
      isTeamMember={isTeamMember}
      user={user}
    />

  );
};

export default TeamEditorPage;