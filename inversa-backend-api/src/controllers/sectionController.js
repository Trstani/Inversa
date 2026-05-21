import {
  createSection,
  getSectionsByChapter,
  updateSection,
  deleteSection,
  reorderSection,
  lockSection,
  unlockSection,
} from '../services/sectionService.js';

export const create = async (
  req,
  res
) => {

  try {

    const {
      chapter_id,
      type,
      content,
      image_url,
      caption,
      section_order,
    } = req.body;

    const section =
      await createSection({
        chapter_id,
        type,
        content,
        image_url,
        caption,
        section_order,
      });

    res.status(201).json({
      success: true,
      message:
        'Section created successfully',

      data: section,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getByChapter =
  async (req, res) => {

    try {

      const { chapterId } =
        req.params;

      const sections =
        await getSectionsByChapter(
          chapterId
        );

      res.json({
        success: true,
        total: sections.length,
        data: sections,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
};

export const update = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      content,
      image_url,
      caption,
    } = req.body;

    const section =
      await updateSection({
        id,
        content,
        image_url,
        caption,
      });

    res.json({
      success: true,
      message:
        'Section updated successfully',

      data: section,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const remove = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const deleted =
      await deleteSection(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    res.json({
      success: true,
      message:
        'Section deleted successfully',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const reorder = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const { section_order } =
      req.body;

    const section =
      await reorderSection({
        id,
        section_order,
      });

    res.json({
      success: true,
      message:
        'Section reordered successfully',

      data: section,
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
LOCK SECTION
=========================
*/

export const lock =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const userId =
        req.user.id;

      const section =
        await lockSection({

          sectionId: id,
          userId,

        });

      res.json({

        success: true,

        message:
          'Section locked',

        data: section,

      });

    } catch (error) {

      console.error(error);

      res.status(409).json({

        success: false,

        message:
          error.message,

      });

    }
  };

/*
=========================
UNLOCK SECTION
=========================
*/

export const unlock =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const userId =
        req.user.id;

      const section =
        await unlockSection({

          sectionId: id,
          userId,

        });

      res.json({

        success: true,

        message:
          'Section unlocked',

        data: section,

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