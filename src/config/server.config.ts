import { config as configDotenv } from 'dotenv';
configDotenv();

export const PORT = process.env.PORT || 3000;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';