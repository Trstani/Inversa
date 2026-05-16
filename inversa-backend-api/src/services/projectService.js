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

      u.name AS initiator_name

    FROM projects p

    LEFT JOIN categories c
      ON p.category_id = c.id

    LEFT JOIN genres g
      ON p.genre_id = g.id

    LEFT JOIN users u
      ON p.initiator_id = u.id

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

      u.name AS initiator_name

    FROM projects p

    LEFT JOIN categories c
      ON p.category_id = c.id

    LEFT JOIN genres g
      ON p.genre_id = g.id

    LEFT JOIN users u
      ON p.initiator_id = u.id

    WHERE
      p.id = $1
      AND p.deleted_at IS NULL

    LIMIT 1
    `,
    [projectId]
  );

  return result.rows[0];
};