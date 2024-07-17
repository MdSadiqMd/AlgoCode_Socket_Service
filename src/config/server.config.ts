import { configDotenv } from 'dotenv';
configDotenv();

export const PORT = process.env.PORT || 3000;