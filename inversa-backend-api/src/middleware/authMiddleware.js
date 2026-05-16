import jwt from 'jsonwebtoken';

import env from '../config/env.js';

const authMiddleware = (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token =
      authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.error(error);

    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });

  }
};

export default authMiddleware;