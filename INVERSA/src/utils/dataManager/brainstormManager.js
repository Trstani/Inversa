// Brainstorm Manager - Handle brainstorming features for team projects

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(`inversa_${key}`, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(`inversa_${key}`);
  return data ? JSON.parse(data) : null;
};

// ============= BRAINSTORM SESSIONS =============

export const loadBrainstormSessions = async (projectId = null) => {
  const data = loadFromLocalStorage('brainstormSessions');
  const sessions = data?.sessions || [];

  if (projectId) {
    return sessions.filter(s => s.projectId === parseInt(projectId));
  }

  return sessions;
};

export const getBrainstormSession = async (projectId) => {
  const sessions = await loadBrainstormSessions();
  let session = sessions.find(s => s.projectId === parseInt(projectId));

  if (!session) {
    session = {
      id: Date.now(),
      projectId: parseInt(projectId),
      ideas: [],
      votes: [],
      tasks: [],
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessions.push(session);
    saveToLocalStorage('brainstormSessions', { sessions });
  }

  return session;
};

// ============= IDEAS =============

export const addIdea = async (projectId, idea) => {
  const sessions = await loadBrainstormSessions();
  const sessionIndex = sessions.findIndex(s => s.projectId === parseInt(projectId));

  if (sessionIndex >= 0) {
    const newIdea = {
      id: Date.now(),
      userId: idea.userId,
      userName: idea.userName,
      content: idea.content,
      chapterReference: idea.chapterReference || null,
      createdAt: new Date().toISOString(),
    };

    sessions[sessionIndex].ideas.push(newIdea);
    sessions[sessionIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstormSessions', { sessions });

    return sessions[sessionIndex];
  }

  return null;
};

export const deleteIdea = async (projectId, ideaId) => {
  const sessions = await loadBrainstormSessions();
  const sessionIndex = sessions.findIndex(s => s.projectId === parseInt(projectId));

  if (sessionIndex >= 0) {
    sessions[sessionIndex].ideas = sessions[sessionIndex].ideas.filter(
      i => i.id !== ideaId
    );
    sessions[sessionIndex].votes = sessions[sessionIndex].votes.filter(
      v => v.ideaId !== ideaId
    );

    sessions[sessionIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstormSessions', { sessions });

    return sessions[sessionIndex];
  }

  return null;
};

// ============= VOTES =============

export const addVote = async (projectId, ideaId, userId, voteType) => {
  const sessions = await loadBrainstormSessions();
  const sessionIndex = sessions.findIndex(s => s.projectId === parseInt(projectId));

  if (sessionIndex >= 0) {
    const existingVote = sessions[sessionIndex].votes.find(
      v => v.ideaId === ideaId && v.userId === userId
    );

    if (existingVote) {
      existingVote.voteType = voteType;
    } else {
      sessions[sessionIndex].votes.push({
        id: Date.now(),
        ideaId,
        userId,
        voteType, // 'up' or 'down'
        createdAt: new Date().toISOString(),
      });
    }

    sessions[sessionIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstormSessions', { sessions });

    return sessions[sessionIndex];
  }

  return null;
};

export const getVoteCount = (votes, ideaId) => {
  const ideaVotes = votes.filter(v => v.ideaId === ideaId);
  const upvotes = ideaVotes.filter(v => v.voteType === 'up').length;
  const downvotes = ideaVotes.filter(v => v.voteType === 'down').length;

  return {
    upvotes,
    downvotes,
    total: upvotes - downvotes,
  };
};

// ============= TASKS =============

export const addTask = async (projectId, task) => {
  const sessions = await loadBrainstormSessions();
  const sessionIndex = sessions.findIndex(s => s.projectId === parseInt(projectId));

  if (sessionIndex >= 0) {
    const newTask = {
      id: Date.now(),
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo || null,
      chapterReference: task.chapterReference || null,
      sectionReference: task.sectionReference || null,
      status: 'pending', // pending, in-progress, completed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessions[sessionIndex].tasks.push(newTask);
    sessions[sessionIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstormSessions', { sessions });

    return sessions[sessionIndex];
  }

  return null;
};

export const updateTask = async (projectId, taskId, updates) => {
  const sessions = await loadBrainstormSessions();
  const sessionIndex = sessions.findIndex(s => s.projectId === parseInt(projectId));

  if (sessionIndex >= 0) {
    const taskIndex = sessions[sessionIndex].tasks.findIndex(t => t.id === taskId);

    if (taskIndex >= 0) {
      sessions[sessionIndex].tasks[taskIndex] = {
        ...sessions[sessionIndex].tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      sessions[sessionIndex].updatedAt = new Date().toISOString();
      saveToLocalStorage('brainstormSessions', { sessions });

      return sessions[sessionIndex];
    }
  }

  return null;
};

export const deleteTask = async (projectId, taskId) => {
  const sessions = await loadBrainstormSessions();
  const sessionIndex = sessions.findIndex(s => s.projectId === parseInt(projectId));

  if (sessionIndex >= 0) {
    sessions[sessionIndex].tasks = sessions[sessionIndex].tasks.filter(
      t => t.id !== taskId
    );

    sessions[sessionIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstormSessions', { sessions });

    return sessions[sessionIndex];
  }

  return null;
};

// ============= NOTES =============

export const addNote = async (projectId, note) => {
  const sessions = await loadBrainstormSessions();
  const sessionIndex = sessions.findIndex(s => s.projectId === parseInt(projectId));

  if (sessionIndex >= 0) {
    const newNote = {
      id: Date.now(),
      userId: note.userId,
      userName: note.userName,
      content: note.content,
      chapterReference: note.chapterReference || null,
      createdAt: new Date().toISOString(),
    };

    sessions[sessionIndex].notes.push(newNote);
    sessions[sessionIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstormSessions', { sessions });

    return sessions[sessionIndex];
  }

  return null;
};

export const deleteNote = async (projectId, noteId) => {
  const sessions = await loadBrainstormSessions();
  const sessionIndex = sessions.findIndex(s => s.projectId === parseInt(projectId));

  if (sessionIndex >= 0) {
    sessions[sessionIndex].notes = sessions[sessionIndex].notes.filter(
      n => n.id !== noteId
    );

    sessions[sessionIndex].updatedAt = new Date().toISOString();
    saveToLocalStorage('brainstormSessions', { sessions });

    return sessions[sessionIndex];
  }

  return null;
};
