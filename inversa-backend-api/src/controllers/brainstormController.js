import {
  getOrCreateSession,

  getIdeasByProject,
  getIdeaByIdService,
  createIdeaService,
  voteIdeaService,
  deleteIdeaService,

  getTasksByProject,
  createTaskService,
  updateTaskService,
  deleteTaskService,

  getDiscussionsByProject,
  createDiscussionService,

  getNotesByProject,
  createNoteService,

  getIdeaCommentsService,
  getIdeaCommentByIdService,
  createIdeaCommentService,
  deleteIdeaCommentService,

} from '../services/brainstormService.js';

/*
=========================
SESSION
=========================
*/

export const getSession =
  async (req, res) => {

    try {

      const session =
        await getOrCreateSession(
          req.params.projectId
        );

      res.json({
        success: true,
        data: session,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=========================
IDEAS
=========================
*/

export const getIdeas =
  async (req, res) => {

    try {

      const ideas =
        await getIdeasByProject(
          req.params.projectId,
          req.user.id
        );

      res.json({
        success: true,
        total: ideas.length,
        data: ideas,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const createIdea =
  async (req, res) => {

    try {

      const {
        title,
        description,
        user_id,
        user_name,
        chapter_id,
      } = req.body;

      if (!title?.trim()) {

        return res.status(400).json({
          success: false,
          message: 'Idea title is required',
        });
      }

      if (title.length > 300) {

        return res.status(400).json({
          success: false,
          message: 'Idea too long',
        });
      }

      const idea =
        await createIdeaService({

          projectId:
            req.params.projectId,

          title:
            title.trim(),

          description,

          user_id,
          user_name,

          chapter_id,
        });

      res.status(201).json({
        success: true,
        data: idea,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteIdea =
  async (req, res) => {

    try {

      const idea =
        await getIdeaByIdService(
          req.params.id
        );

      if (!idea) {

        return res.status(404).json({
          success: false,
          message: 'Idea not found',
        });
      }

      const isOwner =
        Number(idea.user_id) ===
        Number(req.user.id);

      if (!isOwner) {

        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      await deleteIdeaService(
        req.params.id
      );

      res.json({
        success: true,
        message: 'Idea deleted',
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=========================
TASKS
=========================
*/

export const getTasks =
  async (req, res) => {

    try {

      const tasks =
        await getTasksByProject(
          req.params.projectId
        );

      res.json({
        success: true,
        total: tasks.length,
        data: tasks,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const createTask =
  async (req, res) => {

    try {

      const {
        title,
        description,
        assigned_to,
        chapter_id,
        section_id,
        status,
      } = req.body;

      if (!title?.trim()) {

        return res.status(400).json({
          success: false,
          message: 'Task title is required',
        });
      }

      const task =
        await createTaskService({

          projectId:
            req.params.projectId,

          title:
            title.trim(),

          description,

          assigned_to,

          chapter_id,

          section_id,

          status,
        });

      res.status(201).json({
        success: true,
        data: task,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const updateTask =
  async (req, res) => {

    try {

      const task =
        await updateTaskService(
          req.params.id,
          req.body.status
        );

      res.json({
        success: true,
        data: task,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteTask =
  async (req, res) => {

    try {

      await deleteTaskService(
        req.params.id
      );

      res.json({
        success: true,
        message: 'Task deleted',
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=========================
DISCUSSIONS
=========================
*/

export const getDiscussions =
  async (req, res) => {

    try {

      const discussions =
        await getDiscussionsByProject(
          req.params.projectId
        );

      res.json({
        success: true,
        total: discussions.length,
        data: discussions,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const createDiscussion =
  async (req, res) => {

    try {

      const { message } =
        req.body;

      if (!message?.trim()) {

        return res.status(400).json({
          success: false,
          message: 'Message required',
        });
      }

      const discussion =
        await createDiscussionService(
          req.params.projectId,
          req.user.id,
          message.trim()
        );

      res.status(201).json({
        success: true,
        data: discussion,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=========================
NOTES
=========================
*/

export const getNotes =
  async (req, res) => {

    try {

      const notes =
        await getNotesByProject(
          req.params.projectId
        );

      res.json({
        success: true,
        total: notes.length,
        data: notes,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const createNote =
  async (req, res) => {

    try {

      const { content } =
        req.body;

      if (!content?.trim()) {

        return res.status(400).json({
          success: false,
          message: 'Content required',
        });
      }

      const note =
        await createNoteService(
          req.params.projectId,
          req.user.id,
          content.trim()
        );

      res.status(201).json({
        success: true,
        data: note,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=========================
VOTE
=========================
*/

export const voteIdea =
  async (req, res) => {

    try {

      const result =
        await voteIdeaService(
          req.params.id,
          req.user.id
        );

      res.json({
        success: true,
        data: result,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=========================
IDEA COMMENTS
=========================
*/

export const getIdeaComments =
  async (req, res) => {

    try {

      const comments =
        await getIdeaCommentsService(
          req.params.ideaId
        );

      res.json({
        success: true,
        total: comments.length,
        data: comments,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const createIdeaComment =
  async (req, res) => {

    try {

      const { text } =
        req.body;

      if (!text?.trim()) {

        return res.status(400).json({
          success: false,
          message: 'Comment required',
        });
      }

      const comment =
        await createIdeaCommentService(
          req.params.ideaId,
          req.user.id,
          text.trim()
        );

      res.status(201).json({
        success: true,
        data: comment,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteIdeaComment =
  async (req, res) => {

    try {

      const comment =
        await getIdeaCommentByIdService(
          req.params.commentId
        );

      if (!comment) {

        return res.status(404).json({
          success: false,
          message: 'Comment not found',
        });
      }

      const isOwner =
        Number(comment.user_id) ===
        Number(req.user.id);

      if (!isOwner) {

        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      await deleteIdeaCommentService(
        req.params.commentId
      );

      res.json({
        success: true,
        message: 'Comment deleted',
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };