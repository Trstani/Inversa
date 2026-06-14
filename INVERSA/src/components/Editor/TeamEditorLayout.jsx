import { useState, useEffect } from "react";
import { FiEdit2, FiZap, FiMenu, FiX } from "react-icons/fi";
import ChapterSidebar from "./ChapterSidebar";
import EditorHeader from "./EditorHeader";
import EditorBody from "./EditorBody";
import CreateChapterModal from "./CreateChapterModal";
import BrainstormGridLayout from "../Brainstorm/BrainstormGridLayout";
import { apiClient } from "../../api/client";
import { useChapterManagement } from "./useChapterManagement";

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
  const [activeSection, setActiveSection] = useState(() =>
    project?.id
      ? localStorage.getItem(`project_section_${project.id}`) || "editor"
      : "editor"
  );
  const [brainstorm, setBrainstorm] = useState(null);
  const [brainstormLoading, setBrainstormLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    showCreateModal,
    setShowCreateModal,

    chapterToDelete,
    setChapterToDelete,

    handleCreateChapter,
    handleDeleteChapter,
    confirmDeleteChapter,

  } = useChapterManagement(
    project,
    chapters,
    onSelectChapter,
    onChaptersChange
  );

  useEffect(() => {
    if (project?.id) loadBrainstormSession();
  }, [project?.id]);

  const loadBrainstormSession = async () => {
    setBrainstormLoading(true);
    try {
      const [session, ideas, tasks, discussions, notes] = await Promise.all([
        apiClient.brainstorm.getSession(project.id),
        apiClient.brainstorm.getIdeas(project.id),
        apiClient.brainstorm.getTasks(project.id),
        apiClient.brainstorm.getDiscussions(project.id),
        apiClient.brainstorm.getNotes(project.id),
      ]);
      setBrainstorm({
        ...session.data,
        ideas: ideas.data || [],
        tasks: tasks.data || [],
        discussions: discussions.data || [],
        notes: notes.data || [],
      });
    } catch (error) {
      console.error("Error loading brainstorm:", error);
    } finally {
      setBrainstormLoading(false);
    }
  };

  useEffect(() => {
    if (project?.id)
      localStorage.setItem(`project_section_${project.id}`, activeSection);
  }, [activeSection, project?.id]);

  const handleBrainstormUpdate = () => loadBrainstormSession();

  const sections = [
    { id: "editor", label: "Editor", icon: FiEdit2 },
    { id: "brainstorm", label: "Brainstorm", icon: FiZap },
  ];

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Top nav */}
      <div className="sticky top-0 z-20 bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex gap-3 p-1 rounded-2xl bg-light-secondary/5 dark:bg-dark-secondary/5 shadow-inner">
            {sections.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-light-surface dark:bg-dark-surface shadow-md text-light-accent dark:text-dark-accent"
                      : "text-light-secondary dark:text-dark-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {activeSection === "editor" && (
          <div className="max-w-6xl mx-auto px-4">
            {/* Mobile sidebar toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowSidebar((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-light-surface dark:bg-dark-surface"
              >
                <span>Chapters</span>
                {showSidebar ? <FiX /> : <FiMenu />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div
                className={`${
                  showSidebar ? "block" : "hidden"
                } md:block self-start h-fit md:sticky md:top-6`}
              >
                <ChapterSidebar
                  chapters={chapters}
                  currentChapter={currentChapter}
                  onSelectChapter={(chapter) => {
                    onSelectChapter(chapter);
                    setShowSidebar(false);
                  }}
                  onCreateChapter={() => setShowCreateModal(true)}
                  onDeleteChapter={(chapterId) => setChapterToDelete(chapterId)}
                  isInitiator={isInitiator}
                  isTeamMember={isTeamMember}
                />
              </div>

              {/* Main editor area */}
              <div className="md:col-span-3 min-w-0">
                {loading ? (
                  <div className="card p-8 text-center">
                    <p>Loading editor...</p>
                  </div>
                ) : chapters?.length === 0 ? (
                  <div className="card p-8 text-center">
                    <h2 className="text-xl font-semibold mb-3">
                      No chapters yet
                    </h2>
                    <p className="text-light-secondary dark:text-dark-secondary">
                      Create your first chapter to begin writing
                    </p>
                    {(isInitiator || isTeamMember) && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                      >
                        Create Chapter
                      </button>
                    )}
                  </div>
                ) : !currentChapter?.id ? (
                  <div className="card p-8 text-center">
                    <h2 className="text-xl font-semibold mb-3">
                      Select a chapter
                    </h2>
                    <p className="text-light-secondary dark:text-dark-secondary">
                      Choose a chapter from sidebar
                    </p>
                  </div>
                ) : (
                  <>
                    <EditorHeader project={project} chapter={currentChapter} />
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
                  </>
                )}
              </div>
            </div>

            {showCreateModal && (isInitiator || isTeamMember) && (
              <CreateChapterModal
                onSubmit={handleCreateChapter}
                onClose={() => setShowCreateModal(false)}
              />
            )}
            {chapterToDelete && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold mb-3">Delete Chapter?</h3>
                  <p className="text-sm text-light-secondary dark:text-dark-secondary mb-6">
                    This action cannot be undone. Are you sure you want to delete this chapter?
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setChapterToDelete(null)} className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border">Cancel</button>
                    <button onClick={confirmDeleteChapter} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white">Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === "brainstorm" && (
          <div className="max-w-7xl mx-auto px-4">
            {brainstormLoading ? (
              <div className="flex justify-center py-12">
                <p>Loading brainstorm...</p>
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
                onUpdate={handleBrainstormUpdate}
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