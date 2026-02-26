import React, { useState } from 'react';
import { FiTrash2, FiArrowUp, FiArrowDown, FiEdit2 } from 'react-icons/fi';
import { deleteChapter } from '../utils/dataManager';

const ChapterList = ({ chapters, currentChapterId, onSelectChapter, onChaptersChange, projectId }) => {
    const [deletingId, setDeletingId] = useState(null);

    const handleDeleteChapter = async (chapterId, e) => {
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
            return;
        }

        setDeletingId(chapterId);
        try {
            await deleteChapter(chapterId);
            onChaptersChange();
        } catch (error) {
            console.error('Failed to delete chapter:', error);
            alert('Failed to delete chapter');
        } finally {
            setDeletingId(null);
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
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        currentChapterId === chapter.id
                            ? 'bg-light-accent dark:bg-dark-accent text-white border-light-accent dark:border-dark-accent'
                            : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border hover:border-light-accent dark:hover:border-dark-accent'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                Chapter {index + 1}: {chapter.title}
                            </p>
                            <p className={`text-xs mt-1 ${
                                currentChapterId === chapter.id
                                    ? 'text-white/70'
                                    : 'text-light-secondary dark:text-dark-secondary'
                            }`}>
                                {chapter.status === 'published' ? '✓ Published' : '○ Draft'}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                            <button
                                onClick={(e) => handleDeleteChapter(chapter.id, e)}
                                disabled={deletingId === chapter.id}
                                className={`p-1.5 rounded transition-colors ${
                                    currentChapterId === chapter.id
                                        ? 'hover:bg-white/20'
                                        : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                                } disabled:opacity-50`}
                                title="Delete Chapter"
                            >
                                <FiTrash2 className={`w-4 h-4 ${
                                    currentChapterId === chapter.id ? 'text-white' : 'text-red-600 dark:text-red-400'
                                }`} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChapterList;
