import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createOrganizerRequest,
  getOrganizerRequests,
  updateOrganizerRequest,
} from "../controllers/organizerRequestController.js";

const router = express.Router();

router.post("/", protect, createOrganizerRequest);

router.get("/", protect, authorize("admin"), getOrganizerRequests);

router.put("/:id", protect, authorize("admin"), updateOrganizerRequest);

export default router;