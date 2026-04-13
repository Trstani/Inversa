import { useState, useEffect } from 'react';
import {
  getBrainstormSession,
  addIdea,
  deleteIdea,
  addVote,
  addTask,
  updateTask,
  deleteTask,
  addNote,
  deleteNote,
  getVoteCount,
} from '../../utils/dataManager/brainstormManager';

const useBrainstorm = (projectId) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [projectId]);

  const loadSession = async () => {
    setLoading(true);
    try {
      const data = await getBrainstormSession(projectId);
      setSession(data);
    } catch (error) {
      console.error('Error loading brainstorm session:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewIdea = async (userId, userName, content, chapterReference = null) => {
    try {
      const updated = await addIdea(projectId, { userId, userName, content, chapterReference });
      setSession(updated);
      return updated;
    } catch (error) {
      console.error('Error adding idea:', error);
    }
  };

  const removeIdea = async (ideaId) => {
    try {
      const updated = await deleteIdea(projectId, ideaId);
      setSession(updated);
      return updated;
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const vote = async (ideaId, userId, voteType) => {
    try {
      const updated = await addVote(projectId, ideaId, userId, voteType);
      setSession(updated);
      return updated;
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const createTask = async (taskData) => {
    try {
      const updated = await addTask(projectId, taskData);
      setSession(updated);
      return updated;
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTaskStatus = async (taskId, updates) => {
    try {
      const updated = await updateTask(projectId, taskId, updates);
      setSession(updated);
      return updated;
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const removeTask = async (taskId) => {
    try {
      const updated = await deleteTask(projectId, taskId);
      setSession(updated);
      return updated;
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addNewNote = async (userId, userName, content, chapterReference = null) => {
    try {
      const updated = await addNote(projectId, { userId, userName, content, chapterReference });
      setSession(updated);
      return updated;
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const removeNote = async (noteId) => {
    try {
      const updated = await deleteNote(projectId, noteId);
      setSession(updated);
      return updated;
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getIdeaVotes = (ideaId) => {
    if (!session) return { upvotes: 0, downvotes: 0, total: 0 };
    return getVoteCount(session.votes, ideaId);
  };

  return {
    session,
    loading,
    addNewIdea,
    removeIdea,
    vote,
    createTask,
    updateTaskStatus,
    removeTask,
    addNewNote,
    removeNote,
    getIdeaVotes,
  };
};

export default useBrainstorm;
