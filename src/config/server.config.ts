import { config as configDotenv } from 'dotenv';
configDotenv();

const serverConfig = {
    PORT: process.env.PORT || 3001,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    REDIS_PORT: process.env.REDIS_PORT || "6379",
    REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
};

export default serverConfig;