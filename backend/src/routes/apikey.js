import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  saveApiKey,
  hasApiKey,
  deleteApiKey,
} from "../controllers/apiKeyController.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// POST /api/apikey - Save or update API key
router.post("/", saveApiKey);

// GET /api/apikey/check - Check if user has API key
router.get("/check", hasApiKey);

// DELETE /api/apikey - Delete API key
router.delete("/", deleteApiKey);

export default router;
