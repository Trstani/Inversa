import bcrypt from 'bcrypt';
import pool from '../config/database.js';

export const registerUser = async ({
  name,
  email,
  password,
}) => {

   await pool.query(
    `
    DELETE FROM users
    WHERE
      is_verified = false
    AND
      created_at <
      NOW() - INTERVAL '3 hours'
    `
  );


  // cek email sudah ada atau belum
  const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('Email already registered');
  }

  // hash password
  const hashedPassword =
    await bcrypt.hash(password, 10);

  // insert user
  const result = await pool.query(
    `
      INSERT INTO users
      (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, role
    `,
    [name, email, hashedPassword]
  );

  return result.rows[0];
};

export const loginUser = async ({
  email,
  password,
}) => {

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error(
      'Invalid email or password'
    );
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isMatch) {
    throw new Error(
      'Invalid email or password'
    );
  }

  if (!user.is_verified) {

    throw new Error(
      'Please verify your email first'
    );

  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};