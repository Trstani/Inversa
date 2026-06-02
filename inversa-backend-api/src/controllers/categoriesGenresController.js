import {
  getCategories,
  getGenres,
} from '../services/categoriesGenresService.js';

export const fetchCategories = async (req, res) => {
  try {
    const categories = await getCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Fetch categories error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

export const fetchGenres = async (req, res) => {
  try {
    const genres = await getGenres();

    res.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.error('Fetch genres error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch genres',
      error: error.message,
    });
  }
};
