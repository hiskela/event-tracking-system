import crypto from "crypto";
import QRCode from "qrcode"
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
if (event.organizer.toString() === req.user.userId) {
  return res.status(400).json({
    message: "You cannot register for your own event",
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
const qrCode = await QRCode.toDataURL(ticketCode);

    const registration = await Registration.create({
      event: event._id,
      participant: req.user.userId,
      ticketCode,
  qrCode,

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
      .populate(
        "event",
        "title description image location startDate endDate price status"
      )
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

    res.status(200).json({
      message: "Ticket fetched successfully",
      ticket: registration,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ticket",
    });
  }
};
export const checkInParticipant = async (req, res) => {
  try {
    const { ticketCode } = req.body;

    if (!ticketCode) {
      return res.status(400).json({
        message: "Ticket code is required",
      });
    }

    const registration = await Registration.findOne({
      ticketCode,
    }).populate("event", "title organizer");

    if (!registration) {
      return res.status(404).json({
        message: "Invalid ticket",
      });
    }

    if (registration.event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only check in participants for your own events",
      });
    }

    if (registration.status === "cancelled") {
      return res.status(400).json({
        message: "This registration has been cancelled",
      });
    }

    if (registration.checkedIn) {
      return res.status(400).json({
        message: "Participant has already checked in",
      });
    }

    registration.checkedIn = true;
    registration.checkedInAt = new Date();
    registration.status = "attended";

    await registration.save();

    res.status(200).json({
      message: "Participant checked in successfully",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check in participant",
    });
  }
};
export const getParticipantDashboard = async (req, res) => {
  try {
    const registrations = await Registration.find({
      participant: req.user.userId,
    })
      .populate("event", "title image location startDate endDate status")
      .sort({ createdAt: -1 });

    const totalRegistrations = registrations.length;

    const upcomingEvents = registrations.filter(
      (registration) =>
        registration.status === "registered" &&
        registration.event &&
        new Date(registration.event.startDate) > new Date()
    ).length;

    const attendedEvents = registrations.filter(
      (registration) => registration.status === "attended"
    ).length;

    const cancelledRegistrations = registrations.filter(
      (registration) => registration.status === "cancelled"
    ).length;

    res.status(200).json({
      totalRegistrations,
      upcomingEvents,
      attendedEvents,
      cancelledRegistrations,
      recentRegistrations: registrations.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch participant dashboard",
    });
  }
};
