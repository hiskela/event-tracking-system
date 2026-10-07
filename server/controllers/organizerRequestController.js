import OrganizerRequest from "../models/OrganizerRequest.js";
import User from "../models/User.js";

export const createOrganizerRequest = async (req, res) => {
  try {
    const { organization, reason, phone, additionalInfo } = req.body;

    if (!organization || !reason || !phone) {
      return res.status(400).json({
        message: "Organization, reason, and phone are required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "participant") {
      return res.status(400).json({
        message: "Only participants can request organizer access",
      });
    }

    const existingRequest = await OrganizerRequest.findOne({
      user: req.user.userId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already submitted an organizer request",
      });
    }

    const request = await OrganizerRequest.create({
      user: req.user.userId,
      organization,
      reason,
      phone,
      additionalInfo,
    });

    res.status(201).json({
      message: "Organizer request submitted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit organizer request",
    });
  }
};
export const getOrganizerRequests = async (req, res) => {
  try {
    const requests = await OrganizerRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch organizer requests",
    });
  }
};

export const updateOrganizerRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid request status",
      });
    }

    const request = await OrganizerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Organizer request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed",
      });
    }

    request.status = status;
    await request.save();

    if (status === "approved") {
      await User.findByIdAndUpdate(request.user, {
        role: "organizer",
      });
    }

    res.status(200).json({
      message: `Organizer request ${status}`,
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update organizer request",
    });
  }
};