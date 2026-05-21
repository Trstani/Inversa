import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },

    env.JWT_SECRET,

    {
      expiresIn: env.JWT_EXPIRE,
    }
  );
};

export default generateToken;