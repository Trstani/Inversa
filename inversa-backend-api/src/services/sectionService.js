import pool from '../config/database.js';

export const createSection =
  async ({
    chapter_id,
    type,
    content,
    image_url,
    caption,
    section_order,
  }) => {

    const result = await pool.query(
      `
      INSERT INTO sections (
        chapter_id,
        type,
        content,
        image_url,
        caption,
        section_order
      )

      VALUES (
        $1, $2, $3,
        $4, $5, $6
      )

      RETURNING *
      `,
      [
        chapter_id,
        type,
        content,
        image_url,
        caption,
        section_order,
      ]
    );

    return result.rows[0];
};

export const getSectionsByChapter =
  async (chapterId) => {

    const result = await pool.query(
      `
      SELECT *
      FROM sections

      WHERE chapter_id = $1

      ORDER BY section_order ASC
      `,
      [chapterId]
    );

    return result.rows;
};

export const updateSection =
  async ({
    id,
    content,
    image_url,
    caption,
  }) => {

    const result = await pool.query(
      `
      UPDATE sections

      SET
        content = $1,
        image_url = $2,
        caption = $3,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $4

      RETURNING *
      `,
      [
        content,
        image_url,
        caption,
        id,
      ]
    );

    return result.rows[0];
};

export const deleteSection =
  async (id) => {

    const result = await pool.query(
      `
      DELETE FROM sections
      WHERE id = $1

      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
};

export const reorderSection =
  async ({
    id,
    section_order,
  }) => {

    const result = await pool.query(
      `
      UPDATE sections

      SET
        section_order = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $2

      RETURNING *
      `,
      [
        section_order,
        id,
      ]
    );

    return result.rows[0];
};