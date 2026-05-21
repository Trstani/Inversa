import pool from '../config/database.js';

/*
=========================
SAVE HISTORY
=========================
*/

export const saveReadingHistory =
  async ({
    user_id,
    project_id,
    chapter_id,
    progress = 0,
  }) => {

    /*
    =========================
    CHECK EXISTING
    =========================
    */

    const existing =
      await pool.query(
        `
        SELECT id

        FROM reading_history

        WHERE
          user_id = $1
          AND project_id = $2
          AND deleted_at IS NULL
        `,
        [
          user_id,
          project_id,
        ]
      );

    /*
    =========================
    UPDATE
    =========================
    */

    if (
      existing.rows.length > 0
    ) {

      const updated =
        await pool.query(
          `
          UPDATE reading_history

          SET
            chapter_id = $1,
            progress = $2,
            updated_at = NOW(),
            last_read_at = NOW()

          WHERE
            user_id = $3
            AND project_id = $4

          RETURNING *
          `,
          [
            chapter_id,
            progress,
            user_id,
            project_id,
          ]
        );

      return updated.rows[0];
    }

    /*
    =========================
    INSERT
    =========================
    */

    const created =
      await pool.query(
        `
        INSERT INTO reading_history (
          user_id,
          project_id,
          chapter_id,
          progress
        )

        VALUES (
          $1, $2, $3, $4
        )

        RETURNING *
        `,
        [
          user_id,
          project_id,
          chapter_id,
          progress,
        ]
      );

    return created.rows[0];
};

/*
=========================
GET USER HISTORY
=========================
*/

export const getUserHistory =
  async (userId) => {

    const result =
      await pool.query(
        `
        SELECT
          rh.*,

          p.id AS project_id,
          p.title,
          p.background_image

        FROM reading_history rh

        LEFT JOIN projects p
        ON rh.project_id = p.id

        WHERE
          rh.user_id = $1
          AND rh.deleted_at IS NULL
          AND p.deleted_at IS NULL

        ORDER BY
          rh.last_read_at DESC

        LIMIT 10
        `,
        [userId]
      );

    return result.rows.map(
  (row) => ({

    id: row.id,

    project: {
      id: row.project_id,
      title: row.title,
      backgroundImage:
        row.background_image,
    },

    last_read_at:
      row.last_read_at,
  })
);
};