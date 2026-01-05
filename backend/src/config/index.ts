import dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    NODE_ENV: process.env.NODE_ENV || 'development',
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || '.domain.com'
};
