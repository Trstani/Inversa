import {
  getDashboardStats,
} from '../services/adminService.js';

export const getDashboard =
  async (req, res) => {

    try {

      const stats =
        await getDashboardStats();

      res.json({
        success: true,
        data: stats,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};