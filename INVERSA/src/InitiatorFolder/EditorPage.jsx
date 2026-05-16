import React, {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { apiClient } from "../api/client";

import EditorLayout from "../components/Editor/EditorLayout";

const EditorPage = () => {

  const { user } = useAuth();

  const {
    projectId,
    chapterId,
  } = useParams();

  const navigate = useNavigate();

  const [project, setProject] =
    useState(null);

  const [chapters, setChapters] =
    useState([]);

  const [
    currentChapter,
    setCurrentChapter
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [isInitiator, setIsInitiator] =
    useState(false);

  const [isTeamMember, setIsTeamMember] =
    useState(false);

  /*
  =========================
  LOAD CHAPTERS
  =========================
  */

  const loadChapters = async () => {

    try {

      const response =
        await apiClient.chapters.getByProject(
          projectId
        );

      return response.data || [];

    } catch (error) {

      console.error(
        "Failed loading chapters:",
        error
      );

      return [];
    }
  };

  /*
  =========================
  LOAD SECTIONS
  =========================
  */

  const loadSections =
    async (chapterId) => {

      try {

        const response =
          await apiClient.sections.getByChapter(
            chapterId
          );

        return response.data || [];

      } catch (error) {

        console.error(
          "Failed loading sections:",
          error
        );

        return [];
      }
    };

  /*
  =========================
  LOAD DATA
  =========================
  */

  useEffect(() => {

    const loadData = async () => {

      if (!projectId || !user?.id) {
        return;
      }

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
        ROLE CHECK
        =========================
        */

        setIsInitiator(
          projectData?.initiator_id === user.id
        );

        let userIsTeamMember = false;

        if (
          projectData?.is_team_project &&
          projectData?.team_id
        ) {

          const teamResponse =
            await apiClient.teams.getById(
              projectData.team_id
            );

          const team =
            teamResponse.data;

          userIsTeamMember =
            team?.members?.some(
              (member) =>
                member.user_id === user.id &&
                member.status === "approved"
            );
        }

        setIsTeamMember(
          userIsTeamMember
        );

        /*
        =========================
        CHAPTERS
        =========================
        */

        const allChapters =
          await loadChapters();

        setChapters(allChapters);

        let selectedChapter = null;

        if (chapterId) {

          selectedChapter =
            allChapters.find(
              (chapter) =>
                chapter.id ===
                parseInt(chapterId)
            );
        }

        if (
          !selectedChapter &&
          allChapters.length > 0
        ) {

          selectedChapter =
            allChapters[0];
        }

        /*
        =========================
        LOAD SECTIONS
        =========================
        */

        if (selectedChapter) {

          const sections =
            await loadSections(
              selectedChapter.id
            );

          selectedChapter = {
            ...selectedChapter,
            sections,
          };
        }

        setCurrentChapter(
          selectedChapter || null
        );

      } catch (error) {

        console.error(
          "Error loading editor:",
          error
        );
      }
    };

    loadData();

  }, [
    projectId,
    chapterId,
    user?.id,
  ]);

  /*
  =========================
  SAVE CHAPTER
  =========================
  */

  const handleSave = async (
    chapterData,
    publishNow = false
  ) => {

    setLoading(true);

    try {

      /*
      =========================
      SAVE SECTIONS
      =========================
      */

      for (
        let index = 0;
        index <
        chapterData.sections.length;
        index++
      ) {

        const section =
          chapterData.sections[index];

        // NEW SECTION

        if (
          typeof section.id === "number" &&
          section.id > 1000000000
        ) {

          await apiClient.sections.create({

            chapter_id:
              chapterData.id,

            type:
              section.type,

            content:
              section.content || null,

            image_url:
              section.imageUrl || null,

            caption:
              section.caption || null,

            section_order:
              index + 1,
          });

        }

        // UPDATE SECTION

        else {

          await apiClient.sections.update(
            section.id,
            {

              content:
                section.content || null,

              image_url:
                section.image_url || null,

              caption:
                section.caption || null,

              section_order:
                index + 1,
            }
          );
        }
      }

      /*
      =========================
      RELOAD CHAPTERS
      =========================
      */

      const updatedChapters =
        await loadChapters();

      setChapters(updatedChapters);

      /*
      =========================
      RELOAD CURRENT CHAPTER
      =========================
      */

      const updatedSections =
        await loadSections(
          chapterData.id
        );

      const updatedCurrent =
        {
          ...chapterData,
          sections:
            updatedSections,
        };

      setCurrentChapter(
        updatedCurrent
      );

      alert(
        publishNow
          ? "Chapter published!"
          : "Draft saved!"
      );

    } catch (error) {

      console.error(
        "Failed saving chapter:",
        error
      );

      alert(
        "Failed to save chapter"
      );

    } finally {

      setLoading(false);
    }
  };

  /*
  =========================
  REFRESH CHAPTERS
  =========================
  */

  const handleChaptersChange =
    async () => {

      const updated =
        await loadChapters();

      setChapters(updated);
    };

  /*
  =========================
  LOADING
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
      onBack={() =>
        navigate(`/project/${projectId}`)
      }
      onChaptersChange={
        handleChaptersChange
      }
      isInitiator={isInitiator}
      isTeamMember={isTeamMember}
    />

  );
};

export default EditorPage;