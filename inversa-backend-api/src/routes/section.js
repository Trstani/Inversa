import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
  create,
  getByChapter,
  update,
  remove,
  reorder,
  lock,
  unlock,
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

router.post(
  '/:id/lock',
  authMiddleware,
  lock
);

router.post(
  '/:id/unlock',
  authMiddleware,
  unlock
);

export default router;