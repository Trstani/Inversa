import dotenv from 'dotenv';

dotenv.config();

const env = {
  // ================= SERVER =================
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // ================= DATABASE =================
  DATABASE_URL: process.env.DATABASE_URL,

  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,

  // ================= JWT =================
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // ================= FRONTEND =================
  FRONTEND_URL:
    process.env.FRONTEND_URL ||
    'http://localhost:5173',
};

export default env;