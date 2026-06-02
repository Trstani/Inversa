import express from 'express';
import {
  fetchCategories,
  fetchGenres,
} from '../controllers/categoriesGenresController.js';

const router = express.Router();

router.get('/categories', fetchCategories);
router.get('/genres', fetchGenres);

export default router;
