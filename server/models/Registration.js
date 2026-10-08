import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ticketCode: {
      type: String,
      required: true,
      unique: true,
    },
qrCode: {
  type: String,
  default: "",
},
    status: {
      type: String,
      enum: ["registered", "cancelled", "attended"],
      default: "registered",
    },


    checkedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index(
  { event: 1, participant: 1 },
  { unique: true }
);

const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

export default Registration;