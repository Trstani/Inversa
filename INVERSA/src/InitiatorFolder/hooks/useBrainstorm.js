import { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

const useBrainstorm = (projectId) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [projectId]);

  const loadSession = async () => {
    setLoading(true);
    try {
      const response = await apiClient.brainstorm.getSession(projectId);
      setSession(response.data);
    } catch (error) {
      console.error('Error loading brainstorm session:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewIdea = async (userId, userName, content, chapterReference = null) => {
    try {
      const response = await apiClient.brainstorm.addIdea(projectId, {
        user_id: userId,
        user_name: userName,
        title: content,
        chapter_id: chapterReference
      });
      
      // Reload session to get updated data
      await loadSession();
      return response.data;
    } catch (error) {
      console.error('Error adding idea:', error);
      throw error;
    }
  };

  const removeIdea = async (ideaId) => {
    try {
      await apiClient.brainstorm.deleteIdea(projectId, ideaId);
      
      // Reload session to get updated data
      await loadSession();
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  };

  const vote = async (ideaId, userId, voteType) => {
    try {
      // voteType should be 'upvote' or 'downvote'
      await apiClient.brainstorm.voteIdea(projectId, ideaId);
      
      // Reload session to get updated data
      await loadSession();
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await apiClient.brainstorm.addTask(projectId, {
        ...taskData,
        project_id: projectId
      });
      
      // Reload session to get updated data
      await loadSession();
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTaskStatus = async (taskId, updates) => {
    try {
      const response = await apiClient.brainstorm.updateTask(projectId, taskId, updates);
      
      // Reload session to get updated data
      await loadSession();
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const removeTask = async (taskId) => {
    try {
      await apiClient.brainstorm.deleteTask(projectId, taskId);
      
      // Reload session to get updated data
      await loadSession();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const addNewNote = async (userId, userName, content, chapterReference = null) => {
    try {
      // Notes are stored as comments on ideas in the new system
      // For now, we'll add them as a special type of comment
      const response = await apiClient.brainstorm.addComment(projectId, null, {
        user_id: userId,
        user_name: userName,
        content: content,
        chapter_id: chapterReference,
        type: 'note'
      });
      
      // Reload session to get updated data
      await loadSession();
      return response.data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const removeNote = async (noteId) => {
    try {
      // This would need the ideaId to work properly
      // For now, we'll just reload the session
      await loadSession();
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  const getIdeaVotes = (ideaId) => {
    if (!session) return { upvotes: 0, downvotes: 0, total: 0 };
    
    // Calculate votes from session data
    const ideas = session.ideas || [];
    const idea = ideas.find(i => i.id === ideaId);
    
    if (!idea) return { upvotes: 0, downvotes: 0, total: 0 };
    
    return {
      upvotes: idea.upvotes || 0,
      downvotes: idea.downvotes || 0,
      total: (idea.upvotes || 0) + (idea.downvotes || 0)
    };
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
