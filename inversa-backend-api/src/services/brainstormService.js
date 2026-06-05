import pool from '../config/database.js';
import { createNotification } from './notificationService.js';
/*
=========================
SESSION
=========================
*/

export const getOrCreateSession = async (projectId) => {
  const existing = await pool.query(
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

  const created = await pool.query(
    `
    INSERT INTO brainstorms (project_id)
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

export const getIdeasByProject = async (projectId, userId) => {
  const brainstorm = await getOrCreateSession(projectId);

  const result = await pool.query(
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
    [brainstorm.id, userId]
  );

  return result.rows;
};

export const getIdeaByIdService = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM ideas
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

export const createIdeaService = async ({
  projectId,
  title,
  description,
  user_id,
  user_name,
  chapter_id,
}) => {
  const brainstorm = await getOrCreateSession(projectId);

  const result = await pool.query(
    `
    INSERT INTO ideas (
      brainstorm_id,
      title,
      description,
      user_id,
      user_name,
      chapter_id
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [brainstorm.id, title, description, user_id, user_name, chapter_id]
  );

  const idea = result.rows[0];

  const projectResult =
  await pool.query(
    `
    SELECT
      p.title AS project_title,
      p.team_id,
      t.title AS team_name
    FROM projects p

    LEFT JOIN teams t
    ON t.id = p.team_id

    WHERE p.id = $1

    LIMIT 1
    `,
    [projectId]
  );

  const members =
  await pool.query(
    `
    SELECT user_id
    FROM team_collaborators
    WHERE team_id = $1
    `,
    [
      projectResult.rows[0].team_id
    ]
  );

for (
  const member
  of members.rows
) {

  if (
    member.user_id === user_id
  ) {
    continue;
  }

  await createNotification(

    member.user_id,

    'New Story Idea',

    `${user_name} added "${title}" to ${projectResult.rows[0].project_title}`

  );

}

return idea;
};

export const deleteIdeaService = async (id) => {
  await pool.query(
    `
    UPDATE ideas
    SET deleted_at = NOW()
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

export const getTasksByProject = async (projectId) => {
  const brainstorm = await getOrCreateSession(projectId);

  const result = await pool.query(
    `
    SELECT
      t.*,
      u.name AS assigned_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE
      t.brainstorm_id = $1
      AND t.deleted_at IS NULL
    ORDER BY t.created_at DESC
    `,
    [brainstorm.id]
  );

  return result.rows;
};

export const createTaskService = async ({
  projectId,
  title,
  description,
  assigned_to,
  chapter_id,
  section_id,
  due_date,
  status,
  created_by
}) => {
  const brainstorm = await getOrCreateSession(projectId);

  const inserted = await pool.query(
    `
    INSERT INTO tasks (
      brainstorm_id,
      title,
      description,
      assigned_to,
      chapter_id,
      section_id,
      due_date,
      status,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      brainstorm.id,
      title,
      description,
      assigned_to,
      chapter_id,
      section_id,
      due_date,
      status,
      created_by
    ]
  );

  const taskId = inserted.rows[0].id;

  const result = await pool.query(
  `
  SELECT
    t.*,
    u.name AS assigned_name
  FROM tasks t
  LEFT JOIN users u ON t.assigned_to = u.id
  WHERE t.id = $1
  `,
  [taskId]
);

const task =
  result.rows[0];

  const creatorResult =
  await pool.query(
    `
    SELECT name
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [created_by]
  );

  const projectResult =
  await pool.query(
    `
    SELECT title
    FROM projects
    WHERE id = $1
    LIMIT 1
    `,
    [projectId]
  );

  if (
  assigned_to &&
  assigned_to !== created_by
) {

  await createNotification(

    assigned_to,

    'New Task Assigned',

    `${creatorResult.rows[0].name} assigned "${title}" in ${projectResult.rows[0].title} to you`

  );

}
return task;
};

export const updateTaskService = async (id, status) => {
  const result = await pool.query(
    `
    UPDATE tasks
    SET
      status = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0];
};

export const deleteTaskService = async (id) => {
  await pool.query(
    `
    UPDATE tasks
    SET deleted_at = NOW()
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

export const getDiscussionsByProject = async (projectId) => {
  const brainstorm = await getOrCreateSession(projectId);

  const result = await pool.query(
    `
    SELECT d.*, u.name
    FROM discussions d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE brainstorm_id = $1
    ORDER BY created_at DESC
    `,
    [brainstorm.id]
  );

  return result.rows;
};

export const createDiscussionService = async (projectId, userId, message) => {
  const brainstorm = await getOrCreateSession(projectId);

  const inserted = await pool.query(
    `
    INSERT INTO discussions (brainstorm_id, user_id, message)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [brainstorm.id, userId, message]
  );

  const discussionId = inserted.rows[0].id;

  const result = await pool.query(
    `
    SELECT
      d.*,
      u.name
    FROM discussions d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.id = $1
    `,
    [discussionId]
  );

  return result.rows[0];
};

/*
=========================
NOTES
=========================
*/

export const getNotesByProject = async (projectId) => {
  const brainstorm = await getOrCreateSession(projectId);

  const result = await pool.query(
    `
    SELECT n.*, u.name
    FROM notes n
    LEFT JOIN users u ON n.user_id = u.id
    WHERE brainstorm_id = $1
    ORDER BY created_at DESC
    `,
    [brainstorm.id]
  );

  return result.rows;
};

export const createNoteService = async (projectId, userId, content) => {
  const brainstorm = await getOrCreateSession(projectId);

  const inserted = await pool.query(
    `
    INSERT INTO notes (brainstorm_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [brainstorm.id, userId, content]
  );

  const noteId = inserted.rows[0].id;

  const result = await pool.query(
    `
    SELECT
      n.*,
      u.name
    FROM notes n
    LEFT JOIN users u ON n.user_id = u.id
    WHERE n.id = $1
    `,
    [noteId]
  );

  return result.rows[0];
};

/*
=========================
VOTE
=========================
*/

export const voteIdeaService = async (ideaId, userId) => {
  const existing = await pool.query(
    `
    SELECT *
    FROM idea_votes
    WHERE
      idea_id = $1
      AND user_id = $2
    LIMIT 1
    `,
    [ideaId, userId]
  );

  // UNVOTE
  if (existing.rows.length > 0) {
    await pool.query(
      `
      DELETE FROM idea_votes
      WHERE
        idea_id = $1
        AND user_id = $2
      `,
      [ideaId, userId]
    );

    const result = await pool.query(
      `
      UPDATE ideas
      SET
        votes = GREATEST(votes - 1, 0),
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

  // ADD VOTE
  await pool.query(
    `
    INSERT INTO idea_votes (idea_id, user_id)
    VALUES ($1, $2)
    `,
    [ideaId, userId]
  );

  const result = await pool.query(
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

export const getIdeaCommentsService = async (ideaId) => {
  const result = await pool.query(
    `
    SELECT
      c.*,
      u.name,
      u.profile_image
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE
      c.idea_id = $1
      AND c.deleted_at IS NULL
    ORDER BY c.created_at ASC
    `,
    [ideaId]
  );

  return result.rows;
};

export const getIdeaCommentByIdService = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM comments
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

export const createIdeaCommentService = async (ideaId, userId, text) => {
  const result = await pool.query(
    `
    INSERT INTO comments (idea_id, user_id, text)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [ideaId, userId, text]
  );

  const userResult = await pool.query(
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

export const deleteIdeaCommentService = async (commentId) => {
  await pool.query(
    `
    UPDATE comments
    SET deleted_at = NOW()
    WHERE id = $1
    `,
    [commentId]
  );
};

export const deleteDiscussionService = async (id, userId) => {
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

export const deleteNoteService = async (id, userId) => {
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