import {
  registerUser,
  loginUser,
} from '../services/authService.js';

import generateToken from '../utils/generateToken.js';

export const register = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    const user = await registerUser({
      name,
      email,
      password,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message:
        'User registered successfully',

      data: {
        user,
        token,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const user = await loginUser({
      email,
      password,
    });

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',

      data: {
        user,
        token,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(401).json({
      success: false,
      message: error.message,
    });

  }
};