import pool from '../config/database.js';

/*
=========================
CREATE TEAM
=========================
*/

export const createTeam =
  async ({
    title,
    description,
    background_image,
    initiator_id,
  }) => {

    /*
    =========================
    CREATE TEAM
    =========================
    */

    const teamResult =
      await pool.query(
        `
        INSERT INTO teams (
          title,
          description,
          background_image,
          initiator_id
        )

        VALUES (
          $1,
          $2,
          $3,
          $4
        )

        RETURNING *
        `,
        [
          title,
          description,
          background_image,
          initiator_id,
        ]
      );

    const team =
      teamResult.rows[0];

    /*
    =========================
    AUTO ADD OWNER
    =========================
    */

    await pool.query(
      `
      INSERT INTO team_collaborators (
        team_id,
        user_id,
        role,
        status
      )

      VALUES (
        $1,
        $2,
        'owner',
        'approved'
      )
      `,
      [
        team.id,
        initiator_id,
      ]
    );

    return team;
};

/*
=========================
GET TEAM BY ID
=========================
*/

export const getTeamById =
  async (teamId) => {

    const result =
      await pool.query(
        `
        SELECT
          t.*,

          u.name
            AS initiator_name

        FROM teams t

        LEFT JOIN users u
          ON t.initiator_id = u.id

        WHERE
          t.id = $1
          AND t.deleted_at IS NULL

        LIMIT 1
        `,
        [teamId]
      );

    const team =
      result.rows[0];

    if (!team) {
      return null;
    }

    /*
    =========================
    LOAD MEMBERS
    =========================
    */

    const membersResult =
      await pool.query(
        `
        SELECT
          tc.*,

          u.name,
          u.email,
          u.profile_image

        FROM team_collaborators tc

        LEFT JOIN users u
          ON tc.user_id = u.id

        WHERE
          tc.team_id = $1

        ORDER BY
          tc.joined_at ASC
        `,
        [teamId]
      );

    team.members =
      membersResult.rows;

    return team;
};

/*
=========================
GET USER TEAMS
=========================
*/

export const getUserTeams =
  async (userId) => {

    const result =
      await pool.query(
        `
        SELECT

          t.*,

          tc.role,
          tc.status,

          u.name
            AS initiator_name,

          COUNT(tc2.id)::int
            AS member_count

        FROM team_collaborators tc

        INNER JOIN teams t
          ON tc.team_id = t.id

        LEFT JOIN users u
          ON t.initiator_id = u.id

        LEFT JOIN team_collaborators tc2
          ON tc2.team_id = t.id

          AND tc2.status = 'approved'

        WHERE
          tc.user_id = $1

          AND tc.status = 'approved'

          AND t.deleted_at IS NULL

        GROUP BY
          t.id,
          tc.role,
          tc.status,
          u.id

        ORDER BY
          t.created_at DESC
        `,
        [userId]
      );

    return result.rows;
};

/*
=========================
GET TEAM PROJECTS
=========================
*/

export const getTeamProjects =
  async (teamId) => {

    const result =
      await pool.query(
        `
        SELECT
          p.*,

          c.name
            AS category_name,

          g.name
            AS genre_name,

          u.name
            AS initiator_name

        FROM projects p

        LEFT JOIN categories c
          ON p.category_id = c.id

        LEFT JOIN genres g
          ON p.genre_id = g.id

        LEFT JOIN users u
          ON p.initiator_id = u.id

        WHERE
          p.team_id = $1

          AND p.deleted_at IS NULL

        ORDER BY
          p.created_at DESC
        `,
        [teamId]
      );

    return result.rows;
};

/*
=========================
DELETE TEAM
=========================
*/

export const deleteTeam =
  async (teamId) => {

    const result =
      await pool.query(
        `
        UPDATE teams

        SET
          deleted_at = NOW()

        WHERE id = $1

        RETURNING *
        `,
        [teamId]
      );

    return result.rows[0];
};

export const getAllTeams =
  async () => {

    const result =
      await pool.query(
        `
        SELECT

          t.*,

          u.name
            AS initiator_name,

          COUNT(tc.id)::int
            AS member_count

        FROM teams t

        LEFT JOIN users u
          ON t.initiator_id = u.id

        LEFT JOIN team_collaborators tc
          ON tc.team_id = t.id

          AND tc.status = 'approved'

        WHERE
          t.deleted_at IS NULL

        GROUP BY
          t.id,
          u.id

        ORDER BY
          t.created_at DESC
        `
      );

    console.log(
      result.rows
    );

    return result.rows;
};

export const updateTeam =
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
        UPDATE teams

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