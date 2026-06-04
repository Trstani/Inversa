import {
  registerUser,
  loginUser,
} from '../services/authService.js';

import {
  createEmailVerification,
  verifyEmailOTP,
  resendOTP
}from '../services/emailVerificationService.js';

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

    const user =
      await registerUser({
        name,
        email,
        password,
      });

    const otp =
      await createEmailVerification(
        user.id,
        user.email
      );


    res.status(201).json({

      success: true,

      message:
        'Registration successful. Please verify your email.',

      data: {
        userId: user.id,
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

export const verifyEmail =
async (
  req,
  res
) => {

  try {

    const {
      email,
      otp,
    } = req.body;

    await verifyEmailOTP(
      email,
      otp
    );

    res.json({

      success: true,

      message:
        'Email verified successfully',

    });

  } catch (error) {

    console.error(error);

    res.status(400).json({

      success: false,

      message:
        error.message,

    });

  }

};

export const resendEmailOTP =
async (
  req,
  res
) => {

  try {

    const {
      email
    } = req.body;

    const otp =
      await resendOTP(
        email
      );

    res.json({

      success: true,

      message:
        'OTP resent successfully',

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message:
        error.message,

    });

  }

};