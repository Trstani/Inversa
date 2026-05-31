import pool from '../config/database.js';

/*
=========================
CREATE CHAPTER
=========================
*/

export const createChapter =
  async ({
    project_id,
    title,
  }) => {

    /*
    =========================
    AUTO GENERATE
    CHAPTER NUMBER
    =========================
    */

    const chapterCount =
      await pool.query(
        `
        SELECT COUNT(*)::int AS total

        FROM chapters

        WHERE
          project_id = $1

          AND deleted_at IS NULL
        `,
        [project_id]
      );

    const nextChapterNumber =
      chapterCount.rows[0].total + 1;

    /*
    =========================
    INSERT CHAPTER
    =========================
    */

    const result =
      await pool.query(
        `
        INSERT INTO chapters (
          project_id,
          chapter_number,
          title,
          status
        )

        VALUES (
          $1,
          $2,
          $3,
          'draft'
        )

        RETURNING *
        `,
        [
          project_id,
          nextChapterNumber,
          title,
        ]
      );

    /*
    =========================
    UPDATE TOTAL CHAPTERS
    =========================
    */

    const totalResult =
      await pool.query(
        `
        SELECT COUNT(*)::int AS total

        FROM chapters

        WHERE
          project_id = $1

          AND deleted_at IS NULL
        `,
        [project_id]
      );

    const total =
      totalResult.rows[0].total;

    await pool.query(
      `
      UPDATE projects

      SET
        total_chapters = $1,
        updated_at = NOW()

      WHERE id = $2
      `,
      [
        total,
        project_id,
      ]
    );

    return result.rows[0];
};

/*
=========================
GET CHAPTERS BY PROJECT
=========================
*/

export const getChaptersByProject =
  async (projectId) => {

    const result =
      await pool.query(
        `
        SELECT 

        c.*,
        u.name AS publisher_name

        FROM chapters c

        LEFT JOIN users u
        ON u.id = c.published_by

        WHERE
          c.project_id = $1

          AND c.deleted_at IS NULL

        ORDER BY c.chapter_number ASC
        `,
        [projectId]
      );

    return result.rows;
};

/*
=========================
PUBLISH CHAPTER
=========================
*/

export const publishChapter =
  async (id, userId) => {

    const result =
      await pool.query(
        `
        UPDATE chapters

        SET
          status = 'published',
          published_by = $2,
          published_at = NOW(),
          updated_at = NOW()

        WHERE id = $1

        RETURNING *
        `,
        [id, userId]
      );

    return result.rows[0];
};

/*
=========================
UPDATE CHAPTER
=========================
*/

export const updateChapter =
  async (
    id,
    {
      title,
    }
  ) => {

    const result =
      await pool.query(
        `
        UPDATE chapters

        SET
          title = $1,
          updated_at = NOW()

        WHERE id = $2

        RETURNING *
        `,
        [
          title,
          id,
        ]
      );

    return result.rows[0];
};

export const deleteChapterService =
async(id)=>{

  await pool.query(
    `
    DELETE
    FROM chapters
    WHERE id=$1
    `,
    [id]
  );

};