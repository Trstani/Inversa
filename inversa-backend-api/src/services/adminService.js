import pool from '../config/database.js';

export const getDashboardStats =
  async () => {

    const users =
      await pool.query(
        'SELECT COUNT(*) FROM users'
      );

    const projects =
      await pool.query(
        'SELECT COUNT(*) FROM projects'
      );

    const chapters =
      await pool.query(
        'SELECT COUNT(*) FROM chapters'
      );

    const reports =
      await pool.query(
        'SELECT COUNT(*) FROM reports'
      );

    const hiddenProjects =
      await pool.query(`
        SELECT COUNT(*)

        FROM projects

        WHERE hidden = true
      `);

    return {

      totalUsers:
        Number(users.rows[0].count),

      totalProjects:
        Number(projects.rows[0].count),

      totalChapters:
        Number(chapters.rows[0].count),

      totalReports:
        Number(reports.rows[0].count),

      hiddenProjects:
        Number(
          hiddenProjects.rows[0].count
        ),
    };
};