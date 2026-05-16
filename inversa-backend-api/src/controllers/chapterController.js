import {
  createChapter,
  getChaptersByProject,
} from '../services/chapterService.js';

export const create = async (
  req,
  res
) => {

  try {

    const {
      project_id,
      chapter_number,
      title,
    } = req.body;

    const chapter =
      await createChapter({
        project_id,
        chapter_number,
        title,
      });

    res.status(201).json({
      success: true,
      message:
        'Chapter created successfully',

      data: chapter,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getByProject =
  async (req, res) => {

    try {

      const { projectId } =
        req.params;

      const chapters =
        await getChaptersByProject(
          projectId
        );

      res.json({
        success: true,
        total: chapters.length,
        data: chapters,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
};