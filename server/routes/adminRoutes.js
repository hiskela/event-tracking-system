import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import OrganizerRequest from "../models/OrganizerRequest.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      pendingRequests,
      totalOrganizers,
      publishedEvents,
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Registration.countDocuments(),
      OrganizerRequest.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "organizer" }),
      Event.countDocuments({ status: "published" }),
    ]);

    res.status(200).json({
      totalUsers,
      totalEvents,
      totalRegistrations,
      pendingRequests,
      totalOrganizers,
      publishedEvents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admin dashboard statistics",
    });
  }
});

export default router;