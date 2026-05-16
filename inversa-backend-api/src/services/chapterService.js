import pool from '../config/database.js';

export const createChapter = async ({
  project_id,
  chapter_number,
  title,
}) => {

  const result = await pool.query(
    `
    INSERT INTO chapters (
      project_id,
      chapter_number,
      title
    )

    VALUES ($1, $2, $3)

    RETURNING *
    `,
    [
      project_id,
      chapter_number,
      title,
    ]
  );

  return result.rows[0];
};

export const getChaptersByProject =
  async (projectId) => {

    const result = await pool.query(
      `
      SELECT *
      FROM chapters

      WHERE
        project_id = $1
        AND deleted_at IS NULL

      ORDER BY chapter_number ASC
      `,
      [projectId]
    );

    return result.rows;
};