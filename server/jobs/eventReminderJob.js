
import cron from "node-cron";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Notification from "../models/Notification.js";
import ReminderDelivery from "../models/ReminderDelivery.js";

let isRunning = false;

const sendReminder = async (event, reminderType, title, message) => {
  const existing = await ReminderDelivery.findOne({
    event: event._id,
    reminderType,
  });

  if (existing) return;

  const registrations = await Registration.find({
    event: event._id,
    status: "registered",
  }).select("participant");

  const recipientIds = new Set(
    registrations.map((registration) =>
      registration.participant.toString()
    )
  );

  recipientIds.add(event.organizer.toString());

  const notifications = [...recipientIds].map((recipient) => ({
    recipient,
    title,
    message,
    type: "event_reminder",
    event: event._id,
  }));

  await Notification.insertMany(notifications);

  await ReminderDelivery.create({
    event: event._id,
    reminderType,
    sentAt: new Date(),
  });
};

const processReminderWindow = async ({
  offsetHours,
  reminderType,
  title,
}) => {
  const now = Date.now();
  const offsetMs = offsetHours * 60 * 60 * 1000;
  const windowMs = 30 * 60 * 1000;

  const events = await Event.find({
    status: "published",
    startDate: {
      $gt: new Date(now),
      $gte: new Date(now + offsetMs - windowMs),
      $lte: new Date(now + offsetMs),
    },
  });

  for (const event of events) {
    try {
      await sendReminder(
        event,
        reminderType,
        title,
        `"${event.title}" starts in approximately ${offsetHours} hour${offsetHours === 1 ? "" : "s"}. Location: ${event.location}.`
      );
    } catch (error) {
      if (error.code !== 11000) {
        console.error(
          `Reminder failed for event ${event._id}:`,
          error
        );
      }
    }
  }
};

export const startEventReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    if (isRunning) return;

    isRunning = true;

    try {
      await processReminderWindow({
        offsetHours: 5,
        reminderType: "5_hours",
        title: "Event Reminder: 5 Hours Left",
      });

      await processReminderWindow({
        offsetHours: 1,
        reminderType: "1_hour",
        title: "Event Reminder: 1 Hour Left",
      });
    } catch (error) {
      console.error("Event reminder job error:", error);
    } finally {
      isRunning = false;
    }
  });

  console.log("Event reminder scheduler started");
};
