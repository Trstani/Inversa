import {
  createProject,
  getAllProjects,
  getProjectById,
  getPublishedProjects,
  deleteProject,
  hideProjectService,
  unhideProjectService,
  incrementProjectViews,
  likeProjectService,
  followProjectService,
  getMyFollowedProjects,
  checkLikeStatus,
  checkFollowStatus,
} from '../services/projectService.js';

export const create = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      category_id,
      genre_id,
      is_team_project,
      team_id,
      background_image,
    } = req.body;

    const project =
      await createProject({

        title,
        description,
        category_id,
        genre_id,
        is_team_project,
        team_id,
        background_image,

        initiator_id:
          req.user.id,
      });

    res.status(201).json({
      success: true,
      message:
        'Project created successfully',

      data: project,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getAll = async (
  req,
  res
) => {

  try {

    const projects =
      await getAllProjects();

    res.json({
      success: true,
      total: projects.length,
      data: projects,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getById = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const project =
      await getProjectById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: project,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getPublished =
  async (req, res) => {

    try {

      const projects =
        await getPublishedProjects();

      res.json({
        success: true,
        total: projects.length,
        data: projects,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

export const remove =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const deleted =
        await deleteProject(id);

      if (!deleted) {

        return res.status(404).json({
          success: false,
          message:
            "Project not found",
        });
      }

      res.json({
        success: true,
        message:
          "Project deleted successfully",
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
HIDE PROJECT
=========================
*/

export const hideProject =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const project =
        await hideProjectService(id);

      res.json({
        success: true,
        data: project,
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
UNHIDE PROJECT
=========================
*/

export const unhideProject =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const project =
        await unhideProjectService(id);

      res.json({
        success: true,
        data: project,
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
INCREMENT VIEWS
=========================
*/

export const incrementViews =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const result =
        await incrementProjectViews(
          id
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
LIKE PROJECT
=========================
*/

export const likeProject =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const result =
        await likeProjectService(
          id,
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
        message:
          error.message,
      });
    }
};

/*
=========================
FOLLOW PROJECT
=========================
*/

export const followProject =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const result =
        await followProjectService(
          id,
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
        message:
          error.message,
      });
    }
};

/*
=========================
GET MY FOLLOWS
=========================
*/

export const getMyFollows =
  async (req, res) => {

    try {

      const projects =
        await getMyFollowedProjects(
          req.user.id
        );

      res.json({
        success: true,
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
GET USER FOLLOWS
=========================
*/

export const getUserFollows =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const projects =
        await getMyFollowedProjects(
          userId
        );

      res.json({
        success: true,
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
GET INTERACTIONS
=========================
*/

export const getInteractions =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const liked =
        await checkLikeStatus(
          id,
          req.user.id
        );

      const followed =
        await checkFollowStatus(
          id,
          req.user.id
        );

      res.json({
        success: true,

        data: {
          liked,
          followed,
        },
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