import pool from '../config/database.js';

export const createSection =
  async ({
    chapter_id,
    type,
    content,
    image_url,
    caption,
    section_order,
  }) => {

    const result = await pool.query(
      `
      INSERT INTO sections (
        chapter_id,
        type,
        content,
        image_url,
        caption,
        section_order
      )

      VALUES (
        $1, $2, $3,
        $4, $5, $6
      )

      RETURNING *
      `,
      [
        chapter_id,
        type,
        content,
        image_url,
        caption,
        section_order,
      ]
    );

    return result.rows[0];
};

export const getSectionsByChapter =
  async (chapterId) => {

    const result = await pool.query(
      `
      SELECT *
      FROM sections

      WHERE chapter_id = $1

      ORDER BY section_order ASC
      `,
      [chapterId]
    );

    return result.rows;
};

export const updateSection =
  async ({
    id,
    content,
    image_url,
    caption,
  }) => {

    const result = await pool.query(
      `
      UPDATE sections

      SET
        content = $1,
        image_url = $2,
        caption = $3,
        updated_at = CURRENT_TIMESTAMP,
        locked_at = CASE
          WHEN locked_by IS NOT NULL
          THEN CURRENT_TIMESTAMP
          ELSE locked_at
        END

      WHERE id = $4

      RETURNING *
      `,
      [
        content,
        image_url,
        caption,
        id,
      ]
    );

    return result.rows[0];
};

export const deleteSection =
  async (id) => {

    const result = await pool.query(
      `
      DELETE FROM sections
      WHERE id = $1

      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
};

export const reorderSection =
  async ({
    id,
    section_order,
  }) => {

    const result = await pool.query(
      `
      UPDATE sections

      SET
        section_order = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $2

      RETURNING *
      `,
      [
        section_order,
        id,
      ]
    );

    return result.rows[0];
};

export const lockSection =
  async ({
    sectionId,
    userId,
  }) => {

    const existing =
      await pool.query(
        `
        SELECT
          locked_by,
          locked_at
        FROM sections
        WHERE id = $1
        `,
        [sectionId]
      );

    const section =
      existing.rows[0];

    if (!section) {
      throw new Error("Section not found");
    }

    const LOCK_TIMEOUT =
      1 * 60 * 1000;

    const expired =
      section.locked_at &&
      (
        Date.now() -
        new Date(section.locked_at).getTime()
      ) > LOCK_TIMEOUT;

    if (
      section.locked_by &&
      section.locked_by !== userId &&
      !expired
    ) {

      throw new Error(
        "Section already locked"
      );

    }

    const result =
      await pool.query(
        `
        UPDATE sections

        SET
          locked_by = $1,
          locked_at = CURRENT_TIMESTAMP

        WHERE id = $2

        RETURNING *
        `,
        [
          userId,
          sectionId,
        ]
      );

    return result.rows[0];
};

export const unlockSection =
  async ({
    sectionId,
    userId,
  }) => {

    const result =
      await pool.query(
        `
        UPDATE sections

        SET
          locked_by = NULL,
          locked_at = NULL

        WHERE
          id = $1
          AND locked_by = $2

        RETURNING *
        `,
        [
          sectionId,
          userId,
        ]
      );

    return result.rows[0];
};

/*
=========================
FORCE UNLOCK SECTION
=========================
*/

export const forceUnlockSectionsByUser =
  async (userId) => {

    const result =
      await pool.query(
        `
        UPDATE sections

        SET
          locked_by = NULL,
          locked_at = NULL

        WHERE locked_by = $1

        RETURNING id
        `,
        [userId]
      );

    return result.rows;
};