
import mongoose from "mongoose";

const reminderDeliverySchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    reminderType: {
      type: String,
      enum: ["5_hours", "1_hour"],
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

reminderDeliverySchema.index(
  { event: 1, reminderType: 1 },
  { unique: true }
);

const ReminderDelivery = mongoose.model(
  "ReminderDelivery",
  reminderDeliverySchema
);

export default ReminderDelivery;
