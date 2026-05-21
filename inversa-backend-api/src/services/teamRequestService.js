import pool
  from '../config/database.js';

/*
=========================
CREATE JOIN REQUEST
=========================
*/

export const createJoinRequest =
  async ({
    team_id,
    user_id,
    role,
    reason,
  }) => {

    /*
    =========================
    CHECK EXISTING REQUEST
    =========================
    */

    const existing =
      await pool.query(
        `
        SELECT *
        FROM team_join_requests

        WHERE
          team_id = $1
          AND user_id = $2

        LIMIT 1
        `,
        [
          team_id,
          user_id,
        ]
      );

    if (
      existing.rows.length > 0
    ) {

      throw new Error(
        'You already requested to join this team'
      );
    }

    /*
    =========================
    CREATE REQUEST
    =========================
    */

    const result =
      await pool.query(
        `
        INSERT INTO team_join_requests (

          team_id,
          user_id,
          role,
          reason

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
          team_id,
          user_id,
          role,
          reason,
        ]
      );

    return result.rows[0];
};

/*
=========================
GET TEAM REQUESTS
=========================
*/

export const getTeamRequests =
  async (teamId) => {

    const result =
      await pool.query(
        `
        SELECT

          tr.*,

          u.name,
          u.email,
          u.profile_image

        FROM team_join_requests tr

        LEFT JOIN users u
          ON tr.user_id = u.id

        WHERE
          tr.team_id = $1

        ORDER BY
          tr.created_at DESC
        `,
        [teamId]
      );

    return result.rows;
};

/*
=========================
APPROVE REQUEST
=========================
*/

export const approveRequest =
  async (requestId) => {

    /*
    =========================
    GET REQUEST
    =========================
    */

    const requestResult =
      await pool.query(
        `
        SELECT *
        FROM team_join_requests

        WHERE id = $1

        LIMIT 1
        `,
        [requestId]
      );

    const request =
      requestResult.rows[0];

    if (!request) {

      throw new Error(
        'Request not found'
      );
    }

    /*
    =========================
    UPDATE REQUEST
    =========================
    */

    await pool.query(
      `
      UPDATE team_join_requests

      SET
        status = 'approved',
        updated_at = NOW()

      WHERE id = $1
      `,
      [requestId]
    );

    /*
    =========================
    ADD TO TEAM
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
        $3,
        'approved'
      )
      `,
      [
        request.team_id,
        request.user_id,
        request.role,
      ]
    );

    return true;
};

/*
=========================
REJECT REQUEST
=========================
*/

export const rejectRequest =
  async (requestId) => {

    await pool.query(
      `
      UPDATE team_join_requests

      SET
        status = 'rejected',
        updated_at = NOW()

      WHERE id = $1
      `,
      [requestId]
    );

    return true;
};