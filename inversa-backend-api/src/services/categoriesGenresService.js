import pool from '../config/database.js';

export const getCategories = async () => {
  const result = await pool.query(
    `SELECT id, name, description, color, text_color, bg_class 
     FROM categories 
     ORDER BY id ASC`
  );
  return result.rows;
};

export const getGenres = async () => {
  const result = await pool.query(
    `SELECT id, name, description, color, text_color, bg_class 
     FROM genres 
     ORDER BY id ASC`
  );
  return result.rows;
};
