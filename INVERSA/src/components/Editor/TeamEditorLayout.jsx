// components/editor/TeamEditorLayout.jsx
import { useState, useEffect } from "react";
import { FiEdit2, FiZap } from "react-icons/fi";
import ChapterSidebar from "./ChapterSidebar";
import EditorHeader from "./EditorHeader";
import EditorBody from "./EditorBody";
import CreateChapterModal from "./CreateChapterModal";
import BrainstormGridLayout from "../Brainstorm/BrainstormGridLayout";
import { getBrainstormSession } from '../../utils/dataManager/brainstormManager';
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
  const [activeSection, setActiveSection] = useState('editor'); // 'editor' or 'brainstorm'
  const [brainstorm, setBrainstorm] = useState(null);
  const [brainstormLoading, setBrainstormLoading] = useState(false);

  const {
    showCreateModal,
    setShowCreateModal,
    handleCreateChapter,
    handleDeleteChapter,
  } = useChapterManagement(project, chapters, onSelectChapter, onChaptersChange);

  // Load brainstorm session when component mounts or project changes
  useEffect(() => {
    if (project?.id) {
      loadBrainstormSession();
    }
  }, [project?.id]);

  const loadBrainstormSession = async () => {
    setBrainstormLoading(true);
    try {
      const session = await getBrainstormSession(project.id);
      setBrainstorm(session);
    } catch (error) {
      console.error('Error loading brainstorm session:', error);
    } finally {
      setBrainstormLoading(false);
    }
  };

  const handleBrainstormUpdate = async () => {
    await loadBrainstormSession();
  };

  const sections = [
    { id: 'editor', label: 'Editor', icon: FiEdit2 },
    { id: 'brainstorm', label: 'Brainstorm', icon: FiZap },
  ];

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Section Navigation - Soft UI / Neumorphism */}
      <div className="sticky top-0 z-20 bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex gap-3 p-1 rounded-2xl bg-light-secondary/5 dark:bg-dark-secondary/5 shadow-inner">
            {sections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive
                      ? 'bg-light-surface dark:bg-dark-surface shadow-md text-light-accent dark:text-dark-accent'
                      : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {activeSection === 'editor' && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 px-4">
            <ChapterSidebar
              chapters={chapters}
              currentChapter={currentChapter}
              onSelectChapter={onSelectChapter}
              onCreateChapter={() => setShowCreateModal(true)}
              onDeleteChapter={handleDeleteChapter}
              isInitiator={isInitiator}
              isTeamMember={isTeamMember}
            />

            <div className="col-span-1 md:col-span-3">
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
            </div>

            {showCreateModal && (isInitiator || isTeamMember) && (
              <CreateChapterModal
                onSubmit={handleCreateChapter}
                onClose={() => setShowCreateModal(false)}
              />
            )}
          </div>
        )}

        {activeSection === 'brainstorm' && (
          <div className="max-w-7xl mx-auto px-4">
            {brainstormLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-light-secondary dark:text-dark-secondary">Loading brainstorm...</p>
              </div>
            ) : (
              <BrainstormGridLayout
                projectId={project?.id}
                brainstorm={brainstorm}
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
