import { FiTrash2, FiX, FiSend, FiBook, FiMessageCircle } from 'react-icons/fi';

const IdeaCard = ({
  idea,
  isExpanded,
  onToggleExpand,
  onDelete,
  comments,
  newComment,
  onCommentChange,
  onAddComment,
  onDeleteComment,
  user,
  getChapterTitle
}) => {
  const commentCount = comments?.length || 0;

  return (
    <div className="card p-4 bg-light-surface dark:bg-dark-surface border border-light-accent/20 dark:border-dark-accent/20 hover:border-light-accent dark:hover:border-dark-accent transition">
      {/* Card Header - Clickable */}
      <div
        className="flex justify-between items-start gap-2 mb-3 cursor-pointer"
        onClick={() => onToggleExpand(idea.id)}
      >
        <div className="flex-1">
          <p className="font-medium text-sm text-light-primary dark:text-dark-primary">
            {idea.userName}
          </p>
          {idea.chapterReference && (
            <p className="text-xs text-light-accent dark:text-dark-accent mt-1 flex items-center gap-1">
              <FiBook className="w-3 h-3" />
              {getChapterTitle(idea.chapterReference)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(idea.id);
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-light-background dark:bg-dark-background text-light-secondary dark:text-dark-secondary rounded hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition"
          >
            <FiMessageCircle className="w-3 h-3" />
            Comments ({commentCount})
          </button>
          {user?.id === idea.userId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(idea.id);
              }}
              className="p-1 text-red-500 hover:bg-red-500/10 rounded transition"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <p className="text-sm text-light-secondary dark:text-dark-secondary mb-3 line-clamp-3">
        {idea.content}
      </p>

      <p className="text-xs text-light-secondary dark:text-dark-secondary opacity-70 mb-3">
        {new Date(idea.createdAt).toLocaleDateString()}
      </p>

      {/* Expanded Comments Section */}
      {isExpanded && (
        <div className="border-t border-light-accent/20 dark:border-dark-accent/20 pt-3 mt-3">
          {/* Comments List */}
          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
            {comments?.length === 0 ? (
              <p className="text-xs text-light-secondary dark:text-dark-secondary text-center py-2">
                No comments yet
              </p>
            ) : (
              comments?.map(comment => (
                <div key={comment.id} className="bg-light-background dark:bg-dark-background p-2 rounded text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-light-primary dark:text-dark-primary">
                        {comment.userName}
                      </p>
                      <p className="text-light-secondary dark:text-dark-secondary mt-1">
                        {comment.text}
                      </p>
                    </div>
                    {user?.id === comment.userId && (
                      <button
                        onClick={() => onDeleteComment(idea.id, comment.id)}
                        className="text-red-500 hover:bg-red-500/10 p-1 rounded transition flex-shrink-0"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Add comment..."
              className="flex-1 px-2 py-1 text-xs bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
              onKeyDown={(e) => e.key === 'Enter' && onAddComment(idea.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddComment(idea.id);
              }}
              disabled={!newComment.trim()}
              className="px-2 py-1 text-xs bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 disabled:opacity-50 transition flex-shrink-0"
            >
              <FiSend className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaCard;
