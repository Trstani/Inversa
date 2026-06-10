import { FiPlus } from 'react-icons/fi';
import IdeaCard from './IdeaCard';

const StoryIdeaSection = ({
  brainstorm,
  chapters,
  selectedChapter,
  filterChapter,
  newIdeaInput,
  onSelectChapter,
  onFilterChapter,
  onIdeaInputChange,
  onAddIdea,
  onDeleteIdea,
  onVote,
  user,
  getChapterTitle,
}) => {
  const filteredIdeas =
    brainstorm?.ideas?.filter(
      (idea) => !filterChapter || idea.chapter_id === filterChapter
    ) || [];

  return (
    <div className="mb-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-light-primary dark:text-dark-primary">
          Story Ideas
        </h2>
        <select
          value={filterChapter || ''}
          onChange={(e) =>
            onFilterChapter(e.target.value ? parseInt(e.target.value) : null)
          }
          className="px-3 py-1 text-sm rounded bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
        >
          <option value="">All Chapters</option>
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              Chapter {chapter.chapter_number || chapter.chapterNumber}
            </option>
          ))}
        </select>
      </div>

      {/* INPUT CARD */}
      <div className="p-4 rounded-lg bg-light-border border-light-background dark:bg-dark-background border-light-accent/10 dark:border-dark-accent/10 mb-6 space-y-3">
        {/* Chapter Select */}
        <select
          value={selectedChapter || ''}
          onChange={(e) =>
            onSelectChapter(e.target.value ? parseInt(e.target.value) : null)
          }
          className="w-full px-4 py-2 rounded bg-light-surface dark:bg-dark-surface border border-light-accent/20 dark:border-dark-accent/20 text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
        >
          <option value="">Select chapter (optional)</option>
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              Chapter {chapter.chapter_number || chapter.chapterNumber}: {chapter.title}
            </option>
          ))}
        </select>

        {/* Input row: Title + Textarea || Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Left: Title & Description */}
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              value={newIdeaInput.title}
              onChange={(e) =>
                onIdeaInputChange({ ...newIdeaInput, title: e.target.value })
              }
              placeholder="Idea title"
              className="w-full px-4 py-2 rounded bg-light-surface dark:bg-dark-surface border border-light-accent/20 dark:border-dark-accent/20 text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none"
            />
            <textarea
              rows="3"
              value={newIdeaInput.description}
              onChange={(e) =>
                onIdeaInputChange({ ...newIdeaInput, description: e.target.value })
              }
              placeholder="Idea description (optional)"
              className="w-full px-4 py-2 rounded resize-none bg-light-surface dark:bg-dark-surface border border-light-accent/20 dark:border-dark-accent/20 text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none"
            />
          </div>

          {/* Right: Add Button – sejajar dengan textarea */}
          <div className="sm:self-end">
            <button id='story-idea'
              onClick={onAddIdea}
              disabled={!newIdeaInput.title?.trim()}
              className="w-full sm:w-auto px-6 py-2 rounded bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4" />
              Add Idea
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-8 text-light-secondary dark:text-dark-secondary">
          <p>No ideas yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onDelete={onDeleteIdea}
              onVote={onVote}
              user={user}
              getChapterTitle={getChapterTitle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryIdeaSection;