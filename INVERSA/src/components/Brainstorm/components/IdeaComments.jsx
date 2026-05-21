import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../api/client';

const IdeaComments = ({ ideaId }) => {
  console.log('IDEA ID:', ideaId);

  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadCurrentUser();
    }
  }, [user?.id]);

  const loadCurrentUser = async () => {
    try {
      console.log('LOAD CURRENT USER');
      const response = await apiClient.users.getById(user.id);
      console.log('USER RESPONSE:', response);
      setCurrentUserProfile(response.data);
    } catch (error) {
      console.error('LOAD USER ERROR:', error);
    }
  };

  useEffect(() => {
    if (!ideaId) {
      console.warn('IDEA ID NULL');
      return;
    }
    loadComments();
  }, [ideaId]);

  const loadComments = async () => {
    try {
      console.log('LOAD COMMENTS FOR:', ideaId);
      const response = await apiClient.brainstorm.getComments(ideaId);
      console.log('COMMENTS RESPONSE:', response);
      console.log('COMMENTS DATA:', response.data);
      setComments(response.data || []);
    } catch (error) {
      console.error('LOAD COMMENTS ERROR:', error);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      console.warn('EMPTY INPUT');
      return;
    }
    try {
      console.log('SUBMIT COMMENT');
      console.log('IDEA ID:', ideaId);
      console.log('INPUT:', input);
      const response = await apiClient.brainstorm.addComment(ideaId, {
        text: input,
      });
      console.log('ADD COMMENT RESPONSE:', response);
      console.log('ADD COMMENT DATA:', response.data);
      setInput('');
      await loadComments();
    } catch (error) {
      console.error('SUBMIT COMMENT ERROR:', error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      console.log('DELETE COMMENT:', commentId);
      await apiClient.brainstorm.deleteComment(ideaId, commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('DELETE COMMENT ERROR:', error);
    }
  };

  console.log('COMMENTS STATE:', comments);

  return (
    <div>
      {/* Input Area */}
      {user && (
        <div className="flex gap-2 mb-5">
          {/* Current user avatar */}
          <div className="w-8 h-8 overflow-hidden rounded-full bg-light-accent/10 dark:bg-dark-accent/10 flex items-center justify-center shrink-0">
            {currentUserProfile?.profile_image ? (
              <img
                src={currentUserProfile.profile_image}
                alt={currentUserProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-light-accent dark:text-dark-accent">
                {currentUserProfile?.name?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>

          {/* Input & send button */}
          <div className="flex-1 flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="Reply to this idea..."
              className="flex-1 resize-none rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background p-2 text-sm text-light-primary dark:text-dark-primary placeholder-light-secondary/60 dark:placeholder-dark-secondary/60 focus:outline-none focus:ring-1 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 transition"
            />
            <button
              onClick={handleSubmit}
              className="p-4 rounded-lg bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 transition-all shrink-0"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {comments.map((comment) => {
          console.log('RENDER COMMENT:', comment);
          return (
            <div
              key={comment.id}
              className="rounded-lg bg-light-background/50 dark:bg-dark-background/50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-2.5">
                  {/* Commenter avatar */}
                  <Link to={`/profile/${comment.user_id}`}>
                    <div className="w-8 h-8 overflow-hidden rounded-full bg-light-accent/10 dark:bg-dark-accent/10 flex items-center justify-center shrink-0">
                      {comment.profile_image ? (
                        <img
                          src={comment.profile_image}
                          alt={comment.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-light-accent dark:text-dark-accent">
                          {comment.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Comment content */}
                  <div>
                    <Link to={`/profile/${comment.user_id}`}>
                      <p className="text-sm font-medium text-light-primary dark:text-dark-primary hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                        {comment.name}
                      </p>
                    </Link>
                    <p className="text-xs text-light-secondary/70 dark:text-dark-secondary/70 mt-0.5">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-light-primary dark:text-dark-primary mt-1.5 whitespace-pre-wrap leading-relaxed">
                      {comment.text || comment.content || 'NO COMMENT TEXT'}
                    </p>
                  </div>
                </div>

                {/* Delete button */}
                {Number(comment.user_id) === Number(user?.id) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IdeaComments;