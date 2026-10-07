import crypto from "crypto";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.status !== "published") {
      return res.status(400).json({
        message: "Registration is not available for this event",
      });
    }

    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        message: "Registration deadline has passed",
      });
    }

    const existingRegistration = await Registration.findOne({
      event: event._id,
      participant: req.user.userId,
      status: "registered",
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You are already registered for this event",
      });
    }

    const registrationCount = await Registration.countDocuments({
      event: event._id,
      status: "registered",
    });

    if (registrationCount >= event.capacity) {
      return res.status(400).json({
        message: "This event is full",
      });
    }

    const ticketCode = `EVT-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

    const registration = await Registration.create({
      event: event._id,
      participant: req.user.userId,
      ticketCode,
    });

    res.status(201).json({
      message: "Registration successful",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register for event",
    });
  }
};
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      participant: req.user.userId,
    })
      .populate("event", "title image location startDate endDate price status")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your registrations",
    });
  }
};
export const getMyRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate("event", "title image location startDate endDate price status")
      .populate("participant", "name email");

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    if (registration.participant._id.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only view your own ticket",
      });
    }

    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ticket",
    });
  }
};