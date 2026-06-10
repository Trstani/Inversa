import ChapterSidebar from "./ChapterSidebar";
import EditorHeader from "./EditorHeader";
import EditorBody from "./EditorBody";
import CreateChapterModal from "./CreateChapterModal";
import { useChapterManagement } from "./useChapterManagement";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const EditorLayout = ({
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
}) => {

  const { user } = useAuth();

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

  const [showSidebar, setShowSidebar] = useState(false);

  const canEdit =
    isInitiator ||
    isTeamMember;

  const isOwner =
    Number(project?.initiator_id) ===
    Number(user?.id);

  return (

    <div className="max-w-6xl mx-auto py-8 px-4">

      <div className="md:hidden mb-4">

        <button
          onClick={() =>
            setShowSidebar(
              prev => !prev
            )
          }
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-light-surface dark:bg-dark-surface"
        >

          <span>
            Chapters
          </span>

          {
            showSidebar
              ?
              <FiX />
              :
              <FiMenu />
          }

        </button>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className={`${showSidebar ? "block" : "hidden"} md:block self-start h-fit md:sticky md:top-6`}>

          <ChapterSidebar
            chapters={chapters}
            currentChapter={currentChapter}
            onSelectChapter={(chapter) => {

              onSelectChapter(
                chapter
              );

              setShowSidebar(
                false
              );

            }}
            onCreateChapter={() =>
              setShowCreateModal(
                true
              )
            }
            onDeleteChapter={handleDeleteChapter}
            isInitiator={isInitiator}
            isTeamMember={isTeamMember}
            isOwner={isOwner}
          />

        </div>


        <div className="md:col-span-3 min-w-0">

          {loading ? (

            <div className="card p-8 text-center">

              <p className="text-light-secondary dark:text-dark-secondary">
                Loading editor...
              </p>

            </div>

          )

            : chapters?.length === 0 ? (

              <div className="card p-8 text-center">

                <h2 className="text-xl font-semibold mb-3">
                  No chapters yet
                </h2>

                <p className="text-light-secondary dark:text-dark-secondary">
                  Create your first chapter to begin writing
                </p>

                {canEdit && (

                  <button id="create-chapter"
                    onClick={() =>
                      setShowCreateModal(
                        true
                      )
                    }
                    className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                  >

                    Create Chapter

                  </button>

                )}

              </div>

            )

              : !currentChapter?.id ? (

                <div className="card p-8 text-center">

                  <h2 className="text-xl font-semibold mb-3">
                    Select a chapter
                  </h2>

                  <p className="text-light-secondary dark:text-dark-secondary">
                    Choose a chapter from sidebar
                  </p>

                </div>

              )

                : (<>

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

                </>)}

        </div>

      </div>


      {showCreateModal && canEdit && (

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

  );

};

export default EditorLayout;