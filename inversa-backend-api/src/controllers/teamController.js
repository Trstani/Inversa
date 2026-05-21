import {
  createTeam,
  getTeamById,
  getUserTeams,
  getTeamProjects,
  deleteTeam,
  getAllTeams,
} from '../services/teamService.js';

/*
=========================
CREATE TEAM
=========================
*/

export const create =
  async (req, res) => {

    try {

      const {
        title,
        description,
        background_image,
      } = req.body;

      /*
      =========================
      AUTH USER
      =========================
      */

      const initiator_id =
        req.user.id;

      /*
      =========================
      CREATE TEAM
      =========================
      */

      const team =
        await createTeam({

          title,

          description,

          background_image,

          initiator_id,

        });

      res.status(201).json({

        success: true,

        message:
          'Team created successfully',

        data: team,
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
GET TEAM BY ID
=========================
*/

export const getById =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const team =
        await getTeamById(id);

      if (!team) {

        return res.status(404).json({

          success: false,

          message:
            'Team not found',
        });
      }

      res.json({

        success: true,

        data: team,
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
GET USER TEAMS
=========================
*/

export const getUserTeamsController =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const teams =
        await getUserTeams(
          userId
        );

      res.json({

        success: true,

        total:
          teams.length,

        data: teams,
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
GET TEAM PROJECTS
=========================
*/

export const getProjects =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const projects =
        await getTeamProjects(
          id
        );

      res.json({

        success: true,

        total:
          projects.length,

        data: projects,
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
DELETE TEAM
=========================
*/

export const remove =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const deleted =
        await deleteTeam(id);

      if (!deleted) {

        return res.status(404).json({

          success: false,

          message:
            'Team not found',
        });
      }

      res.json({

        success: true,

        message:
          'Team deleted successfully',
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


export const getAll =
  async (req, res) => {

    try {

      const teams =
        await getAllTeams();

      res.json({

        success: true,

        total:
          teams.length,

        data: teams,
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