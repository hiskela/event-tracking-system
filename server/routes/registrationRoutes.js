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
  authorize("participant"),
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
  authorize("participant"),
  getMyRegistration
);

router.post(
  "/:eventId",
  protect,
  authorize("participant"),
  registerForEvent
);

export default router;