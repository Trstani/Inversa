import express from 'express';

import authMiddleware
  from '../middleware/authMiddleware.js';

import {

  getSession,

  getIdeas,
  createIdea,
  voteIdea,
  deleteIdea,

  getTasks,
  createTask,
  updateTask,
  deleteTask,

  getDiscussions,
  createDiscussion,

  getNotes,
  createNote,

  getIdeaComments,
  createIdeaComment,
  deleteIdeaComment,

} from '../controllers/brainstormController.js';

const router =
  express.Router();

/*
=========================
SESSION
=========================
*/

router.get(
  '/:projectId',
  authMiddleware,
  getSession
);

/*
=========================
IDEAS
=========================
*/

router.get(
  '/:projectId/ideas',
  authMiddleware,
  getIdeas
);

router.post(
  '/:projectId/ideas',
  authMiddleware,
  createIdea
);

router.delete(
  '/ideas/:id',
  authMiddleware,
  deleteIdea
);

/*
=========================
TASKS
=========================
*/

router.get(
  '/:projectId/tasks',
  authMiddleware,
  getTasks
);

router.post(
  '/:projectId/tasks',
  authMiddleware,
  createTask
);

router.put(
  '/tasks/:id',
  authMiddleware,
  updateTask
);

router.delete(
  '/tasks/:id',
  authMiddleware,
  deleteTask
);

/*
=========================
DISCUSSIONS
=========================
*/

router.get(
  '/:projectId/discussions',
  authMiddleware,
  getDiscussions
);

router.post(
  '/:projectId/discussions',
  authMiddleware,
  createDiscussion
);

/*
=========================
NOTES
=========================
*/

router.get(
  '/:projectId/notes',
  authMiddleware,
  getNotes
);

router.post(
  '/:projectId/notes',
  authMiddleware,
  createNote
);

router.post(
  '/ideas/:id/vote',
  authMiddleware,
  voteIdea
);

/*
=========================
IDEA COMMENTS
=========================
*/

router.get(
  '/ideas/:ideaId/comments',

  authMiddleware,

  getIdeaComments
);

router.post(
  '/ideas/:ideaId/comments',

  authMiddleware,

  createIdeaComment
);

router.delete(
  '/ideas/:ideaId/comments/:commentId',

  authMiddleware,

  deleteIdeaComment
);

export default router;