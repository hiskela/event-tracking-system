import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { registerForEvent, getMyRegistrations } from "../controllers/registrationController.js";

const router = express.Router();
router.get(
  "/my-registrations",
  protect,
  authorize("participant"),
  getMyRegistrations,
getMyRegistration,
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