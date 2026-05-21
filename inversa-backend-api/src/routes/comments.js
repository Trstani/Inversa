import express from 'express';

import authMiddleware
  from '../middleware/authMiddleware.js';

import {
  getByChapter,
  create,
  remove,
} from '../controllers/commentController.js';

const router =
  express.Router();

/*
=========================
GET COMMENTS
=========================
*/

router.get(
  '/chapter/:id',
  getByChapter
);

/*
=========================
CREATE COMMENT
=========================
*/

router.post(
  '/chapter/:id',

  authMiddleware,

  create
);

/*
=========================
DELETE COMMENT
=========================
*/

router.delete(
  '/:id',

  authMiddleware,

  remove
);

export default router;