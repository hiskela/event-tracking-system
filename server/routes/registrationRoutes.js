import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  registerForEvent,
  getMyRegistrations,
  getMyRegistration,
  checkInParticipant,
  getParticipantDashboard,
} from "../controllers/registrationController.js";

const router = express.Router();

router.get(
  "/my-registrations",
  protect,
  authorize("participant", "organizer"),
  getMyRegistrations
);

router.post(
  "/check-in",
  protect,
  authorize("organizer"),
  checkInParticipant
);

router.get(
  "/dashboard",
  protect,
  authorize("participant"),
  getParticipantDashboard
);

router.get(
  "/:id",
  protect,
  authorize("participant", "organizer"),
  getMyRegistration
);

router.post(
  "/:eventId",
  protect,
  authorize("participant", "organizer"),
  registerForEvent
);

export default router;