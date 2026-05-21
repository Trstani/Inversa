import express from 'express';

import pool
  from '../config/database.js';

import authMiddleware
  from '../middleware/authMiddleware.js';

const router =
  express.Router();

/*
=========================
GET ALL USERS
=========================
*/

router.get(
  '/',
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT *

          FROM users

          ORDER BY id DESC
          `
        );

      res.json({

        success: true,

        data:
          result.rows,
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

/*
=========================
GET USER BY ID
=========================
*/

router.get(
  '/:id',

  authMiddleware,

  async (req, res) => {

    try {

      const { id } =
        req.params;

      const result =
        await pool.query(
          `
          SELECT *

          FROM users

          WHERE id = $1

          LIMIT 1
          `,
          [id]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            'User not found',
        });
      }

      res.json({

        success: true,

        data:
          result.rows[0],
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

/*
=========================
UPDATE USER
=========================
*/

router.put(
  '/:id',

  authMiddleware,

  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        name,
        email,
        profile_image,
        bio,
      } = req.body;

      const result =
        await pool.query(
          `
          UPDATE users

          SET
            name = $1,
            email = $2,
            profile_image = $3,
            bio = $4,
            updated_at = NOW()

          WHERE id = $5

          RETURNING *
          `,
          [
            name,
            email,
            profile_image,
            bio,
            id,
          ]
        );

      res.json({

        success: true,

        data:
          result.rows[0],
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