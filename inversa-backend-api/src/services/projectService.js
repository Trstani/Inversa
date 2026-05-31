import pool from '../config/database.js';

export const createProject = async ({
  title,
  description,
  category_id,
  genre_id,
  is_team_project,
  team_id,
  background_image,
  initiator_id,
}) => {

  const result = await pool.query(
    `
    INSERT INTO projects (
      title,
      description,
      initiator_id,
      category_id,
      genre_id,
      is_team_project,
      team_id,
      background_image
    )

    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8
    )

    RETURNING *
    `,
    [
      title,
      description,
      initiator_id,
      category_id,
      genre_id,
      is_team_project,
      team_id,
      background_image,
    ]
  );

  return result.rows[0];
};

export const getAllProjects = async () => {

  const result = await pool.query(
    `
    SELECT
      p.*,

      c.name AS category_name,

      g.name AS genre_name,

      u.name AS initiator_name,

      u.profile_image AS initiator_profile_image,

      t.title As team_name,

      t.background_image AS team_background_image

    FROM projects p

    LEFT JOIN categories c
      ON p.category_id = c.id

    LEFT JOIN genres g
      ON p.genre_id = g.id

    LEFT JOIN users u
      ON p.initiator_id = u.id
    
    LEFT JOIN teams t
      ON p.team_id = t.id

    WHERE
      p.deleted_at IS NULL
      AND p.hidden = FALSE

    ORDER BY
      p.created_at DESC
    `
  );

  return result.rows;
};

export const getProjectById = async (
  projectId
) => {

  const result = await pool.query(
    `
    SELECT
      p.*,

      c.name AS category_name,

      g.name AS genre_name,

       u.name AS initiator_name,

      u.profile_image AS initiator_profile_image,

      t.title As team_name,

      t.background_image AS team_background_image

    FROM projects p

    LEFT JOIN categories c
      ON p.category_id = c.id

    LEFT JOIN genres g
      ON p.genre_id = g.id

    LEFT JOIN users u
      ON p.initiator_id = u.id
    
    LEFT JOIN teams t
      ON p.team_id = t.id

    WHERE
      p.id = $1
      AND p.deleted_at IS NULL

    LIMIT 1
    `,
    [projectId]
  );

  return result.rows[0];
};

export const getPublishedProjects =
  async () => {

    const result =
      await pool.query(
        `
        SELECT DISTINCT
          p.*,

          c.name AS category_name,

          g.name AS genre_name,

          u.name AS initiator_name,

          u.profile_image AS initiator_profile_image,

          t.title As team_name,

          t.background_image AS team_background_image

        FROM projects p

        LEFT JOIN categories c
          ON p.category_id = c.id

        LEFT JOIN genres g
          ON p.genre_id = g.id

        LEFT JOIN users u
          ON p.initiator_id = u.id

        LEFT JOIN teams t
          ON p.team_id = t.id

        INNER JOIN chapters ch
          ON ch.project_id = p.id

        WHERE
          p.deleted_at IS NULL
          AND p.hidden = FALSE
          AND ch.status = 'published'
          AND ch.deleted_at IS NULL

        ORDER BY
          p.created_at DESC
        `
      );

    return result.rows;
};

export const deleteProject =
  async (projectId) => {

    const result =
      await pool.query(
        `
        UPDATE projects
        SET deleted_at = NOW()
        WHERE id = $1
        RETURNING *
        `,
        [projectId]
      );

    return result.rows[0];
};

/*
=========================
HIDE PROJECT
=========================
*/

export const hideProjectService =
  async (id) => {

    const result =
      await pool.query(
        `
        UPDATE projects

        SET
          hidden = true

        WHERE id = $1

        RETURNING *
        `,
        [id]
      );

    return result.rows[0];
};

/*
=========================
UNHIDE PROJECT
=========================
*/

export const unhideProjectService =
  async (id) => {

    const result =
      await pool.query(
        `
        UPDATE projects

        SET
          hidden = false

        WHERE id = $1

        RETURNING *
        `,
        [id]
      );

    return result.rows[0];
};

/*
=========================
INCREMENT VIEWS
=========================
*/

export const incrementProjectViews =
  async (id) => {

    const result =
      await pool.query(
        `
        UPDATE projects

        SET
          views = views + 1

        WHERE id = $1

        RETURNING views
        `,
        [id]
      );

    return result.rows[0];
};

