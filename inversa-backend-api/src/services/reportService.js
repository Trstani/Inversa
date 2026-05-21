import pool from '../config/database.js';

/*
=========================
GET ALL REPORTS
=========================
*/

export const getAllReports =
  async () => {

    const result =
      await pool.query(`
        SELECT
          reports.*,

          projects.title
          AS project_title,

          projects.hidden
          AS hidden,

          users.name
          AS reporter_name

        FROM reports

        LEFT JOIN projects
        ON reports.project_id = projects.id

        LEFT JOIN users
        ON reports.reported_by = users.id

        ORDER BY reports.created_at DESC
      `);

    return result.rows;
};

/*
=========================
CREATE REPORT
=========================
*/

export const createReport =
  async ({
    project_id,
    reported_by,
    reason,
    note,
  }) => {

    const existing =
      await pool.query(
        `
        SELECT id

        FROM reports

        WHERE
          project_id = $1
          AND reported_by = $2
        `,
        [
          project_id,
          reported_by,
        ]
      );

    if (
      existing.rows.length > 0
    ) {

      throw new Error(
        'You already reported this project'
      );
    }

    const result =
      await pool.query(
        `
        INSERT INTO reports (
          project_id,
          reported_by,
          reason,
          note
        )

        VALUES (
          $1, $2, $3, $4
        )

        RETURNING *
        `,
        [
          project_id,
          reported_by,
          reason,
          note,
        ]
      );

    return result.rows[0];
};
/*
=========================
DELETE REPORT
=========================
*/

export const deleteReport =
  async (id) => {

    const result =
      await pool.query(
        `
        DELETE FROM reports

        WHERE id = $1

        RETURNING *
        `,
        [id]
      );

    return result.rows[0];
};