import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resourceController.js";

const router = Router();

router.get("/", requireAuth, getResources);
router.get("/:id", requireAuth, getResourceById);
router.post("/", requireAuth, requireAdmin, createResource);
router.put("/:id", requireAuth, requireAdmin, updateResource);
router.delete("/:id", requireAuth, requireAdmin, deleteResource);

export default router;
