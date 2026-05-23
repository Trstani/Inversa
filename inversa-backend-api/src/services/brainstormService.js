import pool from '../config/database.js';

/*
=========================
SESSION
=========================
*/

export const getOrCreateSession =
  async (projectId) => {

    const existing =
      await pool.query(
        `
        SELECT *
        FROM brainstorms
        WHERE project_id = $1
        `,
        [projectId]
      );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const created =
      await pool.query(
        `
        INSERT INTO brainstorms (
          project_id
        )

        VALUES ($1)

        RETURNING *
        `,
        [projectId]
      );

    return created.rows[0];
  };

/*
=========================
IDEAS
=========================
*/

export const getIdeasByProject =
  async (
    projectId,
    userId
  ) => {

    const brainstorm =
      await getOrCreateSession(
        projectId
      );

    const result =
      await pool.query(
        `
        SELECT
          i.*,

          EXISTS (
            SELECT 1
            FROM idea_votes iv
            WHERE
              iv.idea_id = i.id
              AND iv.user_id = $2
          ) AS has_voted

        FROM ideas i

        WHERE
          i.brainstorm_id = $1
          AND i.deleted_at IS NULL

        ORDER BY i.created_at DESC
        `,
        [
          brainstorm.id,
          userId,
        ]
      );

    return result.rows;
  };

export const getIdeaByIdService =
  async (id) => {

    const result =
      await pool.query(
        `
        SELECT *
        FROM ideas
        WHERE id = $1
        `,
        [id]
      );

    return result.rows[0];
  };

export const createIdeaService =
  async ({
    projectId,
    title,
    description,
    user_id,
    user_name,
    chapter_id,
  }) => {

    const brainstorm =
      await getOrCreateSession(
        projectId
      );

    const result =
      await pool.query(
        `
        INSERT INTO ideas (
          brainstorm_id,
          title,
          description,
          user_id,
          user_name,
          chapter_id
        )

        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        )

        RETURNING *
        `,
        [
          brainstorm.id,
          title,
          description,
          user_id,
          user_name,
          chapter_id,
        ]
      );

    return result.rows[0];
  };

export const deleteIdeaService =
  async (id) => {

    await pool.query(
      `
      UPDATE ideas

      SET
        deleted_at = NOW()

      WHERE id = $1
      `,
      [id]
    );
  };

/*
=========================
TASKS
=========================
*/

export const getTasksByProject =
  async (projectId) => {

    const brainstorm =
      await getOrCreateSession(
        projectId
      );

    const result =
      await pool.query(
        `
        SELECT *
        FROM tasks

        WHERE brainstorm_id = $1

        ORDER BY created_at DESC
        `,
        [brainstorm.id]
      );

    return result.rows;
  };

export const createTaskService =
  async ({
    projectId,
    title,
    description,
    assigned_to,
    chapter_id,
    status,
  }) => {

    const brainstorm =
      await getOrCreateSession(
        projectId
      );

    const result =
      await pool.query(
        `
        INSERT INTO tasks (
          brainstorm_id,
          title,
          description,
          assigned_to,
          chapter_id,
          status
        )

        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        )

        RETURNING *
        `,
        [
          brainstorm.id,
          title,
          description,
          assigned_to,
          chapter_id,
          status,
        ]
      );

    return result.rows[0];
  };

export const updateTaskService =
  async (
    id,
    status
  ) => {

    const result =
      await pool.query(
        `
        UPDATE tasks

        SET
          status = $1,
          updated_at = NOW()

        WHERE id = $2

        RETURNING *
        `,
        [
          status,
          id,
        ]
      );

    return result.rows[0];
  };

