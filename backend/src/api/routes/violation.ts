import { Router } from "express";
import { logViolation } from "../controllers/violation.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireCandidate } from "../middlewares/role.middleware";

const router = Router();

router.post("/log", requireAuth, requireCandidate, logViolation);

export default router;
