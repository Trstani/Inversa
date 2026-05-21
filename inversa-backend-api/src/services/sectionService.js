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
        updated_at = CURRENT_TIMESTAMP

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

    console.log(
      'REORDER:',
      id,
      section_order
    );

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

    console.log(
      'UPDATED:',
      result.rows[0]
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
        SELECT locked_by
        FROM sections
        WHERE id = $1
        `,
        [sectionId]
      );

    const section =
      existing.rows[0];

    // already locked by another user
    if (
      section.locked_by &&
      section.locked_by !== userId
    ) {

      throw new Error(
        'Section already locked'
      );
    }

    const result =
      await pool.query(
        `
        UPDATE sections

        SET
          locked_by = $1,
          locked_at = NOW()

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