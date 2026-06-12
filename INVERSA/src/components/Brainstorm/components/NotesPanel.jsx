import React, { useState, useRef } from 'react';
import { FiSend, FiFileText, FiTrash2 } from 'react-icons/fi';
import { apiClient } from '../../../api/client';

const NotesPanel = ({
  projectId,
  brainstorm,
  user,
  onNoteAdded,
  onNoteDeleted,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const sendingRef = useRef(false);
  const notes = brainstorm?.notes || [];

  const handleAddNote = async () => {
    if (!newNote.trim() || sendingRef.current) return;

    try {
      sendingRef.current = true;
      setIsSending(true);
      await onNoteAdded(newNote.trim());
      setNewNote('');
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        sendingRef.current = false;
        setIsSending(false);
      }, 800);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await apiClient.brainstorm.deleteNote(id);
      onNoteDeleted?.(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="notes" className="card p-4 h-full flex flex-col bg-light-surface dark:bg-dark-surface">
      <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-4 flex items-center gap-2">
        <FiFileText className="w-4 h-4" />
        Notes
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-light-secondary dark:text-dark-secondary text-sm">
            No notes yet
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="group relative bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-yellow-400 dark:border-yellow-600"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium text-xs text-gray-700 dark:text-gray-200 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 dark:bg-yellow-500"></span>
                    {note.name || 'Unknown'}
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap text-gray-800 dark:text-gray-100 font-sans">
                    {note.content}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {note.created_at ? new Date(note.created_at).toLocaleTimeString() : ''}
                  </p>
                </div>
                {note.user_id === user?.id && (
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-400 hover:text-red-600 transition shrink-0"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add Note..."
          className="flex-1 px-3 py-2 text-sm rounded resize-none min-h-[40px] max-h-[120px] bg-white border-black dark:bg-dark-background dark:border-dark-primary"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddNote();
            }
          }}
        />
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim() || isSending}
          className="px-3 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 disabled:opacity-50 transition"
        >
          <FiSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotesPanel;