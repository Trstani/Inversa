import {
  saveReadingHistory,
  getUserHistory,
} from '../services/historyService.js';

/*
=========================
SAVE HISTORY
=========================
*/

export const saveHistory =
  async (req, res) => {

    try {

      const {
        project_id,
        chapter_id,
        progress,
      } = req.body;

      const history =
        await saveReadingHistory({

          user_id:
            req.user.id,

          project_id,
          chapter_id,
          progress,
        });

      res.json({
        success: true,
        data: history,
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
GET MY HISTORY
=========================
*/

export const getMyHistory =
  async (req, res) => {

    try {

      const history =
        await getUserHistory(
          req.user.id
        );

      res.json({
        success: true,
        data: history,
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
GET USER HISTORY
=========================
*/

export const getUserHistoryByUser =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const history =
        await getUserHistory(
          userId
        );

      res.json({
        success: true,
        data: history,
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