import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
  create,
  getByChapter,
  update,
  remove,
  reorder,
} from '../controllers/sectionController.js';

const router = express.Router();

router.get(
  '/chapter/:chapterId',
  getByChapter
);

router.post(
  '/',
  authMiddleware,
  create
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

router.patch(
  '/:id/reorder',
  authMiddleware,
  reorder
);

export default router;