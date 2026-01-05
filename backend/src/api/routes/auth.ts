import express from 'express';
import { loginCandidate, logout } from '../controllers/authController';

const router = express.Router();

router.post('/login/candidate', loginCandidate);
router.post('/logout', logout);

export default router;
