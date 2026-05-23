import React, { useState, useEffect } from 'react';
import { FiSend, FiFileText, FiTrash2 } from 'react-icons/fi';
import { apiClient } from '../../../api/client';
import { socket } from '../../../socket/socket';

const NotesPanel = ({ projectId, onUpdate, user }) => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!projectId) return; loadNotes(); }, [projectId]);

  const loadNotes = async () => {
    setLoading(true);
    try { const response = await apiClient.brainstorm.getNotes(projectId); setNotes(response.data || []); } catch (error) { console.error('Error loading notes:', error); } finally { setLoading(false); }
  };

  const handleAddNote = async () => {
  
    if (!newNote.trim())
      return;
  
    try {
  
      await apiClient
        .brainstorm
        .addNote(
          projectId,
          {
            content:
              newNote
          }
        );
  
      setNewNote('');
  
      await loadNotes();
  
      socket.emit(
        'brainstorm_update',
        { projectId }
      );
  
    } catch (error) {
  
      console.error(
        'Error adding note:',
        error
      );
  
    }
  
  };
  
    const handleDeleteNote = async (id) => {
  
    const previousNotes =
      notes;
  
    setNotes((prev) =>
      prev.filter(
        (note) =>
          note.id !== id
      )
    );
  
    try {
  
      await apiClient
        .brainstorm
        .deleteNote(
          id
        );
  
      socket.emit(
        'brainstorm_update',
        { projectId }
      );
  
    } catch (error) {
  
      console.error(error);
  
      setNotes(
        previousNotes
      );
  
    }
  
  };

  return (
    <div className="card p-4 h-full flex flex-col bg-light-surface dark:bg-dark-surface">
      <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-4 flex items-center gap-2"><FiFileText className="w-4 h-4" />Notes</h3>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
        {loading ? (
          <div className="text-center py-4 text-light-secondary dark:text-dark-secondary text-sm">Loading...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-light-secondary dark:text-dark-secondary text-sm"><p>No notes yet</p></div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-light-background dark:bg-dark-background p-3 rounded-xl">
              <div className="flex justify-between items-start gap-3">
                {/* LEFT */}
                <div className="flex-1">
                  <p className="font-medium text-xs text-light-primary dark:text-dark-primary">
                    {note.name || "Unknown"}
                  </p>
                  <p className="text-xs text-light-secondary dark:text-dark-secondary mt-1 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <p className="text-xs text-light-secondary/50 dark:text-dark-secondary/50 mt-2">
                    {new Date(note.created_at).toLocaleTimeString()}
                  </p>
                </div>
                {/* DELETE */}
                {note.user_id === user?.id && (
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-600 transition shrink-0"
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
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddNote(); } }}
        />
        <button onClick={handleAddNote} disabled={!newNote.trim()} className="px-3 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 disabled:opacity-50 transition">
          <FiSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotesPanel;