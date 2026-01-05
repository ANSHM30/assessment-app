import express from 'express';
import { startAttempt, submitAttempt } from '../controllers/attemptController';
import authMiddleware from '../middlewares/auth';

const router = express.Router();

router.post('/start', authMiddleware(['candidate']), startAttempt);
router.post('/:id/submit', authMiddleware(['candidate']), submitAttempt);

export default router;
