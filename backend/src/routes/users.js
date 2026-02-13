import { Router } from "express";
import {
    getProfile,
    updateProfile,
    changePassword,
    updateSettings,
} from "../controllers/profileController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.put("/password", requireAuth, changePassword);
router.put("/settings", requireAuth, updateSettings);

export default router;
