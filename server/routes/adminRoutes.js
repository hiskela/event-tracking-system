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

router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const { search = "", role = "" } = req.query;
    const filter = {};

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (role && ["admin", "organizer", "participant"].includes(role)) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

export default router;