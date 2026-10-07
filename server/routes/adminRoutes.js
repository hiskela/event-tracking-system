import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Welcome to the admin dashboard",
    user: req.user,
  });
});

export default router;