import pool from '../config/database.js';

import {
  sendOTPEmail
} from './emailService.js';

export const generateOTP = () => {

  return Math.floor(
    100000 +
    Math.random() * 900000
  ).toString();

};

export const createEmailVerification =
async (userId, email) => {

  const otp =
    generateOTP();

    await sendOTPEmail(email, otp);

  const expiresAt =
    new Date(
      Date.now() +
      10 * 60 * 1000
    );

  await pool.query(
    `
    INSERT INTO
    email_verifications
    (
      user_id,
      otp_code,
      expires_at
    )
    VALUES
    (
      $1,
      $2,
      $3
    )
    `,
    [
      userId,
      otp,
      expiresAt
    ]
  );

  return otp;

};

export const verifyEmailOTP =
async (
  email,
  otp
) => {

  const userResult =
    await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

  const user =
    userResult.rows[0];

  if (!user) {

    throw new Error(
      'User not found'
    );

  }

  const verificationResult =
    await pool.query(
      `
      SELECT *
      FROM email_verifications
      WHERE
        user_id = $1
      AND
        otp_code = $2
      AND
        used = false
      ORDER BY id DESC
      LIMIT 1
      `,
      [
        user.id,
        otp
      ]
    );

  const verification =
    verificationResult.rows[0];

  if (!verification) {

    throw new Error(
      'Invalid OTP'
    );

  }

  if (
    new Date() >
    new Date(
      verification.expires_at
    )
  ) {

    throw new Error(
      'OTP has expired'
    );

  }

  await pool.query(
    `
    UPDATE users
    SET is_verified = true
    WHERE id = $1
    `,
    [user.id]
  );

  await pool.query(
    `
    UPDATE email_verifications
    SET used = true
    WHERE id = $1
    `,
    [verification.id]
  );

  return true;

};

export const resendOTP =
async (email) => {

  const userResult =
    await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

  const user =
    userResult.rows[0];

  if (!user) {

    throw new Error(
      'User not found'
    );

  }

    const otp =
        generateOTP();

    await sendOTPEmail(
        email,
        otp
    );

  const expiresAt =
    new Date(
      Date.now() +
      10 * 60 * 1000
    );

  await pool.query(
    `
    UPDATE
      email_verifications
    SET
      used = true
    WHERE
      user_id = $1
    AND
      used = false
    `,
    [user.id]
  );

  await pool.query(
    `
    INSERT INTO
    email_verifications
    (
      user_id,
      otp_code,
      expires_at
    )
    VALUES
    (
      $1,
      $2,
      $3
    )
    `,
    [
      user.id,
      otp,
      expiresAt
    ]
  );

  return otp;

};