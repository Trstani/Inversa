import express from 'express';

import authMiddleware
from '../middleware/authMiddleware.js';

import {
  saveHistory,
  getMyHistory,
  getUserHistoryByUser,
} from '../controllers/historyController.js';

const router =
  express.Router();

  /*
=========================
GET USER HISTORY
=========================
*/

router.get(
  '/user/:userId',

  getUserHistoryByUser
);

/*
=========================
GET MY HISTORY
=========================
*/

router.get(
  '/',
  authMiddleware,
  getMyHistory
);

/*
=========================
SAVE HISTORY
=========================
*/

router.post(
  '/',
  authMiddleware,
  saveHistory
);

export default router;