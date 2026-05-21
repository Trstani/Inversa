import express from 'express';

import authMiddleware
from '../middleware/authMiddleware.js';

import adminMiddleware
from '../middleware/adminMiddleware.js';

import {

  getReports,
  createNewReport,
  removeReport,

} from '../controllers/reportController.js';

const router =
  express.Router();

/*
=========================
GET REPORTS
ADMIN ONLY
=========================
*/

router.get(
  '/',

  authMiddleware,
  adminMiddleware,

  getReports
);

/*
=========================
CREATE REPORT
=========================
*/

router.post(
  '/',

  authMiddleware,

  createNewReport
);

/*
=========================
DELETE REPORT
ADMIN ONLY
=========================
*/

router.delete(
  '/:id',

  authMiddleware,
  adminMiddleware,

  removeReport
);

export default router;