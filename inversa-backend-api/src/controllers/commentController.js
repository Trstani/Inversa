import {
  getCommentsByChapter,
  createComment,
  deleteComment,
} from '../services/commentService.js';

/*
=========================
GET COMMENTS
=========================
*/

export const getByChapter =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const comments =
        await getCommentsByChapter(
          id
        );

      res.json({

        success: true,

        total:
          comments.length,

        data:
          comments,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
};

/*
=========================
CREATE COMMENT
=========================
*/

export const create =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        text,
      } = req.body;

      const comment =
        await createComment({

          chapter_id:
            id,

          user_id:
            req.user.id,

          text,
        });

      res.status(201).json({

        success: true,

        data:
          comment,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
};

/*
=========================
DELETE COMMENT
=========================
*/

export const remove =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const deleted =
        await deleteComment(
          id
        );

      res.json({

        success: true,

        data:
          deleted,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
};