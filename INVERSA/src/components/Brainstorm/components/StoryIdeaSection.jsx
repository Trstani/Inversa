import { FiPlus } from 'react-icons/fi';
import IdeaCard from './IdeaCard';

const StoryIdeaSection = ({
  brainstorm,
  chapters,
  selectedChapter,
  filterChapter,
  newIdeaInput,
  expandedIdea,
  ideaComments,
  newComment,
  onSelectChapter,
  onFilterChapter,
  onIdeaInputChange,
  onAddIdea,
  onToggleExpandIdea,
  onDeleteIdea,
  onCommentChange,
  onAddComment,
  onDeleteComment,
  user,
  getChapterTitle
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-light-primary dark:text-dark-primary">
          Story Idea
        </h2>
        <select
          value={filterChapter || ''}
          onChange={(e) => onFilterChapter(e.target.value ? parseInt(e.target.value) : null)}
          className="px-3 py-1 text-sm bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
        >
          <option value="">All Chapters</option>
          {chapters.map(chapter => (
            <option key={chapter.id} value={chapter.id}>
              Chapter {chapter.chapterNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Add Idea Input */}
      <div className="mb-6 flex gap-2">
        <select
          value={selectedChapter || ''}
          onChange={(e) => onSelectChapter(e.target.value ? parseInt(e.target.value) : null)}
          className="px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
        >
          <option value="">Select chapter...</option>
          {chapters.map(chapter => (
            <option key={chapter.id} value={chapter.id}>
              Chapter {chapter.chapterNumber}: {chapter.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newIdeaInput}
          onChange={(e) => onIdeaInputChange(e.target.value)}
          placeholder="Add your idea..."
          className="flex-1 px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
          onKeyDown={(e) => e.key === 'Enter' && onAddIdea()}
        />
        <button
          onClick={onAddIdea}
          disabled={!newIdeaInput.trim()}
          className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 disabled:opacity-50 transition font-medium flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Idea
        </button>
      </div>

      {/* Ideas Grid */}
      {brainstorm?.ideas?.length === 0 ? (
        <div className="text-center py-8 text-light-secondary dark:text-dark-secondary">
          <p>No ideas yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brainstorm?.ideas
            ?.filter(idea => !filterChapter || idea.chapterReference === filterChapter)
            ?.map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isExpanded={expandedIdea === idea.id}
                onToggleExpand={onToggleExpandIdea}
                onDelete={onDeleteIdea}
                comments={ideaComments[idea.id] || []}
                newComment={newComment}
                onCommentChange={onCommentChange}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
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
