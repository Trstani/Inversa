import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
  create,
  getByProject,
} from '../controllers/chapterController.js';

const router = express.Router();

router.get(
  '/project/:projectId',
  getByProject
);

router.post(
  '/',
  authMiddleware,
  create
);

export default router;