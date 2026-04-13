// components/Brainstorm/components/NotesPanel.jsx
import React, { useState, useEffect } from 'react';
import { FiSend, FiTrash2, FiFileText } from 'react-icons/fi';
import { addNote, deleteNote, getNotesByProject } from '../../../utils/dataManager/discussionManager';

const NotesPanel = ({ projectId, onUpdate, user }) => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [projectId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotesByProject(projectId);
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await addNote(projectId, {
        userId: user.id,
        userName: user.name,
        content: newNote,
      });
      setNewNote('');
      await loadNotes();
      onUpdate?.();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      await loadNotes();
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="card p-4 h-full flex flex-col bg-light-surface dark:bg-dark-surface">
      <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-4 flex items-center gap-2">
        <FiFileText className="w-4 h-4" />
        Notes
      </h3>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
        {loading ? (
          <div className="text-center py-4 text-light-secondary dark:text-dark-secondary text-sm">
            Loading...
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-light-secondary dark:text-dark-secondary text-sm">
            <p>No notes yet</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-light-background dark:bg-dark-background p-3 rounded">
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="font-medium text-xs text-light-primary dark:text-dark-primary">
                  {note.userName}
                </p>
                {user?.id === note.userId && (
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-xs text-light-secondary dark:text-dark-secondary whitespace-pre-wrap">
                {note.content}
              </p>
              <p className="text-xs text-light-secondary/50 dark:text-dark-secondary/50 mt-1">
                {new Date(note.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add note..."
          className="flex-1 px-3 py-2 text-sm bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
          onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
        />
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className="px-3 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 disabled:opacity-50 transition"
        >
          <FiSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotesPanel;
