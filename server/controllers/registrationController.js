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
    });

    if (existingRegistration?.status === "registered") {
      return res.status(409).json({
        message: "You are already registered for this event",
      });
    }

    if (existingRegistration?.status === "attended") {
      return res.status(409).json({
        message: "You have already attended this event",
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

    const ticketCode = `EVT-${crypto.randomBytes(6)
      .toString("hex")
      .toUpperCase()}`;

    const qrCode = await QRCode.toDataURL(ticketCode);

    let registration;

    if (existingRegistration?.status === "cancelled") {
      existingRegistration.status = "registered";
      existingRegistration.ticketCode = ticketCode;
      existingRegistration.qrCode = qrCode;
      existingRegistration.checkedIn = false;
      existingRegistration.checkedInAt = null;

      registration = await existingRegistration.save();
    } else {
      registration = await Registration.create({
        event: event._id,
        participant: req.user.userId,
        ticketCode,
        qrCode,
      });
    }

    return res.status(201).json({
      message: "Registration successful",
      registration,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You are already registered for this event",
      });
    }

    return res.status(500).json({
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
        "title description image location startDate endDate price status organizer"
      )
      .populate("participant", "name email");

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    const isParticipant =
      registration.participant._id.toString() === req.user.userId;

    const isEventOrganizer =
      registration.event &&
      registration.event.organizer.toString() === req.user.userId &&
      req.user.role === "organizer";

    if (!isParticipant && !isEventOrganizer) {
      return res.status(403).json({
        message: "You are not allowed to view this ticket",
      });
    }

    return res.status(200).json({
      message: "Ticket fetched successfully",
      ticket: registration,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch ticket",
    });
  }
};



export const checkInParticipant = async (req, res) => {
  try {
    const { ticketCode, eventId } = req.body;

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

    if (
      eventId &&
      registration.event._id.toString() !== eventId
    ) {
      return res.status(400).json({
        message: "This ticket belongs to a different event.",
      });
    }

    if (
      registration.event.organizer.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only check in participants for your own events",
      });
    }

    if (registration.status !== "registered") {
      return res.status(400).json({
        message: "This ticket is not valid for check-in",
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

    return res.status(200).json({
      message: "Participant checked in successfully",
      registration,
    });
  } catch (error) {
    console.error("Check-in error:", error);

    return res.status(500).json({
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
export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      _id: req.params.id,
      participant: req.user.userId,
    }).populate("event", "startDate registrationDeadline status");

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    if (registration.status !== "registered") {
      return res.status(400).json({
        message: "Only active registrations can be cancelled",
      });
    }

    if (registration.checkedIn) {
      return res.status(400).json({
        message: "A checked-in ticket cannot be cancelled",
      });
    }

    if (new Date() >= new Date(registration.event.startDate)) {
      return res.status(400).json({
        message: "Registration cannot be cancelled after the event starts",
      });
    }

    registration.status = "cancelled";
    await registration.save();

    return res.status(200).json({
      message: "Registration cancelled successfully",
      registration,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to cancel registration",
    });
  }
};