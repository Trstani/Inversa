import express from 'express';

import authMiddleware
from '../middleware/authMiddleware.js';

import adminMiddleware
from '../middleware/adminMiddleware.js';

import {
  create,
  getAll,
  getById,
  getPublished,
  remove,

  incrementViews,
  getInteractions,

  likeProject,
  followProject,

  getMyFollows,
  getUserFollows,

  hideProject,
  unhideProject,
  update,

} from '../controllers/projectController.js';

const router = express.Router();

/*
=========================
GET
=========================
*/

router.get(
  '/',
  getAll
);

router.get(
  '/published',
  getPublished
);

router.get(
  '/follows/me',

  authMiddleware,

  getMyFollows
);

router.get(
  '/follows/user/:userId',

  getUserFollows
);

router.get(
  '/:id/interactions',

  authMiddleware,

  getInteractions
);

router.get(
  '/:id',

  getById
);

/*
=========================
CREATE
=========================
*/

router.post(
  '/',

  authMiddleware,

  create
);

/*
=========================
INTERACTIONS
=========================
*/

router.post(
  '/:id/views',

  incrementViews
);

router.post(
  '/:id/like',

  authMiddleware,

  likeProject
);

router.post(
  '/:id/follow',

  authMiddleware,

  followProject
);

/*
=========================
MODERATION
=========================
*/

router.post(
  '/:id/hide',

  authMiddleware,
  adminMiddleware,

  hideProject
);

router.post(
  '/:id/unhide',

  authMiddleware,
  adminMiddleware,

  unhideProject
);

/*
=========================
UPDATE
=========================
*/

router.put(
  '/:id',

  authMiddleware,

  update
);
/*
=========================
DELETE
=========================
*/

router.delete(
  '/:id',

  authMiddleware,

  remove
);

export default router;