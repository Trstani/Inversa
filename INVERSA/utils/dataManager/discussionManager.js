// Discussion Manager - Handle brainstorm discussions and notes

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(`inversa_${key}`, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(`inversa_${key}`);
  return data ? JSON.parse(data) : null;
};

// ============= DISCUSSIONS =============

export const loadDiscussions = async (projectId = null) => {
  const data = loadFromLocalStorage('discussions');
  const discussions = data?.discussions || [];

  if (projectId) {
    return discussions.filter(d => d.projectId === parseInt(projectId));
  }

  return discussions;
};

export const getDiscussionsByProject = async (projectId) => {
  const discussions = await loadDiscussions();
  return discussions
    .filter(d => d.projectId === parseInt(projectId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const addDiscussion = async (projectId, discussion) => {
  const discussions = await loadDiscussions();

  const newDiscussion = {
    id: Date.now(),
    projectId: parseInt(projectId),
    userId: discussion.userId,
    userName: discussion.userName,
    content: discussion.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  discussions.push(newDiscussion);
  saveToLocalStorage('discussions', { discussions });

  return newDiscussion;
};

export const updateDiscussion = async (discussionId, updates) => {
  const discussions = await loadDiscussions();
  const discussionIndex = discussions.findIndex(d => d.id === discussionId);

  if (discussionIndex >= 0) {
    discussions[discussionIndex] = {
      ...discussions[discussionIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveToLocalStorage('discussions', { discussions });
    return discussions[discussionIndex];
  }

  return null;
};

export const deleteDiscussion = async (discussionId) => {
  const discussions = await loadDiscussions();
  const filtered = discussions.filter(d => d.id !== discussionId);

  saveToLocalStorage('discussions', { discussions: filtered });
  return filtered;
};

export const getDiscussionById = async (discussionId) => {
  const discussions = await loadDiscussions();
  return discussions.find(d => d.id === discussionId);
};

// ============= NOTES =============

export const loadNotes = async (projectId = null) => {
  const data = loadFromLocalStorage('projectNotes');
  const notes = data?.notes || [];

  if (projectId) {
    return notes.filter(n => n.projectId === parseInt(projectId));
  }

  return notes;
};

export const getNotesByProject = async (projectId) => {
  const notes = await loadNotes();
  return notes
    .filter(n => n.projectId === parseInt(projectId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const addNote = async (projectId, note) => {
  const notes = await loadNotes();

  const newNote = {
    id: Date.now(),
    projectId: parseInt(projectId),
    userId: note.userId,
    userName: note.userName,
    content: note.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  notes.push(newNote);
  saveToLocalStorage('projectNotes', { notes });

  return newNote;
};

export const updateNote = async (noteId, updates) => {
  const notes = await loadNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId);

  if (noteIndex >= 0) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveToLocalStorage('projectNotes', { notes });
    return notes[noteIndex];
  }

  return null;
};

export const deleteNote = async (noteId) => {
  const notes = await loadNotes();
  const filtered = notes.filter(n => n.id !== noteId);

  saveToLocalStorage('projectNotes', { notes: filtered });
  return filtered;
};

export const getNoteById = async (noteId) => {
  const notes = await loadNotes();
  return notes.find(n => n.id === noteId);
};

// ============= IDEA COMMENTS =============

export const loadIdeaComments = async (ideaId = null) => {
  const data = loadFromLocalStorage('ideaComments');
  const comments = data?.comments || [];

  if (ideaId) {
    return comments.filter(c => c.ideaId === ideaId);
  }

  return comments;
};

export const getCommentsByIdea = async (ideaId) => {
  const comments = await loadIdeaComments();
  return comments
    .filter(c => c.ideaId === ideaId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const addIdeaComment = async (ideaId, comment) => {
  const comments = await loadIdeaComments();

  const newComment = {
    id: Date.now(),
    ideaId: ideaId,
    userId: comment.userId,
    userName: comment.userName,
    content: comment.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  comments.push(newComment);
  saveToLocalStorage('ideaComments', { comments });

  return newComment;
};

export const deleteIdeaComment = async (commentId) => {
  const comments = await loadIdeaComments();
  const filtered = comments.filter(c => c.id !== commentId);

  saveToLocalStorage('ideaComments', { comments: filtered });
  return filtered;
};

export const getIdeaCommentById = async (commentId) => {
  const comments = await loadIdeaComments();
  return comments.find(c => c.id === commentId);
};
