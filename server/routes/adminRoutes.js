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
router.get("/events", protect, authorize("admin"), async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;
    const filter = {};
    const validStatuses = ["draft", "published", "cancelled", "completed"];

    if (search.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { location: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (status && validStatuses.includes(status)) {
      filter.status = status;
    }

    const events = await Event.find(filter)
      .populate("organizer", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events",
    });
  }
});

router.patch(
  "/events/:id/status",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ["draft", "published", "cancelled", "completed"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid event status",
        });
      }

      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      )
        .populate("organizer", "name email")
        .populate("category", "name");

      if (!event) {
        return res.status(404).json({
          message: "Event not found",
        });
      }

      res.status(200).json({
        message: "Event status updated successfully",
        event,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update event status",
      });
    }
  }
);

export default router;