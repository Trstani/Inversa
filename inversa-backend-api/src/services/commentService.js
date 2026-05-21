import pool from '../config/database.js';

/*
=========================
GET COMMENTS BY CHAPTER
=========================
*/

export const getCommentsByChapter =
  async (chapterId) => {

    const result =
      await pool.query(
        `
        SELECT

          c.*,

          u.name,

          u.profile_image

        FROM comments c

        LEFT JOIN users u
          ON c.user_id = u.id

        WHERE
          c.chapter_id = $1

          AND c.deleted_at IS NULL

        ORDER BY
          c.created_at ASC
        `,
        [chapterId]
      );

    return result.rows;
};

/*
=========================
CREATE COMMENT
=========================
*/

export const createComment =
  async ({
    chapter_id,
    user_id,
    text,
  }) => {

    const result =
      await pool.query(
        `
        INSERT INTO comments (

          chapter_id,
          user_id,
          text

        )

        VALUES (
          $1,
          $2,
          $3
        )

        RETURNING *
        `,
        [
          chapter_id,
          user_id,
          text,
        ]
      );

    const comment =
      result.rows[0];

    /*
    =========================
    LOAD USER
    =========================
    */

    const userResult =
      await pool.query(
        `
        SELECT
          name,
          profile_image

        FROM users

        WHERE id = $1

        LIMIT 1
        `,
        [user_id]
      );

    return {

      ...comment,

      ...userResult.rows[0],
    };
};

/*
=========================
DELETE COMMENT
=========================
*/

export const deleteComment =
  async (commentId) => {

    const result =
      await pool.query(
        `
        UPDATE comments

        SET
          deleted_at = NOW()

        WHERE id = $1

        RETURNING *
        `,
        [commentId]
      );

    return result.rows[0];
};