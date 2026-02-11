import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post(
  "/",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  createEvent,
);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  updateEvent,
);
router.delete("/:id", requireAuth, requireAdmin, deleteEvent);

export default router;
