import { API_BASE_URL, saveToLocalStorage } from "./storageUtils";
import { loadChapters } from "./chapterManager";


// ============= COMMENTS =============

export const addComment = async (chapterId, comment) => {

  try {

    const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/comments`, {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify(comment),

      signal: AbortSignal.timeout(2000),

    });

    if (response.ok) {

      return await loadChapters();

    }

  } catch (error) {

    console.warn('API unavailable, using localStorage');

  }

  const chapters = await loadChapters();

  const chapterIndex = chapters.findIndex(
    c => c.id === parseInt(chapterId)
  );

  if (chapterIndex >= 0) {

    if (!chapters[chapterIndex].comments) {

      chapters[chapterIndex].comments = [];

    }

    const newComment = {

      id: Date.now(),

      userId: comment.userId,

      userName: comment.userName,

      content: comment.content,

      createdAt: new Date().toISOString(),

    };

    chapters[chapterIndex].comments.push(newComment);

    saveToLocalStorage('chapters', { chapters });

  }

  return chapters;

};



// ==============================
// GET COMMENTS
// ==============================

export const getComments = async (chapterId) => {

  const chapters = await loadChapters();

  const chapter = chapters.find(
    c => c.id === parseInt(chapterId)
  );

  return chapter?.comments || [];

};



// ==============================
// DELETE COMMENT
// ==============================

export const deleteComment = async (chapterId, commentId) => {

  try {

    const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/comments/${commentId}`, {

      method: 'DELETE',

      signal: AbortSignal.timeout(2000),

    });

    if (response.ok) {

      return await loadChapters();

    }

  } catch (error) {

    console.warn('API unavailable, using localStorage');

  }

  const chapters = await loadChapters();

  const chapterIndex = chapters.findIndex(
    c => c.id === parseInt(chapterId)
  );

  if (chapterIndex >= 0) {

    chapters[chapterIndex].comments =
      chapters[chapterIndex].comments?.filter(
        c => c.id !== parseInt(commentId)
      ) || [];

    saveToLocalStorage('chapters', { chapters });

  }

  return chapters;

};