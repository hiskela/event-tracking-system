import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import organizerRequestRoutes from './routes/organizerRequestRoute.js'
import categoryRoutes from "./routes/categoryRoutes.js";
import eventRoutes from "./routes/eventRoutes.js"
import registrationRoutes from "./routes/registrationRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/organizer-requests", organizerRequestRoutes)
app.use("/api/registrations", registrationRoutes);
app.use("/api/categories", categoryRoutes)
app.use("/api/events", eventRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "Event Tracking API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});