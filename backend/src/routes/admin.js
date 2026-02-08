import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { getStats } from "../controllers/adminController.js";
import { getUsers, toggleApproval } from "../controllers/userController.js";

const router = Router();

// All admin routes require auth + admin
router.use(requireAuth, requireAdmin);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/approve", toggleApproval);

export default router;
