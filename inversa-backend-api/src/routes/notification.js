import express from 'express';

import {
  getUserNotifications, readNotification
}
from '../controllers/notificationController.js';

import authMiddleware
from '../middleware/authMiddleware.js';

const router =
  express.Router();

router.get(
  '/',
  authMiddleware,
  getUserNotifications
);

router.patch(
  '/:id/read',
  authMiddleware,
  readNotification
);

export default router;