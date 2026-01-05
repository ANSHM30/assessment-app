import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config';
import authRoutes from './api/routes/auth';
import attemptRoutes from './api/routes/attempt';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attempts', attemptRoutes);

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
});