export const deleteTaskService =
  async (id) => {

    await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1
      `,
      [id]
    );
  };

/*
=========================
DISCUSSIONS
=========================
*/

export const getDiscussionsByProject =
  async (projectId) => {

    const brainstorm =
      await getOrCreateSession(
        projectId
      );

    const result =
      await pool.query(
        `
        SELECT d.*, u.name

        FROM discussions d

        LEFT JOIN users u
          ON d.user_id = u.id

        WHERE brainstorm_id = $1

        ORDER BY created_at DESC
        `,
        [brainstorm.id]
      );

    return result.rows;
  };

export const createDiscussionService =
  async (
    projectId,
    userId,
    message
  ) => {

    const brainstorm =
      await getOrCreateSession(
        projectId
      );

    const result =
      await pool.query(
        `
        INSERT INTO discussions (
          brainstorm_id,
          user_id,
          message
        )

        VALUES ($1, $2, $3)

        RETURNING *
        `,
        [
          brainstorm.id,
          userId,
          message,
        ]
      );

    return result.rows[0];
  };

/*
=========================
NOTES
=========================
*/

export const getNotesByProject =
  async (projectId) => {

    const brainstorm =
      await getOrCreateSession(
        projectId
      );

    const result =
      await pool.query(
        `
        SELECT n.*, u.name

        FROM notes n

        LEFT JOIN users u
          ON n.user_id = u.id

        WHERE brainstorm_id = $1

        ORDER BY created_at DESC
        `,
        [brainstorm.id]
      );

    return result.rows;
  };

export const createNoteService =
  async (
    projectId,
    userId,
    content
  ) => {

    const brainstorm =
      await getOrCreateSession(
        projectId
      );

    const result =
      await pool.query(
        `
        INSERT INTO notes (
          brainstorm_id,
          user_id,
          content
        )

        VALUES ($1, $2, $3)

        RETURNING *
        `,
        [
          brainstorm.id,
          userId,
          content,
        ]
      );

    return result.rows[0];
  };

/*
=========================
VOTE
=========================
*/

export const voteIdeaService =
  async (
    ideaId,
    userId
  ) => {

    const existing =
      await pool.query(
        `
        SELECT *

        FROM idea_votes

        WHERE
          idea_id = $1
          AND user_id = $2

        LIMIT 1
        `,
        [
          ideaId,
          userId,
        ]
      );

    /*
    =========================
    UNVOTE
    =========================
    */

    if (existing.rows.length > 0) {

      await pool.query(
        `
        DELETE FROM idea_votes

        WHERE
          idea_id = $1
          AND user_id = $2
        `,
        [
          ideaId,
          userId,
        ]
      );

      const result =
        await pool.query(
          `
          UPDATE ideas

          SET
            votes = GREATEST(
              votes - 1,
              0
            ),
            updated_at = NOW()

          WHERE id = $1

          RETURNING *
          `,
          [ideaId]
        );

      return {
        voted: false,
        idea: result.rows[0],
      };
    }

    /*
    =========================
    ADD VOTE
    =========================
    */

    await pool.query(
      `
      INSERT INTO idea_votes (
        idea_id,
        user_id
      )

      VALUES ($1, $2)
      `,
      [
        ideaId,
        userId,
      ]
    );

    const result =
      await pool.query(
        `
        UPDATE ideas

        SET
          votes = votes + 1,
          updated_at = NOW()

        WHERE id = $1

        RETURNING *
        `,
        [ideaId]
      );

    return {
      voted: true,
      idea: result.rows[0],
    };
  };

/*
=========================
COMMENTS
=========================
*/

export const getIdeaCommentsService =
  async (ideaId) => {

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
          c.idea_id = $1
          AND c.deleted_at IS NULL

        ORDER BY c.created_at ASC
        `,
        [ideaId]
      );

    return result.rows;
  };

export const getIdeaCommentByIdService =
  async (id) => {

    const result =
      await pool.query(
        `
        SELECT *
        FROM comments
        WHERE id = $1
        `,
        [id]
      );

    return result.rows[0];
  };

export const createIdeaCommentService =
  async (
    ideaId,
    userId,
    text
  ) => {

    const result =
      await pool.query(
        `
        INSERT INTO comments (
          idea_id,
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
          ideaId,
          userId,
          text,
        ]
      );

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
        [userId]
      );

    return {
      ...result.rows[0],
      ...userResult.rows[0],
    };
  };

export const deleteIdeaCommentService =
  async (commentId) => {

    await pool.query(
      `
      UPDATE comments

      SET
        deleted_at = NOW()

      WHERE id = $1
      `,
      [commentId]
    );
  };

 export const deleteDiscussionService = async (
  id,
  userId
) => {

  await pool.query(
    `
    DELETE FROM discussions
    WHERE
      id = $1
      AND user_id = $2
    `,
    [id, userId]
  );

};

export const deleteNoteService = async (
  id,
  userId
) => {

  await pool.query(
    `
    DELETE FROM notes
    WHERE
      id = $1
      AND user_id = $2
    `,
    [id, userId]
  );

};