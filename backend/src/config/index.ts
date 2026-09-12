import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'techpulse_super_secret_jwt_key_2026_production_ready',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
