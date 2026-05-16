import express from 'express';

import authMiddleware
from '../middleware/authMiddleware.js';

import {
  create,
  getAll,
  getById,
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getAll);

router.get('/:id', getById);

router.post(
  '/',
  authMiddleware,
  create
);

export default router;