import {

  createJoinRequest,

  getTeamRequests,

  approveRequest,

  rejectRequest,

} from '../services/teamRequestService.js';

/*
=========================
CREATE JOIN REQUEST
=========================
*/

export const createRequest =
  async (req, res) => {

    try {

      const {
        team_id,
        role,
        reason,
      } = req.body;

      /*
      =========================
      AUTH USER
      =========================
      */

      const user_id =
        req.user.id;

      /*
      =========================
      CREATE REQUEST
      =========================
      */

      const request =
        await createJoinRequest({

          team_id,

          user_id,

          role,

          reason,

        });

      res.status(201).json({

        success: true,

        message:
          'Join request submitted',

        data: request,
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
GET TEAM REQUESTS
=========================
*/

export const getRequests =
  async (req, res) => {

    try {

      const { teamId } =
        req.params;

      const requests =
        await getTeamRequests(
          teamId
        );

      res.json({

        success: true,

        total:
          requests.length,

        data: requests,
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
APPROVE REQUEST
=========================
*/

export const approve =
  async (req, res) => {

    try {

      const { requestId } =
        req.params;

      await approveRequest(
        requestId
      );

      res.json({

        success: true,

        message:
          'Request approved',
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
REJECT REQUEST
=========================
*/

export const reject =
  async (req, res) => {

    try {

      const { requestId } =
        req.params;

      await rejectRequest(
        requestId
      );

      res.json({

        success: true,

        message:
          'Request rejected',
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