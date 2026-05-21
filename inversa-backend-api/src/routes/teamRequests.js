import express
  from 'express';

import authMiddleware
  from '../middleware/authMiddleware.js';

import {

  createRequest,

  getRequests,

  approve,

  reject,

} from '../controllers/teamRequestController.js';

import pool
  from '../config/database.js';

const router =
  express.Router();

/*
=========================
CREATE REQUEST
=========================
*/

router.post(
  '/',
  authMiddleware,
  createRequest
);

/*
=========================
GET TEAM REQUESTS
=========================
*/

router.get(
  '/team/:teamId',
  authMiddleware,
  getRequests
);

/*
=========================
APPROVE REQUEST
=========================
*/

router.patch(
  '/:requestId/approve',
  authMiddleware,
  approve
);

/*
=========================
REJECT REQUEST
=========================
*/

router.patch(
  '/:requestId/reject',
  authMiddleware,
  reject
);

router.delete(
  '/:requestId',
  authMiddleware,

  async (req, res) => {

    try {

      const { requestId } =
        req.params;

      await pool.query(
        `
        DELETE
        FROM team_join_requests

        WHERE id = $1
        `,
        [requestId]
      );

      res.json({

        success: true,

        message:
          'Request deleted',
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  }
);

export default router;