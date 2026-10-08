import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createEvent,
  getEvents,
getEvent,
updateEvent,
deleteEvent,
getMyEvents,
getOrganizerDashboard
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.get(
  "/my-events",
  protect,
  authorize("organizer"),
  getMyEvents
);
router.get(
  "/organizer-dashboard",
  protect,
  authorize("organizer"),
  getOrganizerDashboard
);
router.get("/:id", getEvent);


router.post(
  "/",
  protect,
  authorize("organizer"),
  createEvent
);

router.put("/:id", protect, authorize("organizer"), updateEvent);

router.delete(
  "/:id",
  protect,
  authorize("organizer"),
  deleteEvent,

);

export default router;