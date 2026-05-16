import {
  createProject,
  getAllProjects,
  getProjectById,
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