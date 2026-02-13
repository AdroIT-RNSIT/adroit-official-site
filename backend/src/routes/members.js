import { Router } from "express";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getMembers);
router.post("/", requireAuth, requireAdmin, createMember);
router.put("/:id", requireAuth, requireAdmin, updateMember);
router.delete("/:id", requireAuth, requireAdmin, deleteMember);

export default router;
