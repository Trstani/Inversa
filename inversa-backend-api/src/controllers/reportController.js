import {

  getAllReports,
  createReport,
  deleteReport,

} from '../services/reportService.js';

/*
=========================
GET REPORTS
=========================
*/

export const getReports =
  async (req, res) => {

    try {

      const reports =
        await getAllReports();

      res.json({
        success: true,
        data: reports,
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
CREATE REPORT
=========================
*/

export const createNewReport =
  async (req, res) => {

    try {

      const {
        project_id,
        reason,
        note,
      } = req.body;

      const report =
        await createReport({

          project_id,

          reported_by:
            req.user.id,

          reason,

          note,
        });

      res.status(201).json({
        success: true,
        data: report,
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
DELETE REPORT
=========================
*/

export const removeReport =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await deleteReport(id);

      res.json({
        success: true,
        message: 'Report deleted',
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};