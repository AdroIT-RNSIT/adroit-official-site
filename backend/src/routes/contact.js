import { Router } from "express";
import { createContact } from "../controllers/contactController.js";

const router = Router();

// Public — no auth required
router.post("/", createContact);

export default router;
