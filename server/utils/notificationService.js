
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Registration from "../models/Registration.js";

export const sendNotification = async (data) => {
  try {
    return await Notification.create(data);
  } catch (error) {
    console.error("Notification creation error:", error);
    return null;
  }
};

export const notifyAdmins = async ({
  title,
  message,
  type = "system",
  event = null,
}) => {
  try {
    const admins = await User.find({
      role: "admin",
      isActive: true,
    }).select("_id");

    if (!admins.length) return;

    await Notification.insertMany(
      admins.map((admin) => ({
        recipient: admin._id,
        title,
        message,
        type,
        event,
      }))
    );
  } catch (error) {
    console.error("Admin notification error:", error);
  }
};

export const notifyEventParticipants = async ({
  eventId,
  title,
  message,
  type,
}) => {
  try {
    const registrations = await Registration.find({
      event: eventId,
      status: "registered",
    }).select("participant");

    const recipientIds = [
      ...new Set(
        registrations.map((registration) =>
          registration.participant.toString()
        )
      ),
    ];

    if (!recipientIds.length) return;

    await Notification.insertMany(
      recipientIds.map((recipient) => ({
        recipient,
        title,
        message,
        type,
        event: eventId,
      }))
    );
  } catch (error) {
    console.error("Participant notification error:", error);
  }
};

export const notifyEventOrganizer = async ({
  organizerId,
  title,
  message,
  type = "system",
  event = null,
}) => {
  return sendNotification({
    recipient: organizerId,
    title,
    message,
    type,
    event,
  });
};