/*
=========================
LIKE PROJECT
=========================
*/

export const likeProjectService =
  async (
    projectId,
    userId
  ) => {

    /*
    =========================
    CHECK EXISTING
    =========================
    */

    const existing =
      await pool.query(
        `
        SELECT id

        FROM project_likes

        WHERE
          project_id = $1
          AND user_id = $2
        `,
        [
          projectId,
          userId,
        ]
      );

    /*
    =========================
    UNLIKE
    =========================
    */

    if (
      existing.rows.length > 0
    ) {

      await pool.query(
        `
        DELETE FROM project_likes

        WHERE
          project_id = $1
          AND user_id = $2
        `,
        [
          projectId,
          userId,
        ]
      );

      const updated =
        await pool.query(
          `
          UPDATE projects

          SET likes =
            GREATEST(
              likes - 1,
              0
            )

          WHERE id = $1

          RETURNING likes
          `,
          [projectId]
        );

      return {
        liked: false,
        likes:
          updated.rows[0]
            .likes,
      };
    }

    /*
    =========================
    LIKE
    =========================
    */

    await pool.query(
      `
      INSERT INTO project_likes (
        project_id,
        user_id
      )

      VALUES ($1, $2)
      `,
      [
        projectId,
        userId,
      ]
    );

    const updated =
      await pool.query(
        `
        UPDATE projects

        SET likes = likes + 1

        WHERE id = $1

        RETURNING likes
        `,
        [projectId]
      );

    return {
      liked: true,
      likes:
        updated.rows[0]
          .likes,
    };
};

/*
=========================
FOLLOW PROJECT
=========================
*/

export const followProjectService =
  async (
    projectId,
    userId
  ) => {

    const existing =
      await pool.query(
        `
        SELECT id

        FROM project_follows

        WHERE
          project_id = $1
          AND user_id = $2
        `,
        [
          projectId,
          userId,
        ]
      );

    /*
    =========================
    UNFOLLOW
    =========================
    */

    if (
      existing.rows.length > 0
    ) {

      await pool.query(
        `
        DELETE FROM project_follows

        WHERE
          project_id = $1
          AND user_id = $2
        `,
        [
          projectId,
          userId,
        ]
      );

      return {
        followed: false,
      };
    }

    /*
    =========================
    FOLLOW
    =========================
    */

    await pool.query(
      `
      INSERT INTO project_follows (
        project_id,
        user_id
      )

      VALUES ($1, $2)
      `,
      [
        projectId,
        userId,
      ]
    );

    return {
      followed: true,
    };
};

/*
=========================
GET MY project_follows
=========================
*/

export const getMyFollowedProjects =
  async (userId) => {

    const result =
      await pool.query(
        `
        SELECT
          p.*

        FROM project_follows f

        LEFT JOIN projects p
        ON f.project_id = p.id

        WHERE
          f.user_id = $1
          AND p.deleted_at IS NULL
          AND p.hidden = FALSE

        ORDER BY
          f.followed_at DESC
        `,
        [userId]
      );

    return result.rows;
};

/*
=========================
CHECK LIKE STATUS
=========================
*/

export const checkLikeStatus =
  async (
    projectId,
    userId
  ) => {

    const result =
      await pool.query(
        `
        SELECT id

        FROM project_likes

        WHERE
          project_id = $1
          AND user_id = $2
        `,
        [
          projectId,
          userId,
        ]
      );

    return (
      result.rows.length > 0
    );
};

/*
=========================
CHECK FOLLOW STATUS
=========================
*/

export const checkFollowStatus =
  async (
    projectId,
    userId
  ) => {

    const result =
      await pool.query(
        `
        SELECT id

        FROM project_follows

        WHERE
          project_id = $1
          AND user_id = $2
        `,
        [
          projectId,
          userId,
        ]
      );

    return (
      result.rows.length > 0
    );
};

export const updateProject =
  async (
    id,
    {
      title,
      description,
      background_image,
    }
  ) => {

    const result =
      await pool.query(
        `
        UPDATE projects

        SET
          title = $1,
          description = $2,
          background_image = $3,
          updated_at = NOW()

        WHERE id = $4

        RETURNING *
        `,
        [
          title,
          description,
          background_image,
          id,
        ]
      );

    return result.rows[0];
};