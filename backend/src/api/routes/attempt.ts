import { Router } from "express";
import { startAttempt, submitAttempt } from "../controllers/attempt.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireCandidate } from "../middlewares/role.middleware";

const router = Router();

router.post("/start", requireAuth, requireCandidate, startAttempt);
router.post("/submit", requireAuth, requireCandidate, submitAttempt);

export default router;
