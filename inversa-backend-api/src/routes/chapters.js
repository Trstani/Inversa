import express from 'express';

import authMiddleware
from '../middleware/authMiddleware.js';

import {
  create,
  getByProject,
  publish,
  update,
  remove
} from '../controllers/chapterController.js';

const router =
  express.Router();

router.get(
  '/project/:projectId',
  getByProject
);

router.post(
  '/',
  authMiddleware,
  create
);

router.post(
  '/:id/publish',
  authMiddleware,
  publish
);

router.put(
  '/:id',
  authMiddleware,
  update
);

router.delete(
  '/:id',
  authMiddleware,
  remove
);

export default router;