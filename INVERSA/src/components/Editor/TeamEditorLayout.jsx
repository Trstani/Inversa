// components/editor/TeamEditorLayout.jsx

import {
  useState,
  useEffect,
} from "react";

import {
  FiEdit2,
  FiZap,
} from "react-icons/fi";

import ChapterSidebar
  from "./ChapterSidebar";

import EditorHeader
  from "./EditorHeader";

import EditorBody
  from "./EditorBody";

import CreateChapterModal
  from "./CreateChapterModal";

import BrainstormGridLayout
  from "../Brainstorm/BrainstormGridLayout";

import {
  apiClient,
} from '../../api/client';

import {
  useChapterManagement,
} from "./useChapterManagement";

const TeamEditorLayout = ({

  project,

  chapters,

  currentChapter,

  onSelectChapter,

  onSave,

  loading,

  onBack,

  onChaptersChange,

  isInitiator,

  isTeamMember,

  user,

}) => {

  /*
  =========================
  STATES
  =========================
  */

  const [
    activeSection,
    setActiveSection,
  ] = useState(() => {

    if (!project?.id) {
      return 'editor';
    }

    return (
      localStorage.getItem(
        `project_section_${project.id}`
      ) || 'editor'
    );

  });

  const [
    brainstorm,
    setBrainstorm,
  ] = useState(null);

  const [
    brainstormLoading,
    setBrainstormLoading,
  ] = useState(false);

  /*
  =========================
  CHAPTER MANAGEMENT
  =========================
  */

  const {

    showCreateModal,

    setShowCreateModal,

    handleCreateChapter,

    handleDeleteChapter,

  } = useChapterManagement(

    project,

    chapters,

    onSelectChapter,

    onChaptersChange
  );

  /*
  =========================
  LOAD BRAINSTORM
  =========================
  */

  useEffect(() => {

    if (project?.id) {

      loadBrainstormSession();
    }

  }, [project?.id]);

  const loadBrainstormSession =
    async () => {

      setBrainstormLoading(
        true
      );

      try {

        /*
        =========================
        SESSION
        =========================
        */

        const sessionResponse =
          await apiClient
            .brainstorm
            .getSession(
              project.id
            );

        const session =
          sessionResponse.data;

        /*
        =========================
        IDEAS
        =========================
        */

        const ideasResponse =
          await apiClient
            .brainstorm
            .getIdeas(
              project.id
            );

        /*
        =========================
        TASKS
        =========================
        */

        const tasksResponse =
          await apiClient
            .brainstorm
            .getTasks(
              project.id
            );

        /*
        =========================
        DISCUSSIONS
        =========================
        */

        const discussionsResponse =
          await apiClient
            .brainstorm
            .getDiscussions(
              project.id
            );

        /*
        =========================
        NOTES
        =========================
        */

        const notesResponse =
          await apiClient
            .brainstorm
            .getNotes(
              project.id
            );

        /*
        =========================
        MERGE
        =========================
        */

        setBrainstorm({

          ...session,

          ideas:
            ideasResponse.data || [],

          tasks:
            tasksResponse.data || [],

          discussions:
            discussionsResponse.data || [],

          notes:
            notesResponse.data || [],
        });

      } catch (error) {

        console.error(
          'Error loading brainstorm session:',
          error
        );

      } finally {

        setBrainstormLoading(
          false
        );
      }
    };

  /*
=========================
SAVE ACTIVE SECTION
=========================
*/

  useEffect(() => {

    if (project?.id) {

      localStorage.setItem(
        `project_section_${project.id}`,
        activeSection
      );

    }

  }, [
    activeSection,
    project?.id
  ]);

  /*
  =========================
  UPDATE BRAINSTORM
  =========================
  */

  const handleBrainstormUpdate =
    async () => {

      await loadBrainstormSession();
    };

  /*
  =========================
  SECTIONS
  =========================
  */

  const sections = [

    {
      id: 'editor',
      label: 'Editor',
      icon: FiEdit2,
    },

    {
      id: 'brainstorm',
      label: 'Brainstorm',
      icon: FiZap,
    },
  ];

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div
      className="
        min-h-screen

        bg-light-background
        dark:bg-dark-background
      "
    >

      {/* TOP NAV */}

      <div
        className="
          sticky top-0 z-20

          bg-light-surface
          dark:bg-dark-surface
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto

            px-4 py-2
          "
        >

          <div
            className="
              flex gap-3

              p-1

              rounded-2xl

              bg-light-secondary/5
              dark:bg-dark-secondary/5

              shadow-inner
            "
          >

            {sections.map(
              (section) => {

                const Icon =
                  section.icon;

                const isActive =
                  activeSection ===
                  section.id;

                return (

                  <button
                    key={section.id}
                    onClick={() => {

                      setActiveSection(
                        section.id
                      );

                      localStorage.setItem(
                        `project_section_${project.id}`,
                        section.id
                      );

                    }}
                    className={`
    flex items-center gap-2

    px-5 py-2

    rounded-xl

    text-sm font-medium

    transition-all duration-200

    whitespace-nowrap

    ${isActive
                        ? `
        bg-light-surface
        dark:bg-dark-surface

        shadow-md

        text-light-accent
        dark:text-dark-accent
      `
                        : `
        text-light-secondary
        dark:text-dark-secondary

        hover:text-light-primary
        dark:hover:text-dark-primary
      `
                      }
  `}
                  >
                    <Icon className="w-4 h-4" />

                    {section.label}

                  </button>

                );
              }
            )}

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="py-6">

        {/* EDITOR */}

        {activeSection ===
          'editor' && (

            <div
              className="
              max-w-6xl
              mx-auto

              grid
              grid-cols-1
              md:grid-cols-4

              gap-4 sm:gap-6

              px-4
            "
            >

              {/* SIDEBAR */}

              <ChapterSidebar
                chapters={chapters}
                currentChapter={currentChapter}
                onSelectChapter={onSelectChapter}
                onCreateChapter={() =>
                  setShowCreateModal(
                    true
                  )
                }
                onDeleteChapter={handleDeleteChapter}
                isInitiator={isInitiator}
                isTeamMember={isTeamMember}
              />

              {/* MAIN */}

              <div className="col-span-1 md:col-span-3">

                <EditorHeader
                  project={project}
                  chapter={currentChapter}
                />

                <EditorBody
                  chapter={currentChapter}
                  chapters={chapters}
                  onSelectChapter={onSelectChapter}
                  onSave={onSave}
                  loading={loading}
                  onBack={onBack}
                  isInitiator={isInitiator}
                  isTeamMember={isTeamMember}
                />

              </div>

              {/* CREATE MODAL */}

              {showCreateModal && 

                (isInitiator ||
                isTeamMember

              ) && (

                  <CreateChapterModal
                    onSubmit={handleCreateChapter}
                    onClose={() =>
                      setShowCreateModal(
                        false
                      )
                    }
                  />

                )}

            </div>

          )}

        {/* BRAINSTORM */}

        {activeSection ===
          'brainstorm' && (

            <div
              className="
              max-w-7xl
              mx-auto

              px-4
            "
            >

              {brainstormLoading ? (

                <div
                  className="
                  flex items-center
                  justify-center

                  py-12
                "
                >

                  <p
                    className="
                    text-light-secondary
                    dark:text-dark-secondary
                  "
                  >
                    Loading brainstorm...
                  </p>

                </div>

              ) : (

                <BrainstormGridLayout
                  projectId={project?.id}

                  brainstorm={
                    brainstorm || {

                      ideas: [],
                      tasks: [],
                      discussions: [],
                      notes: [],
                    }
                  }

                  onUpdate={
                    handleBrainstormUpdate
                  }

                  user={user}
                />

              )}

            </div>

          )}

      </div>

    </div>
  );
};

export default TeamEditorLayout;