import express from 'express';

import authMiddleware
  from '../middleware/authMiddleware.js';

import {
  create,
  getAll,
  getById,
  getUserTeamsController,
  getProjects,
  remove,
  update,
} from '../controllers/teamController.js';

const router =
  express.Router();

/*
=========================
GET USER TEAMS
=========================
*/

router.get(
  '/',
  getAll
);

router.get(
  '/user/:userId',
  authMiddleware,
  getUserTeamsController
);

/*
=========================
GET TEAM BY ID
=========================
*/

router.get(
  '/:id',
  authMiddleware,
  getById
);

/*
=========================
GET TEAM PROJECTS
=========================
*/

router.get(
  '/:id/projects',
  authMiddleware,
  getProjects
);

/*
=========================
CREATE TEAM
=========================
*/

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

/*
=========================
DELETE TEAM
=========================
*/

router.delete(
  '/:id',
  authMiddleware,
  remove
);

export default router;