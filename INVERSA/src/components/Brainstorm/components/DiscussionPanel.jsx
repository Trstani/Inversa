import React, { useState, useRef } from 'react';
import { FiSend, FiMessageCircle, FiTrash2 } from 'react-icons/fi';
import { apiClient } from '../../../api/client';

const DiscussionPanel = ({
  projectId,
  brainstorm,
  user,
  onDiscussionAdded,
  onDiscussionDeleted,
}) => {
  const [newDiscussion, setNewDiscussion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const sendingRef = useRef(false);
  const discussions = brainstorm?.discussions || [];

  const handleAddDiscussion = async () => {
    if (!newDiscussion.trim() || sendingRef.current) return;

    try {
      sendingRef.current = true;
      setIsSending(true);
      await onDiscussionAdded(newDiscussion.trim());
      setNewDiscussion('');
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        sendingRef.current = false;
        setIsSending(false);
      }, 800);
    }
  };

  const handleDeleteDiscussion = async (id) => {
    try {
      await apiClient.brainstorm.deleteDiscussion(id);
      onDiscussionDeleted?.(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="discussion" className="card p-4 h-[400px] flex flex-col bg-light-surface dark:bg-dark-surface">
      <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-4 flex items-center gap-2">
        <FiMessageCircle className="w-4 h-4" />
        Discussion
      </h3>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0 no-scrollbar">
        {discussions.length === 0 ? (
          <div className="text-center py-8 text-light-secondary dark:text-dark-secondary text-sm">
            No discussions yet
          </div>
        ) : (
          discussions.map((discussion) => {
            const isOwnMessage = discussion.user_id === user?.id;
            return (
              <div
                key={discussion.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                {/* Bubble chat dengan lebar konsisten (w-80 = 20rem = 320px) */}
                <div className={`max-w-full ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-3 py-2 rounded-xl shadow-sm ${
                      isOwnMessage
                        ? 'bg-light-accent dark:bg-dark-accent text-white rounded-tr-none'
                        : 'bg-indigo-50 dark:bg-dark-background text-gray-800 dark:text-gray-100 rounded-tl-none'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-medium opacity-90">
                        {discussion.name || 'Unknown'}
                      </p>
                      {isOwnMessage && (
                        <button
                          onClick={() => handleDeleteDiscussion(discussion.id)}
                          className="text-red-400 hover:text-red-600 transition shrink-0 -mt-0.5"
                          title="Delete"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words mt-1">
                      {discussion.message}
                    </p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">
                      {discussion.created_at
                        ? new Date(discussion.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <textarea
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 text-sm rounded resize-none min-h-[40px] max-h-[120px] bg-white dark:bg-dark-background border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-light-accent dark:focus:ring-dark-accent"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddDiscussion();
            }
          }}
        />
        <button
          onClick={handleAddDiscussion}
          disabled={!newDiscussion.trim() || isSending}
          className="px-3 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 disabled:opacity-50 transition"
        >
          <FiSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DiscussionPanel;