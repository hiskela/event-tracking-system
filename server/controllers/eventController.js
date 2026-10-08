import Event from "../models/Event.js";
import Category from "../models/Category.js";
import Registration from "../models/Registration.js";
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      category,
      location,
      startDate,
      endDate,
      registrationDeadline,
      capacity,
      price,
      status,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !startDate ||
      !endDate ||
      !registrationDeadline ||
      !capacity
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    if (new Date(registrationDeadline) >= new Date(startDate)) {
      return res.status(400).json({
        message: "Registration deadline must be before event start",
      });
    }

    const event = await Event.create({
      title,
      description,
      image,
      category,
      organizer: req.user.userId,
      location,
      startDate,
      endDate,
      registrationDeadline,
      capacity,
      price: price || 0,
      status: status || "draft",
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create event",
    });
  }
};
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "published" })
      .populate("category", "name")
      .populate("organizer", "name email")
      .sort({ startDate: 1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events",
    });
  }
};
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("category", "name")
      .populate("organizer", "name email");

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event",
    });
  }
};
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own events",
      });
    }

    const {
      title,
      description,
      image,
      category,
      location,
      startDate,
      endDate,
      registrationDeadline,
      capacity,
      price,
      status,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !startDate ||
      !endDate ||
      !registrationDeadline ||
      !capacity
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    if (new Date(registrationDeadline) >= new Date(startDate)) {
      return res.status(400).json({
        message: "Registration deadline must be before event start",
      });
    }

    event.title = title;
    event.description = description;
    event.image = image || "";
    event.category = category;
    event.location = location;
    event.startDate = startDate;
    event.endDate = endDate;
    event.registrationDeadline = registrationDeadline;
    event.capacity = capacity;
    event.price = price || 0;
    event.status = status || event.status;

    await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update event",
    });
  }
};
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own events",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete event",
    });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.user.userId,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your events",
    });
  }
};
export const getOrganizerDashboard = async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.user.userId,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    const eventIds = events.map((event) => event._id);


    const registrations = await Registration.find({
      event: { $in: eventIds },
    });

    const totalEvents = events.length;

    const publishedEvents = events.filter(
      (event) => event.status === "published"
    ).length;

    const totalRegistrations = registrations.filter(
      (registration) => registration.status !== "cancelled"
    ).length;

    const totalAttendees = registrations.filter(
      (registration) => registration.checkedIn === true
    ).length;

    res.status(200).json({
      totalEvents,
      publishedEvents,
      totalRegistrations,
      totalAttendees,
      recentEvents: events.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch organizer dashboard",
    });
  }
};
export const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only manage your own events",
      });
    }

    const registrations = await Registration.find({
      event: event._id,
    })
      .populate("participant", "name email")
      .sort({ createdAt: -1 });

    const activeRegistrations = registrations.filter(
      (registration) => registration.status !== "cancelled"
    );

    const totalRegistrations = activeRegistrations.length;

    const totalAttendees = activeRegistrations.filter(
      (registration) => registration.checkedIn
    ).length;

    const availableSeats = Math.max(
      event.capacity - totalRegistrations,
      0
    );

    res.status(200).json({
      event,
      registrations,
      stats: {
        totalRegistrations,
        totalAttendees,
        availableSeats,
        capacity: event.capacity,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch event registrations",
    });
  }
};