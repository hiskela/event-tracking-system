
import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

dotenv.config();

const syncEventRegistrationCounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const events = await Event.find();

    for (const event of events) {
      const count = await Registration.countDocuments({
        event: event._id,
        status: { $in: ["registered", "attended"] },
      });

      event.registeredCount = count;
      await event.save();

      console.log(`${event.title}: ${count} occupied seats`);
    }

    console.log("Registration counts synchronized successfully.");
  } catch (error) {
    console.error("Synchronization failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

syncEventRegistrationCounts();
