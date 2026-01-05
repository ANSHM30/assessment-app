import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';

export const startAttempt = async (req: AuthRequest, res: Response) => {
    const { userId, assessmentId } = req.user;

    try {
        const attempt = { id: 'attempt-uuid', userId, assessmentId, status: 'started' };
        res.status(201).json(attempt);
    } catch (error) {
        res.status(500).json({ message: 'Error starting attempt' });
    }
};

export const submitAttempt = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { answers } = req.body;

    try {
        res.json({ message: 'Assessment submitted and locked' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting attempt' });
    }
};
