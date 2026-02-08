import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = Router();

router.get("/", requireAuth, getEvents);
router.get("/:id", requireAuth, getEventById);
router.post("/", requireAuth, requireAdmin, createEvent);
router.put("/:id", requireAuth, requireAdmin, updateEvent);
router.delete("/:id", requireAuth, requireAdmin, deleteEvent);

export default router;
