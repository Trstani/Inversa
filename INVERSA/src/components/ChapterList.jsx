import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { cleanupChapterImages } from "../utils/chapterCleanup";
import { showError } from '../utils/toast';

const ChapterList = ({ chapters, currentChapterId, onSelectChapter, onChaptersChange, projectId, project, readOnly=false }) => {
    const [chapterToDelete,setChapterToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { user } = useAuth();

    /*
    =========================
    PERMISSIONS
    =========================
    */

    const isInitiator = project?.initiator_id === user?.id;
    const isCollaborator = project?.collaborators?.some(c => c.user_id === user?.id && c.status === "approved");
    const isTeamMember = project?.is_team_project && project?.team_members?.some(m => m.user_id === user?.id);
    const canDelete = isInitiator || isCollaborator || isTeamMember;

    const handleDeleteChapter =
  async () => {

    if (!chapterToDelete) {
      return;
    }

    setDeletingId(
      chapterToDelete
    );

    try {

      await cleanupChapterImages(
        chapterToDelete
      );

      await apiClient
        .chapters
        .delete(
          chapterToDelete
        );

      onChaptersChange();

      setChapterToDelete(
        null
      );

    } catch (error) {

      console.error(
        'Failed to delete chapter:',
        error
      );

      showError(
        'Failed to delete chapter'
      );

    } finally {

      setDeletingId(
        null
      );

    }
  };

    if (chapters.length === 0) {
        return (
            <div className="p-4 text-center text-light-secondary dark:text-dark-secondary">
                <p className="text-sm">No chapters yet. Create your first chapter!</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {chapters.map((chapter, index) => (
                <div
                    key={chapter.id}
                    onClick={() => onSelectChapter(chapter.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${currentChapterId === chapter.id
                        ? 'bg-light-accent dark:bg-dark-accent text-white border-light-accent dark:border-dark-accent'
                        : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border hover:border-light-accent dark:hover:border-dark-accent'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                Chapter {index + 1}: {chapter.title}
                            </p>
                            <div
                                className={`text-xs mt-2 ${currentChapterId === chapter.id
                                        ? 'text-white/70'
                                        : 'text-light-secondary dark:text-dark-secondary'
                                    }`}
                            >
                                {chapter.status === 'published' ? (
                                    <>
                                        <p>
                                            ✓ Published by {chapter.publisher_name || 'Unknown'}
                                        </p>

                                        {chapter.published_at && (
                                            <p className="text-[10px] opacity-70">
                                                {new Date(
                                                    chapter.published_at
                                                ).toLocaleString()}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p>○ Draft</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                            {!readOnly && canDelete && (
                                <button
                                    onClick={(e) => {e.stopPropagation(); setChapterToDelete (chapter.id, e);}}
                                    disabled={deletingId === chapter.id}
                                    className={`p-1.5 rounded transition-colors ${currentChapterId === chapter.id
                                        ? 'hover:bg-white/20'
                                        : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                                        } disabled:opacity-50`}
                                    title="Delete Chapter"
                                >
                                    <FiTrash2 className={`w-4 h-4 ${currentChapterId === chapter.id ? 'text-white' : 'text-red-600 dark:text-red-400'
                                        }`} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {chapterToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-3">Delete Chapter?</h3>
                        <p className="text-sm text-light-secondary dark:text-dark-secondary mb-6">
                            This action cannot be undone. Are you sure you want to delete this chapter?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setChapterToDelete(null)} className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border">
                                Cancel
                            </button>
                            <button onClick={handleDeleteChapter} disabled={deletingId === chapterToDelete} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white disabled:opacity-50">
                                {deletingId === chapterToDelete ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterList;
